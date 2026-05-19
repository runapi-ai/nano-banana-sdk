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
		Model:  "flux-dev",
		Prompt: "a cat",
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
}

func TestEditImageCreateSendsCorrectRequest(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.EditImage.Create(context.Background(), EditImageParams{
		Model:  "flux-fill",
		Prompt: "remove background",
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/nano_banana/edit_image" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
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
		Model:  "flux-dev",
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
