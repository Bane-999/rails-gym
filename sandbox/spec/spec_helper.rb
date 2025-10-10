RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
  config.order = :random
  config.warnings = false
end

module Warning
  class << self
    alias_method :original_warn, :warn

    BLOCKED = [
      "mail/parsers",
      "statement not reached"
    ]

    def warn(message, category: nil, **kwargs)
      msg = message.to_s
      return if BLOCKED.any? { |b| msg.include?(b) }

      original_warn(message, category: category, **kwargs)
    end
  end
end
