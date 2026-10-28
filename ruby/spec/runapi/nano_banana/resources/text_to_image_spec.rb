# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::NanoBanana::Resources::TextToImage do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:text_to_image) { described_class.new(http) }
  let(:endpoint) { "/api/v1/nano_banana/text_to_image" }

  describe "#create" do
    it "POSTs to the correct endpoint with params" do
      params = {model: "nano-banana", prompt: "a cat"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-1")

      result = text_to_image.create(**params)
      expect(result).to be_a(RunApi::NanoBanana::Types::TextToImageResponse)
      expect(result.id).to eq("task-1")
      expect(result["id"]).to eq("task-1")
    end

    it "accepts nano-banana-pro model" do
      params = {model: "nano-banana-pro", prompt: "a dog", aspect_ratio: "16:9"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-2")

      result = text_to_image.create(**params)
      expect(result).to be_a(RunApi::NanoBanana::Types::TextToImageResponse)
      expect(result.id).to eq("task-2")
      expect(result["id"]).to eq("task-2")
    end

    it "accepts auto aspect_ratio for nano-banana-pro" do
      params = {model: "nano-banana-pro", prompt: "a dog", aspect_ratio: "auto"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-auto")

      result = text_to_image.create(**params)
      expect(result).to be_a(RunApi::NanoBanana::Types::TextToImageResponse)
      expect(result.id).to eq("task-auto")
      expect(result["id"]).to eq("task-auto")
    end

    it "accepts nano-banana-2-lite with required aspect_ratio" do
      params = {model: "nano-banana-2-lite", prompt: "a dog", aspect_ratio: "auto", reference_image_urls: ["https://cdn.runapi.ai/public/samples/image.jpg"]}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-lite")

      result = text_to_image.create(**params)
      expect(result).to be_a(RunApi::NanoBanana::Types::TextToImageResponse)
      expect(result.id).to eq("task-lite")
    end

    it "creates a v2.1 reference-guided task and reads its image" do
      params = {model: "nano-banana-2.1", prompt: "Replace the background with a meadow", reference_image_urls: ["https://cdn.runapi.ai/public/samples/image.jpg"], output_resolution: "2k", output_format: "jpg"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-v21")
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-v21")
        .and_return("id" => "task-v21", "status" => "completed", "images" => [{"url" => "https://cdn.runapi.ai/public/samples/result.png"}])

      task = text_to_image.create(**params)
      result = text_to_image.get(task.id)

      expect(task.id).to eq("task-v21")
      expect(result.images.first.url).to eq("https://cdn.runapi.ai/public/samples/result.png")
    end

    it "defaults model to nano-banana-2-lite" do
      params = {prompt: "test", aspect_ratio: "auto"}
      expect(http).to receive(:request).with(:post, endpoint, body: params.merge(model: "nano-banana-2-lite"))
        .and_return("id" => "task-default-lite")

      result = text_to_image.create(**params)
      expect(result.id).to eq("task-default-lite")
    end

    it "passes valid optional params without error" do
      params = {model: "nano-banana-pro", prompt: "test", aspect_ratio: "16:9", output_resolution: "2k", output_format: "png", reference_image_urls: ["https://cdn.runapi.ai/public/samples/input.png"]}
      expect(http).to receive(:request).with(:post, endpoint, body: params).and_return("id" => "t1")

      text_to_image.create(**params)
    end
  end

  describe "#get" do
    it "GETs the correct endpoint" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return("id" => "task-1", "status" => "completed")

      result = text_to_image.get("task-1")
      expect(result).to be_a(RunApi::NanoBanana::Types::TextToImageResponse)
      expect(result.status).to eq("completed")
      expect(result["status"]).to eq("completed")
    end
  end

  describe "#run" do
    it "creates then polls until complete" do
      expect(http).to receive(:request).with(:post, endpoint, body: {model: "nano-banana", prompt: "cat"})
        .and_return("id" => "task-1")

      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return("id" => "task-1", "status" => "processing")
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return("id" => "task-1", "status" => "completed", "images" => [{"url" => "https://cdn.runapi.ai/public/samples/input.png"}])

      allow(RunApi::Core::Polling).to receive(:sleep)

      result = text_to_image.run(model: "nano-banana", prompt: "cat")
      expect(result.images.first.url).to eq("https://cdn.runapi.ai/public/samples/input.png")
      expect(result["images"].first["url"]).to eq("https://cdn.runapi.ai/public/samples/input.png")
    end
  end
end
