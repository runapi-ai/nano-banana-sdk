# frozen_string_literal: true

module RunApi
  module NanoBanana
    module Types
      # A single generated or edited image result.
      class Image < RunApi::Core::BaseModel
        optional :url, String
        optional :origin_url, String
      end

      class AsyncTaskResponse < RunApi::Core::TaskResponse
        required :id, String
        optional :status, String, enum: -> { RunApi::Core::TaskResponse::Status::ALL }
      end

      class TextToImageResponse < AsyncTaskResponse
        optional :images, [-> { Image }]
      end

      class EditImageResponse < AsyncTaskResponse
        optional :images, [-> { Image }]
      end

      # Narrowed responses returned by `run()` methods once polling observes
      # `status: "completed"`. `images` is required so consumers never
      # have to null-check it on a successful task.
      class CompletedTextToImageResponse < TextToImageResponse
        required :images, [-> { Image }]
      end

      class CompletedEditImageResponse < EditImageResponse
        required :images, [-> { Image }]
      end
    end
  end
end
