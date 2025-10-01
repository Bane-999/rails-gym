require_relative "boot"

# Load full Rails so we can test anything:
#   - ActiveRecord  → model validations, associations, scopes, callbacks
#   - ActionController → controller specs
#   - ActionDispatch  → routing specs
#   - ActiveJob       → background job specs
#   - ActiveStorage   → file attachment specs (future)
#   - ActiveSupport   → helpers, concerns, time helpers
require "rails/all"

Bundler.require(*Rails.groups)

module RailsGymSandbox
  class Application < Rails::Application
    config.load_defaults 7.1

    # API mode — no views, no asset pipeline, no cookies
    # Still allows controllers and routing
    config.api_only = true

    # Don't eager load in test — faster boot
    config.eager_load = false

    # Only show warnings inside Docker
    # We want clean RSpec output, not Rails noise
    config.log_level = :warn
    config.logger    = Logger.new($stdout)
    config.logger.level = Logger::WARN
  end
end
