# frozen_string_literal: true

module RunApi
  module NanoBanana
    # NanoBanana image generation API client.
    #
    # @example
    #   client = RunApi::NanoBanana::Client.new(api_key: "your-api-key")
    #   result = client.text_to_image.run(
    #     model: "flux-kontext-pro", prompt: "A futuristic cityscape"
    #   )
    class Client
      # @return [Resources::TextToImage] Image generation operations.
      # @return [Resources::EditImage] Image editing operations.
      attr_reader :text_to_image, :edit_image

      def initialize(api_key: nil, **options)
        @api_key = Core::Auth.resolve_api_key(api_key)

        client_options = Core::ClientOptions.new(api_key: @api_key, **options)
        http = client_options.http_client || Core::HttpClient.new(client_options)
        @text_to_image = Resources::TextToImage.new(http)
        @edit_image = Resources::EditImage.new(http)
      end
    end
  end
end
