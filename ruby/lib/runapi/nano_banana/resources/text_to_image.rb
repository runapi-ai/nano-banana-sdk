# frozen_string_literal: true

module RunApi
  module NanoBanana
    module Resources
      # NanoBanana image generation resource.
      # Generate images from text prompts with various models and options.
      class TextToImage
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/nano_banana/text_to_image"

        RESPONSE_CLASS = Types::TextToImageResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedTextToImageResponse

        def initialize(http)
          @http = http
        end

        # Generate an image and wait until complete.
        #
        # @param params [Hash] generation parameters
        # @return [RunApi::NanoBanana::Types::CompletedTextToImageResponse] completed generation with image results
        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        # Create an image generation task.
        #
        # @param params [Hash] generation parameters
        # @return [RunApi::NanoBanana::Types::TextToImageResponse] task creation result with id
        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

        # Get generation status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::NanoBanana::Types::TextToImageResponse] current generation status
        def get(id)
          request(:get, "#{ENDPOINT}/#{id}")
        end

        private

        def validate_params!(params)
          validate_contract!(CONTRACT["text-to-image"], params)

          raise Core::ValidationError, "prompt is required" unless param(params, :prompt)
        end
      end
    end
  end
end
