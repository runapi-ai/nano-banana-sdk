#!/usr/bin/env ruby
# frozen_string_literal: true

require "runapi/nano_banana"

client = RunApi::NanoBanana::Client.new(
  api_key: ENV.fetch("RUNAPI_API_KEY", "runapi_test_token"),
  base_url: ENV.fetch("RUNAPI_BASE_URL", "http://localhost:3000")
)

# 1. Base model generation
puts "=== Base Model Generation ==="
result = client.text_to_image.run(
  model: "nano-banana",
  prompt: "a serene mountain lake at sunset"
)
puts "Status: #{result["status"]}"
puts "URLs: #{result["result_urls"]}"

# 2. Pro model with aspect ratio and resolution
puts "\n=== Pro Model Generation ==="
result = client.text_to_image.run(
  model: "nano-banana-pro",
  prompt: "cyberpunk cityscape at night",
  aspect_ratio: "16:9",
  resolution: "2K"
)
puts "Status: #{result["status"]}"
puts "URLs: #{result["result_urls"]}"

# 3. Image editing
puts "\n=== Image Editing ==="
result = client.edit_image.run(
  model: "nano-banana-edit",
  prompt: "make the sky more dramatic",
  image_urls: [ ENV.fetch("TEST_IMAGE_URL", "https://raw.githubusercontent.com/ckenst/images-catalog/refs/heads/master/size/small_size/Starbucks%20Dog.jpg") ]
)
puts "Status: #{result["status"]}"
puts "URLs: #{result["result_urls"]}"

# 4. Manual polling (create + get)
puts "\n=== Manual Polling ==="
task = client.text_to_image.create(
  model: "nano-banana",
  prompt: "a golden retriever in a field"
)
puts "Task ID: #{task["id"]}"

loop do
  status = client.text_to_image.get(task["id"])
  puts "Polling... status=#{status["status"]}"
  break if status["status"] == "completed" || status["status"] == "failed"

  sleep 2
end

# 5. Error handling
puts "\n=== Error Handling ==="
begin
  client.text_to_image.create(model: "invalid-model", prompt: "test")
rescue RunApi::Core::ValidationError => e
  puts "Caught ValidationError: #{e.message}"
end

begin
  client.text_to_image.create(prompt: "missing model")
rescue RunApi::Core::ValidationError => e
  puts "Caught ValidationError: #{e.message}"
end
