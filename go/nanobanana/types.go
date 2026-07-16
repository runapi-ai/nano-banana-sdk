package nanobanana

// TextToImageModel restricts the model parameter to generation-capable NanoBanana variants.
type TextToImageModel string

// EditImageModel restricts the model parameter to edit-capable NanoBanana variants.
type EditImageModel string

// AspectRatio constrains the output aspect ratio to accepted values.
type AspectRatio string

// OutputResolution constrains the output resolution tier to accepted values.
type OutputResolution string

// OutputFormat constrains the output image format to accepted values.
type OutputFormat string

// TaskStatus represents the lifecycle state of an async task.
type TaskStatus string

// TextToImageParams configures a generation request. ReferenceImageURLs provide
// optional visual guidance; prompt length, output controls, and reference count
// vary by model variant.
type TextToImageParams struct {
	Model              TextToImageModel `json:"model" help:"optional; defaults to nano-banana-2-lite"`
	Prompt             string           `json:"prompt" help:"required; image description (standard/pro <=5000 chars, v2/lite <=20000 chars)"`
	CallbackURL        string           `json:"callback_url,omitempty" help:"optional; webhook URL"`
	OutputFormat       OutputFormat     `json:"output_format,omitempty" help:"optional; output format; not supported by nano-banana-2-lite"`
	AspectRatio        AspectRatio      `json:"aspect_ratio,omitempty" help:"optional; required for nano-banana-2-lite; output aspect ratio"`
	OutputResolution   OutputResolution `json:"output_resolution,omitempty" help:"optional; output resolution; pro/v2 default 1k; not supported by nano-banana-2-lite"`
	ReferenceImageURLs []string         `json:"reference_image_urls,omitempty" help:"optional; reference image URLs (standard/pro <=8, v2 <=14, lite <=10; <=30MB each)"`
}

// EditImageParams configures an image editing request. nano-banana-edit supports
// output format control; nano-banana-2-lite requires aspect_ratio and does not
// support output_format.
type EditImageParams struct {
	Model           EditImageModel `json:"model" help:"optional; defaults to nano-banana-2-lite"`
	Prompt          string         `json:"prompt" help:"required; edit instruction (nano-banana-edit <=5000 chars, lite <=20000 chars)"`
	CallbackURL     string         `json:"callback_url,omitempty" help:"optional; webhook URL"`
	OutputFormat    OutputFormat   `json:"output_format,omitempty" help:"optional; output format for nano-banana-edit; not supported by nano-banana-2-lite"`
	AspectRatio     AspectRatio    `json:"aspect_ratio,omitempty" help:"optional for nano-banana-edit, required for nano-banana-2-lite; output aspect ratio"`
	SourceImageURLs []string       `json:"source_image_urls" help:"required; source image URLs (≤10 images)"`
}

// AsyncTaskResponse implements core.TaskResponse for async task polling.
type AsyncTaskResponse struct {
	ID     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Error  string     `json:"error,omitempty"`
}

func (r AsyncTaskResponse) GetID() string     { return r.ID }
func (r AsyncTaskResponse) GetStatus() string { return string(r.Status) }
func (r AsyncTaskResponse) GetError() string  { return r.Error }

// Image holds a CDN URL for a generated image. OriginURL is the pre-CDN original when available.
type Image struct {
	URL       string `json:"url"`
	OriginURL string `json:"origin_url,omitempty"`
}

// TextToImageResponse contains the generated images from a text-to-image task.
type TextToImageResponse struct {
	AsyncTaskResponse
	Images []Image `json:"images,omitempty"`
}

// EditImageResponse contains the generated images from an edit task.
type EditImageResponse struct {
	AsyncTaskResponse
	Images []Image `json:"images,omitempty"`
}
