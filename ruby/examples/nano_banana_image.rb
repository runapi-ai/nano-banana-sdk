#!/usr/bin/env ruby
# frozen_string_literal: true

require "bundler/setup"
require "runapi/nano_banana"

api_key = ENV.fetch("RUNAPI_API_KEY") do
  puts "Error: RUNAPI_API_KEY environment variable not set"
  puts "Usage: RUNAPI_API_KEY=your-key ruby examples/nano_banana_image.rb"
  exit 1
end

client = RunApi::NanoBanana::Client.new(api_key: api_key)

puts "NanoBanana client initialized successfully"
puts "Client class: " + client.class.name
puts "\nTODO: Implement text_to_image.run() method"
puts "Once implemented, you will be able to generate images like this:"
puts ""
puts "  result = client.text_to_image.run("
puts "    prompt: 'A futuristic cityscape at night',"
puts "    aspect_ratio: '16:9',"
puts "    wait: true"
puts "  )"
puts ""
puts "  puts 'Image generated!'"
puts "  puts 'Image URL: ' + result.image_url"
