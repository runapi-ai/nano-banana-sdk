package nanobanana

type TextToImageModel string

type EditImageModel string

type AspectRatio string

type OutputResolution string

type OutputFormat string

type TaskStatus string

type TextToImageParams struct {
	Model              TextToImageModel `json:"model" help:"required; model slug"`
	Prompt             string           `json:"prompt" help:"required; image description (standard/pro <=5000 chars, v2 <=20000 chars)"`
	CallbackURL        string           `json:"callback_url,omitempty" help:"optional; webhook URL"`
	OutputFormat       OutputFormat     `json:"output_format,omitempty" help:"optional; output format"`
	AspectRatio        AspectRatio      `json:"aspect_ratio,omitempty" help:"optional; output aspect ratio"`
	OutputResolution   OutputResolution `json:"output_resolution,omitempty" help:"optional; output resolution; pro/v2 default 1k"`
	ReferenceImageURLs []string         `json:"reference_image_urls,omitempty" help:"optional; reference image URLs (standard/pro <=8, v2 <=14; <=30MB each)"`
}

type EditImageParams struct {
	Model           EditImageModel `json:"model" help:"required; model slug"`
	Prompt          string         `json:"prompt" help:"required; edit instruction (≤5000 chars)"`
	CallbackURL     string         `json:"callback_url,omitempty" help:"optional; webhook URL"`
	OutputFormat    OutputFormat   `json:"output_format,omitempty" help:"optional; output format"`
	AspectRatio     AspectRatio    `json:"aspect_ratio,omitempty" help:"optional; output aspect ratio"`
	SourceImageURLs []string       `json:"source_image_urls" help:"required; source image URLs (≤10 images, ≤10MB each)"`
}

type AsyncTaskResponse struct {
	ID     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Error  string     `json:"error,omitempty"`
}

func (r AsyncTaskResponse) GetID() string     { return r.ID }
func (r AsyncTaskResponse) GetStatus() string { return string(r.Status) }
func (r AsyncTaskResponse) GetError() string  { return r.Error }

type Image struct {
	URL       string `json:"url"`
	OriginURL string `json:"origin_url,omitempty"`
}

type TextToImageResponse struct {
	AsyncTaskResponse
	Images []Image `json:"images,omitempty"`
}

type EditImageResponse struct {
	AsyncTaskResponse
	Images []Image `json:"images,omitempty"`
}
