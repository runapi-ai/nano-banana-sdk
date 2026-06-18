# frozen_string_literal: true

module RunApi
  module NanoBanana
    # NanoBanana image generation and editing API client.
    #
    # Three generation tiers: standard (fast), pro (higher resolution, more
    # reference images), and v2 (longest prompts, extreme aspect ratios, up to
    # 14 reference images). Editing uses the dedicated +nano-banana-edit+ model.
    #
    # @example
    #   client = RunApi::NanoBanana::Client.new(api_key: "your-api-key")
    #   result = client.text_to_image.run(
    #     model: "nano-banana-pro", prompt: "A futuristic cityscape"
    #   )
    class Client < RunApi::Core::Client
      # @return [Resources::TextToImage] Generate images from text prompts with optional reference image guidance.
      attr_reader :text_to_image
      # @return [Resources::EditImage] Edit existing images using text prompts and source images.
      attr_reader :edit_image

      def initialize(api_key: nil, **options)
        super
        @text_to_image = Resources::TextToImage.new(http)
        @edit_image = Resources::EditImage.new(http)
      end
    end
  end
end
