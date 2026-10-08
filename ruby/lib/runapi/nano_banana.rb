# frozen_string_literal: true

require "runapi/core"
require_relative "nano_banana/types"
require_relative "nano_banana/resources/text_to_image"
require_relative "nano_banana/resources/edit_image"
require_relative "nano_banana/client"

module RunApi
  module NanoBanana
    AuthenticationError = RunApi::Core::AuthenticationError
    RateLimitError = RunApi::Core::RateLimitError
    InsufficientCreditsError = RunApi::Core::InsufficientCreditsError
    NotFoundError = RunApi::Core::NotFoundError
    ValidationError = RunApi::Core::ValidationError
    TaskFailedError = RunApi::Core::TaskFailedError
    TaskTimeoutError = RunApi::Core::TaskTimeoutError
  end
end
