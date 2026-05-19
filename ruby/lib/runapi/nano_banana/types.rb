# frozen_string_literal: true

module RunApi
  module NanoBanana
    module Types
      GENERATION_MODELS = %w[nano-banana nano-banana-pro nano-banana-2].freeze
      EDIT_MODELS = %w[nano-banana-edit].freeze

      IMAGE_SIZES = %w[1:1 9:16 16:9 3:4 4:3 3:2 2:3 5:4 4:5 21:9 auto].freeze
      ASPECT_RATIOS = %w[1:1 1:4 1:8 2:3 3:2 3:4 4:1 4:3 4:5 5:4 8:1 9:16 16:9 21:9 auto].freeze
      RESOLUTIONS = %w[1K 2K 4K].freeze
      OUTPUT_FORMATS = %w[png jpg jpeg].freeze

      class Image < RunApi::Core::BaseModel
        optional :id, String
        optional :url, String
        optional :image_url, String
      end

      class AsyncTaskResponse < RunApi::Core::TaskResponse
        required :id, String
        optional :status, String, enum: -> { RunApi::Core::TaskResponse::Status::ALL }
      end

      class TextToImageResponse < AsyncTaskResponse
        optional :result_urls, [ String ]
        optional :image, -> { Image }
      end

      class EditImageResponse < AsyncTaskResponse
        optional :result_urls, [ String ]
        optional :image, -> { Image }
      end

      # Narrowed responses returned by `run()` methods once polling observes
      # `status: "completed"`. `result_urls` is required so consumers never
      # have to null-check it on a successful task.
      class CompletedTextToImageResponse < TextToImageResponse
        required :result_urls, [ String ]
      end

      class CompletedEditImageResponse < EditImageResponse
        required :result_urls, [ String ]
      end
    end
  end
end
