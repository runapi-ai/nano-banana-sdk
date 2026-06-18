// Package nanobanana provides the NanoBanana image generation API client.
//
//	client, err := nanobanana.NewClient(option.WithAPIKey("sk-your-api-key"))
//	result, err := client.TextToImage.Run(ctx, nanobanana.TextToImageParams{
//	    Model: "nano-banana", Prompt: "A futuristic cityscape at night",
//	})
package nanobanana

import (
	"context"

	"github.com/runapi-ai/core-sdk/go/base"
	"github.com/runapi-ai/core-sdk/go/core"
	"github.com/runapi-ai/core-sdk/go/option"
)

const (
	textToImagePath = "/api/v1/nano_banana/text_to_image"
	editImagePath   = "/api/v1/nano_banana/edit_image"
)

// Client is the NanoBanana image generation API client.
type Client struct {
	base.Base
	// TextToImage provides image generation operations.
	TextToImage *TextToImage
	// EditImage provides image editing operations.
	EditImage *EditImage
}

// NewClient creates a NanoBanana client with the given options.
func NewClient(opts ...option.ClientOption) (*Client, error) {
	resolved, err := option.ResolveClientOptions(opts...)
	if err != nil {
		return nil, err
	}
	httpClient, err := core.NewHTTPClient(resolved)
	if err != nil {
		return nil, err
	}
	return NewClientWithHTTP(httpClient), nil
}

// NewClientWithHTTP creates a NanoBanana client with a pre-configured HTTP transport.
func NewClientWithHTTP(httpClient core.HTTPClient) *Client {
	return &Client{Base: base.New(httpClient), TextToImage: &TextToImage{http: httpClient}, EditImage: &EditImage{http: httpClient}}
}

// TextToImage generates images from text prompts with various models and options.
type TextToImage struct{ http core.HTTPClient }

// EditImage modifies existing images based on text prompts.
type EditImage struct{ http core.HTTPClient }

// Create submits a text-to-image task and returns immediately with a task id.
func (r *TextToImage) Create(ctx context.Context, params TextToImageParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, textToImagePath, core.CompactParams(params), requestOptions)
}

// Get fetches the current status of a text-to-image task by id.
func (r *TextToImage) Get(ctx context.Context, id string, opts ...option.RequestOption) (*TextToImageResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[TextToImageResponse](ctx, r.http, core.ResourcePath(textToImagePath, id), requestOptions)
}

// Run submits a text-to-image task and polls until it completes.
func (r *TextToImage) Run(ctx context.Context, params TextToImageParams, opts ...option.RequestOption) (*TextToImageResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*TextToImageResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

// Create submits an edit-image task and returns immediately with a task id.
func (r *EditImage) Create(ctx context.Context, params EditImageParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, editImagePath, core.CompactParams(params), requestOptions)
}

// Get fetches the current status of an edit-image task by id.
func (r *EditImage) Get(ctx context.Context, id string, opts ...option.RequestOption) (*EditImageResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[EditImageResponse](ctx, r.http, core.ResourcePath(editImagePath, id), requestOptions)
}

// Run submits an edit-image task and polls until it completes.
func (r *EditImage) Run(ctx context.Context, params EditImageParams, opts ...option.RequestOption) (*EditImageResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*EditImageResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}
