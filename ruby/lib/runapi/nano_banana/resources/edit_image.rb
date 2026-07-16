# frozen_string_literal: true

module RunApi
  module NanoBanana
    module Resources
      # NanoBanana image editing resource.
      # Edit existing images using text prompts and source images.
      class EditImage
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/nano_banana/edit_image"
        DEFAULT_MODEL = "nano-banana-2-lite"

        RESPONSE_CLASS = Types::EditImageResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedEditImageResponse

        def initialize(http)
          @http = http
        end

        # Edit an image and wait until complete.
        #
        # @param params [Hash] edit parameters
        # @return [RunApi::NanoBanana::Types::CompletedEditImageResponse] completed edit with image results
        def run(options: nil, **params)
          task = create(options: options, **params)
          poll_until_complete { get(task.id, options: options) }
        end

        # Create an image edit task.
        #
        # @param params [Hash] edit parameters
        # @return [RunApi::NanoBanana::Types::EditImageResponse] task creation result with id
        def create(options: nil, **params)
          params = compact_params(params)
          params[:model] = DEFAULT_MODEL unless param(params, :model)
          validate_params!(params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        # Get edit status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::NanoBanana::Types::EditImageResponse] current edit status
        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
        end

        private

        def validate_params!(params)
          validate_contract!(CONTRACT["edit-image"], params)

          raise Core::ValidationError, "prompt is required" unless param(params, :prompt)
          raise Core::ValidationError, "source_image_urls is required" unless param(params, :source_image_urls)
        end
      end
    end
  end
end
