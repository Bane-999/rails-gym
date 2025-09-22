class CodeRunnerService

  TIMEOUT_SECONDS = 30

  def initialize(exercise_id, files)
    @exercise_id = exercise_id

    # files is a Hash like:
    # {
    #   "app/models/user.rb"                          => "class User...",
    #   "db/migrate/20240101_add_email_to_users.rb"   => "class AddEmail..."
    # }
    @files = files
  end

  def run
    submission_dir = nil

    submission_dir = create_submission_dir
    write_files_to_disk(submission_dir)
    output = run_docker_container(submission_dir)

    parse_results(output)

  rescue => e
    Rails.logger.error("CodeRunnerService error: #{e.message}")
    Rails.logger.error(e.backtrace.join("\n"))

    {
      success: false,
      output:  "Internal error: #{e.message}",
      message: "Something went wrong while running your code."
    }
  ensure
    cleanup(submission_dir) if submission_dir
  end

  private

  def create_submission_dir
    base_path = Rails.root.join("tmp", "submissions", @exercise_id)

    FileUtils.rm_rf(base_path)
    FileUtils.mkdir_p(base_path)

    Rails.logger.info("Created submission dir: #{base_path}")

    base_path
  end

  def write_files_to_disk(submission_dir)
    @files.each do |relative_path, content|
      full_path = submission_dir.join(relative_path)

      FileUtils.mkdir_p(File.dirname(full_path))
      File.write(full_path, content)

      Rails.logger.info("Wrote file: #{relative_path} (#{content.length} chars)")
    end
  end

  # The container receives:
  #   - A volume mount: user's code is visible at /app/user_code inside Docker
  #   - An environment variable: EXERCISE_ID tells the sandbox which spec to run
  #
  # --rm         → remove container after it exits (no cleanup needed)
  # --network none → no internet access inside container (security)
  # --memory     → limit RAM usage
  # --cpus       → limit CPU usage
  # -v           → mount user code into container
  # -e           → pass exercise ID as environment variable
  def run_docker_container(submission_dir)
    command = build_docker_command(submission_dir)

    Rails.logger.info("Running Docker command: #{command}")

    # Open3.capture2e captures both stdout and stderr merged into one string.
    # This is important because RSpec writes some output to stderr.
    require "open3"
    output, status = Open3.capture2e(command)

    Rails.logger.info("Docker exit status: #{status.exitstatus}")
    Rails.logger.info("Docker output:\n#{output}")

    output
  end

  def build_docker_command(submission_dir)
    [
      "docker run",
      "--rm",                                          # auto-remove after exit
      "--network none",                                # no internet access
      "--memory 256m",                                 # limit RAM to 256MB
      "--cpus 0.5",                                    # limit to half a CPU
      "--name rails_gym_#{@exercise_id.gsub(/\W/, '_')}_#{Time.now.to_i}",  # unique container name
      "-v '#{submission_dir}':/app/user_code",         # mount user code (quoted to handle spaces)
      "-e EXERCISE_ID=#{@exercise_id}",                # pass exercise ID
      "rails-gym-sandbox"                              # our Docker image name
    ].join(" ")
  end

  # RSpec exits with:
  #   0 = all tests passed
  #   1 = one or more tests failed
  #   2 = configuration/load error
  def parse_results(output)
    passed = output.include?("0 failures") && !output.include?("0 examples")

    if passed
      {
        success: true,
        output:  output,
        message: "All tests passed! Great work 💪"
      }
    else
      summary = extract_summary(output)

      {
        success: false,
        output:  output,
        message: summary || "Tests failed. Check the output for details."
      }
    end
  end

  def extract_summary(output)
    match = output.match(/\d+ examples?, \d+ failures?/)
    match[0] if match
  end

  def cleanup(submission_dir)
    FileUtils.rm_rf(submission_dir)
    Rails.logger.info("Cleaned up submission dir: #{submission_dir}")
  rescue => e
    Rails.logger.warn("Cleanup failed: #{e.message}")
  end
end
