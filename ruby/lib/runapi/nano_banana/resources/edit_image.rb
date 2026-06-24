# frozen_string_literal: true

module RunApi
  module NanoBanana
    module Resources
      # NanoBanana image editing resource.
      # Edit existing images using text prompts and reference images.
      class EditImage
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/nano_banana/edit_image"

        RESPONSE_CLASS = Types::EditImageResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedEditImageResponse

        def initialize(http)
          @http = http
        end

        # Edit an image and wait until complete.
        #
        # @param params [Hash] edit parameters
        # @return [RunApi::NanoBanana::Types::CompletedEditImageResponse] completed edit with image results
        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        # Create an image edit task.
        #
        # @param params [Hash] edit parameters
        # @return [RunApi::NanoBanana::Types::EditImageResponse] task creation result with id
        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

        # Get edit status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::NanoBanana::Types::EditImageResponse] current edit status
        def get(id)
          request(:get, "#{ENDPOINT}/#{id}")
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
