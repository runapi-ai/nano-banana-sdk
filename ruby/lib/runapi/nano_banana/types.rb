# frozen_string_literal: true

module RunApi
  module NanoBanana
    module Types
      # Generation tiers: standard (fast), pro (higher res + more refs), v2 (longest prompts + extreme ratios).
      GENERATION_MODELS = %w[nano-banana nano-banana-pro nano-banana-2].freeze
      # Dedicated editing model. Requires source images to transform.
      EDIT_MODELS = %w[nano-banana-edit].freeze

      BASE_ASPECT_RATIOS = %w[1:1 9:16 16:9 3:4 4:3 3:2 2:3 5:4 4:5 21:9 auto].freeze
      # Full aspect ratio set including extreme panoramic ratios (1:4, 1:8, 4:1, 8:1) for v2.
      ASPECT_RATIOS = %w[1:1 1:4 1:8 2:3 3:2 3:4 4:1 4:3 4:5 5:4 8:1 9:16 16:9 21:9 auto].freeze
      # Output resolution tiers. Pro and v2 default to 1k; higher tiers increase generation time.
      OUTPUT_RESOLUTIONS = %w[1k 2k 4k].freeze
      OUTPUT_FORMATS = %w[png jpg jpeg].freeze

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
