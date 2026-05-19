package nanobanana

type TextToImageModel string

type EditImageModel string

type ImageSize string

type AspectRatio string

type Resolution string

type OutputFormat string

type TaskStatus string

type TextToImageParams struct {
	Model        TextToImageModel `json:"model" help:"required; nano-banana, nano-banana-pro, or nano-banana-2"`
	Prompt       string           `json:"prompt" help:"required; image description (nano-banana/pro ≤5000 chars, nano-banana-2 ≤20000 chars)"`
	CallbackURL  string           `json:"callback_url,omitempty" help:"optional; webhook URL"`
	OutputFormat OutputFormat     `json:"output_format,omitempty" help:"optional; png, jpg, or jpeg"`
	ImageSize    ImageSize        `json:"image_size,omitempty" help:"optional; nano-banana only: 1:1 (default), 9:16, 16:9, 3:4, 4:3, 3:2, 2:3, 5:4, 4:5, 21:9, auto"`
	AspectRatio  AspectRatio      `json:"aspect_ratio,omitempty" help:"optional; nano-banana-pro / nano-banana-2: output aspect ratio (nano-banana-2 adds 1:4, 1:8, 4:1, 8:1)"`
	Resolution   Resolution       `json:"resolution,omitempty" help:"optional; nano-banana-pro / nano-banana-2: 1K, 2K, 4K (default 1K)"`
	ImageInput   []string         `json:"image_input,omitempty" help:"optional; reference image URLs (nano-banana/pro ≤8, nano-banana-2 ≤14; ≤30MB each)"`
}

type EditImageParams struct {
	Model        EditImageModel `json:"model" help:"required; edit model name"`
	Prompt       string         `json:"prompt" help:"required; edit instruction (≤5000 chars)"`
	CallbackURL  string         `json:"callback_url,omitempty" help:"optional; webhook URL"`
	OutputFormat OutputFormat   `json:"output_format,omitempty" help:"optional; png (default) or jpeg"`
	ImageSize    ImageSize      `json:"image_size,omitempty" help:"optional; 1:1 (default), 9:16, 16:9, 3:4, 4:3, etc."`
	ImageURLs    []string       `json:"image_urls" help:"required; source image URLs (≤10 images, ≤10MB each)"`
}

type AsyncTaskResponse struct {
	ID     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Error  string     `json:"error,omitempty"`
}

func (r AsyncTaskResponse) GetID() string     { return r.ID }
func (r AsyncTaskResponse) GetStatus() string { return string(r.Status) }
func (r AsyncTaskResponse) GetError() string  { return r.Error }

type TextToImageResponse struct {
	AsyncTaskResponse
	ResultURLs []string `json:"result_urls,omitempty"`
}

type EditImageResponse struct {
	AsyncTaskResponse
	ResultURLs []string `json:"result_urls,omitempty"`
}
