package nanobanana

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/runapi-ai/core-sdk/go/core"
)

type stubHTTPClient struct {
	method string
	path   string
	body   any
}

func (s *stubHTTPClient) Request(_ context.Context, method, path string, opts *core.HTTPRequestOptions) (json.RawMessage, error) {
	s.method = method
	s.path = path
	if opts != nil {
		s.body = opts.Body
	}
	return json.RawMessage(`{"id":"task_123","status":"processing"}`), nil
}

func TestTextToImageCreateSendsCorrectRequest(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToImage.Create(context.Background(), TextToImageParams{
		Model:              "nano-banana-pro",
		Prompt:             "a cat",
		AspectRatio:        "16:9",
		OutputResolution:   "2k",
		ReferenceImageURLs: []string{"https://cdn.runapi.ai/public/samples/reference.png"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/nano_banana/text_to_image" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body, ok := stub.body.(map[string]any)
	if !ok {
		t.Fatalf("expected flat body map, got %T", stub.body)
	}
	if body["prompt"] != "a cat" {
		t.Fatalf("unexpected prompt: %v", body["prompt"])
	}
	if body["output_resolution"] != "2k" {
		t.Fatalf("unexpected output_resolution: %v", body["output_resolution"])
	}
	if _, ok := body["resolution"]; ok {
		t.Fatal("expected public resolution field to be absent")
	}
	if _, ok := body["image_input"]; ok {
		t.Fatal("expected provider image_input field to be absent")
	}
	if body["reference_image_urls"] == nil {
		t.Fatal("expected reference_image_urls")
	}
}

func TestEditImageCreateSendsCorrectRequest(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.EditImage.Create(context.Background(), EditImageParams{
		Model:           "nano-banana-edit",
		Prompt:          "remove background",
		AspectRatio:     "1:1",
		SourceImageURLs: []string{"https://cdn.runapi.ai/public/samples/source.png"},
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/nano_banana/edit_image" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["image_urls"]; ok {
		t.Fatal("expected provider image_urls field to be absent")
	}
	if _, ok := body["image_size"]; ok {
		t.Fatal("expected removed image_size field to be absent")
	}
	if body["source_image_urls"] == nil {
		t.Fatal("expected source_image_urls")
	}
}

func TestTextToImageGetSendsCorrectPath(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToImage.Get(context.Background(), "task_abc")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/nano_banana/text_to_image/task_abc" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

func TestTextToImageGetDecodesImages(t *testing.T) {
	raw := json.RawMessage(`{"id":"task_abc","status":"completed","images":[{"url":"https://cdn.runapi.ai/public/samples/result.png"}]}`)
	var response TextToImageResponse
	if err := json.Unmarshal(raw, &response); err != nil {
		t.Fatal(err)
	}
	if len(response.Images) != 1 || response.Images[0].URL != "https://cdn.runapi.ai/public/samples/result.png" {
		t.Fatalf("unexpected images: %#v", response.Images)
	}
}

func TestEditImageGetSendsCorrectPath(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.EditImage.Get(context.Background(), "task_xyz")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/nano_banana/edit_image/task_xyz" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

func TestTextToImageCreateCompactsParams(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToImage.Create(context.Background(), TextToImageParams{
		Model:  "nano-banana",
		Prompt: "a cat",
		// CallbackURL is empty string, should be compacted away
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["callback_url"]; ok {
		t.Fatal("expected empty callback_url to be compacted away")
	}
}
