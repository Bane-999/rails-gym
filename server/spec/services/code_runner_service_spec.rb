require "rails_helper"

RSpec.describe CodeRunnerService do
  let(:exercise_id) { "001_user_validation" }
  let(:files) do
    {
      "app/models/user.rb" =>
        "class User < ApplicationRecord\n  validates :email, presence: true\nend"
    }
  end
  let(:service) { described_class.new(exercise_id, files) }

  describe "#initialize" do
    it "stores exercise_id" do
      expect(service.instance_variable_get(:@exercise_id)).to eq(exercise_id)
    end

    it "stores files" do
      expect(service.instance_variable_get(:@files)).to eq(files)
    end
  end

  describe "#create_submission_dir (private)" do
    it "creates the directory on disk" do
      dir = service.send(:create_submission_dir)
      expect(Dir.exist?(dir)).to be true
      FileUtils.rm_rf(dir)
    end

    it "returns a Pathname inside tmp/submissions" do
      dir = service.send(:create_submission_dir)
      expect(dir.to_s).to include("tmp/submissions/#{exercise_id}")
      FileUtils.rm_rf(dir)
    end

    it "removes existing directory before creating fresh one" do
      dir = service.send(:create_submission_dir)

      # Put a leftover file in there
      File.write(dir.join("leftover.rb"), "old code")
      expect(File.exist?(dir.join("leftover.rb"))).to be true

      # Create again — should be clean
      service.send(:create_submission_dir)
      expect(File.exist?(dir.join("leftover.rb"))).to be false

      FileUtils.rm_rf(dir)
    end
  end

  describe "#write_files_to_disk (private)" do
    it "writes each file to the submission directory" do
      dir = service.send(:create_submission_dir)
      service.send(:write_files_to_disk, dir)

      expect(File.exist?(dir.join("app/models/user.rb"))).to be true

      FileUtils.rm_rf(dir)
    end

    it "writes the correct content" do
      dir = service.send(:create_submission_dir)
      service.send(:write_files_to_disk, dir)

      content = File.read(dir.join("app/models/user.rb"))
      expect(content).to include("validates :email, presence: true")

      FileUtils.rm_rf(dir)
    end

    it "creates nested directories automatically" do
      multi_service = described_class.new(exercise_id, {
        "db/migrate/20240101_add_email.rb" => "class AddEmail < ActiveRecord::Migration\nend"
      })

      dir = multi_service.send(:create_submission_dir)
      multi_service.send(:write_files_to_disk, dir)

      expect(File.exist?(dir.join("db/migrate/20240101_add_email.rb"))).to be true

      FileUtils.rm_rf(dir)
    end

    it "handles multiple files" do
      multi_service = described_class.new(exercise_id, {
        "app/models/user.rb" => "class User < ApplicationRecord\nend",
        "app/models/post.rb" => "class Post < ApplicationRecord\nend"
      })

      dir = multi_service.send(:create_submission_dir)
      multi_service.send(:write_files_to_disk, dir)

      expect(File.exist?(dir.join("app/models/user.rb"))).to be true
      expect(File.exist?(dir.join("app/models/post.rb"))).to be true

      FileUtils.rm_rf(dir)
    end
  end

  describe "#build_docker_command (private)" do
    let(:submission_dir) { Pathname.new("/tmp/test_submission") }
    let(:command)        { service.send(:build_docker_command, submission_dir) }

    it "includes docker run" do
      expect(command).to start_with("docker run")
    end

    it "includes --rm flag" do
      expect(command).to include("--rm")
    end

    it "includes --network none for security" do
      expect(command).to include("--network none")
    end

    it "includes memory limit" do
      expect(command).to include("--memory 256m")
    end

    it "includes cpu limit" do
      expect(command).to include("--cpus 0.5")
    end

    it "mounts the submission directory as /app/user_code" do
      expect(command).to include("-v '#{submission_dir}':/app/user_code")
    end

    it "passes exercise_id as environment variable" do
      expect(command).to include("-e EXERCISE_ID=#{exercise_id}")
    end

    it "uses the correct Docker image name" do
      expect(command).to end_with("rails-gym-sandbox")
    end
  end

  describe "#parse_results (private)" do
    context "when all tests pass" do
      let(:output) { "3 examples, 0 failures" }

      it "returns success: true" do
        result = service.send(:parse_results, output)
        expect(result[:success]).to be true
      end

      it "includes the output" do
        result = service.send(:parse_results, output)
        expect(result[:output]).to eq(output)
      end

      it "includes a success message" do
        result = service.send(:parse_results, output)
        expect(result[:message]).to include("passed")
      end
    end

    context "when tests fail" do
      let(:output) { "3 examples, 2 failures" }

      it "returns success: false" do
        result = service.send(:parse_results, output)
        expect(result[:success]).to be false
      end

      it "includes the output" do
        result = service.send(:parse_results, output)
        expect(result[:output]).to eq(output)
      end

      it "includes the summary in the message" do
        result = service.send(:parse_results, output)
        expect(result[:message]).to include("3 examples, 2 failures")
      end
    end

    context "when output is empty (Docker error)" do
      let(:output) { "" }

      it "returns success: false" do
        result = service.send(:parse_results, output)
        expect(result[:success]).to be false
      end
    end
  end

  describe "#cleanup (private)" do
    it "removes the submission directory" do
      dir = service.send(:create_submission_dir)
      expect(Dir.exist?(dir)).to be true

      service.send(:cleanup, dir)
      expect(Dir.exist?(dir)).to be false
    end

    it "does not raise if directory does not exist" do
      fake_dir = Pathname.new("/tmp/does_not_exist_rails_gym")
      expect { service.send(:cleanup, fake_dir) }.not_to raise_error
    end
  end

  describe "#run" do
    context "when Docker returns passing output" do
      before do
        allow(Open3).to receive(:capture2e).and_return([
          "1 example, 0 failures",
          double(exitstatus: 0)
        ])
      end

      it "returns success: true" do
        result = service.run
        expect(result[:success]).to be true
      end

      it "cleans up submission directory after run" do
        service.run
        submission_path = Rails.root.join("tmp", "submissions", exercise_id)
        expect(Dir.exist?(submission_path)).to be false
      end
    end

    context "when Docker returns failing output" do
      before do
        allow(Open3).to receive(:capture2e).and_return([
          "2 examples, 1 failure\n\nFailures:\n\n  1) User validation...",
          double(exitstatus: 1)
        ])
      end

      it "returns success: false" do
        result = service.run
        expect(result[:success]).to be false
      end

      it "includes the failure output" do
        result = service.run
        expect(result[:output]).to include("1 failure")
      end
    end

    context "when Docker raises an error" do
      before do
        allow(Open3).to receive(:capture2e).and_raise(
          Errno::ENOENT, "docker: command not found"
        )
      end

      it "returns success: false" do
        result = service.run
        expect(result[:success]).to be false
      end

      it "returns an error message" do
        result = service.run
        expect(result[:message]).to include("Something went wrong")
      end

      it "still cleans up submission directory" do
        service.run
        submission_path = Rails.root.join("tmp", "submissions", exercise_id)
        expect(Dir.exist?(submission_path)).to be false
      end
    end
  end
end
