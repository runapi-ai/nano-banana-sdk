# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::NanoBanana::Resources::EditImage do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:edit_image) { described_class.new(http) }
  let(:endpoint) { "/api/v1/nano_banana/edit_image" }

  describe "#create" do
    it "POSTs to the correct endpoint with params" do
      params = {model: "nano-banana-edit", prompt: "make it blue", source_image_urls: ["https://cdn.runapi.ai/public/samples/input.png"]}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-1")

      result = edit_image.create(**params)
      expect(result["id"]).to eq("task-1")
    end

    it "POSTs lite edit params" do
      params = {
        model: "nano-banana-2-lite",
        prompt: "replace the background",
        source_image_urls: ["https://cdn.runapi.ai/public/samples/input.png"],
        aspect_ratio: "16:9"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-lite")

      result = edit_image.create(**params)
      expect(result["id"]).to eq("task-lite")
    end

    it "defaults model to nano-banana-2-lite" do
      params = {prompt: "test", source_image_urls: ["url"], aspect_ratio: "16:9"}
      expect(http).to receive(:request).with(:post, endpoint, body: params.merge(model: "nano-banana-2-lite"))
        .and_return("id" => "task-default-lite")

      result = edit_image.create(**params)
      expect(result.id).to eq("task-default-lite")
    end

    it "raises ValidationError when prompt is missing" do
      expect { edit_image.create(model: "nano-banana-edit", source_image_urls: ["url"]) }
        .to raise_error(RunApi::Core::ValidationError, /prompt is required/)
    end

    it "raises ValidationError when source_image_urls is missing" do
      expect { edit_image.create(model: "nano-banana-edit", prompt: "test") }
        .to raise_error(RunApi::Core::ValidationError, /source_image_urls is required/)
    end

    it "raises ValidationError for invalid model" do
      expect { edit_image.create(model: "nano-banana", prompt: "test", source_image_urls: ["url"]) }
        .to raise_error(RunApi::Core::ValidationError, /model must be one of: nano-banana-2-lite, nano-banana-edit/)
    end

    it "raises ValidationError for invalid output_format" do
      expect { edit_image.create(model: "nano-banana-edit", prompt: "test", source_image_urls: ["url"], output_format: "webp") }
        .to raise_error(RunApi::Core::ValidationError, /output_format must be one of/)
    end

    it "raises ValidationError for lite output_format" do
      expect {
        edit_image.create(
          model: "nano-banana-2-lite",
          prompt: "test",
          source_image_urls: ["url"],
          aspect_ratio: "auto",
          output_format: "png"
        )
      }.to raise_error(RunApi::Core::ValidationError, /output_format is not allowed when model is nano-banana-2-lite/)
    end
  end

  describe "#get" do
    it "GETs the correct endpoint" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return("id" => "task-1", "status" => "completed")

      result = edit_image.get("task-1")
      expect(result).to be_a(RunApi::NanoBanana::Types::EditImageResponse)
      expect(result["status"]).to eq("completed")
    end
  end

  describe "#run" do
    it "creates then polls until complete" do
      params = {model: "nano-banana-edit", prompt: "brighten", source_image_urls: ["https://cdn.runapi.ai/public/samples/input.png"]}

      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-1")

      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return("id" => "task-1", "status" => "completed", "images" => [{"url" => "https://media.example.test/out.png"}])

      allow(RunApi::Core::Polling).to receive(:sleep)

      result = edit_image.run(**params)
      expect(result).to be_a(RunApi::NanoBanana::Types::EditImageResponse)
      expect(result.images.first.url).to eq("https://media.example.test/out.png")
      expect(result["images"].first["url"]).to eq("https://media.example.test/out.png")
    end
  end
end
