# frozen_string_literal: true

module RunApi
  module NanoBanana
    CONTRACT = {
      "edit-image" => {
        "models" => ["nano-banana-2-lite", "nano-banana-edit"],
        "fields_by_model" => {
          "nano-banana-2-lite" => {
            "aspect_ratio" => {
              "enum" => ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9", "auto"],
              "required" => true
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 20000,
              "length" => true
            },
            "source_image_urls" => {
              "required" => true
            }
          },
          "nano-banana-edit" => {
            "aspect_ratio" => {
              "enum" => ["1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto"]
            },
            "output_format" => {
              "enum" => ["png", "jpeg"]
            },
            "source_image_urls" => {
              "required" => true
            }
          }
        },
        "rules" => [{
          "when" => {
            "model" => "nano-banana-2-lite"
          },
          "forbidden" => ["output_format"]
        }]
      },
      "text-to-image" => {
        "models" => ["nano-banana", "nano-banana-2", "nano-banana-2-lite", "nano-banana-pro"],
        "fields_by_model" => {
          "nano-banana" => {
            "aspect_ratio" => {
              "enum" => ["1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto"]
            },
            "output_format" => {
              "enum" => ["png", "jpeg", "jpg"]
            }
          },
          "nano-banana-2" => {
            "aspect_ratio" => {
              "enum" => ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9", "auto"]
            },
            "output_format" => {
              "enum" => ["png", "jpeg", "jpg"]
            },
            "output_resolution" => {
              "enum" => ["1k", "2k", "4k"]
            }
          },
          "nano-banana-2-lite" => {
            "aspect_ratio" => {
              "enum" => ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9", "auto"],
              "required" => true
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 20000,
              "length" => true
            }
          },
          "nano-banana-pro" => {
            "aspect_ratio" => {
              "enum" => ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "auto"]
            },
            "output_format" => {
              "enum" => ["png", "jpeg", "jpg"]
            },
            "output_resolution" => {
              "enum" => ["1k", "2k", "4k"]
            }
          }
        },
        "rules" => [{
          "when" => {
            "model" => "nano-banana-2-lite"
          },
          "forbidden" => ["output_resolution", "output_format"]
        }]
      }
    }.freeze
  end
end
