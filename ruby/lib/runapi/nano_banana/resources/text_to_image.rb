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
        # @param params [Hash] generation parameters (see {#create} for accepted keys)
        # @return [RunApi::NanoBanana::Types::CompletedTextToImageResponse] completed generation with image results
        def run(options: nil, **params)
          task = create(options: options, **params)
          poll_until_complete { get(task.id, options: options) }
        end

        # Create an image generation task.
        #
        # @param params [Hash] generation parameters
        # @option params [String] :model model slug, e.g. "nano-banana", "nano-banana-pro", "nano-banana-2", "nano-banana-2-lite"
        # @option params [String] :prompt required; image description
        # @option params [String] :aspect_ratio optional; required for nano-banana-2-lite
        # @option params [String] :output_format optional; "png", "jpeg", or "jpg" (not supported by nano-banana-2-lite)
        # @option params [String] :output_resolution optional; "1k", "2k", or "4k" (nano-banana-pro / nano-banana-2)
        # @option params [Array<String>] :reference_image_urls optional; reference image URLs for visual
        #   guidance (nano-banana / nano-banana-pro up to 8, nano-banana-2 up to 14, nano-banana-2-lite up to 10; <=30MB each)
        # @return [RunApi::NanoBanana::Types::TextToImageResponse] task creation result with id
        def create(options: nil, **params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        # Get generation status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::NanoBanana::Types::TextToImageResponse] current generation status
        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
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
