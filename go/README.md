# Nano Banana API Go SDK for RunAPI

The nano banana api Go SDK is the language-specific package for Nano Banana on RunAPI. Use this nano banana api package for text-to-image, image editing, and creative production flows when your application needs JSON request bodies, task status lookup, and consistent RunAPI errors in Go.

This nano banana api README is the Go package guide inside the public `nano-banana-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/nano-banana; for API reference, use https://runapi.ai/docs#nano-banana; for SDK docs, use https://runapi.ai/docs#sdk-nano-banana.

## Install

```bash
go get github.com/runapi-ai/nano-banana-sdk/go@latest
```

## Quick start

```go
import (
  "context"

  "github.com/runapi-ai/nano-banana-sdk/go/nanobanana"
)

client, err := nanobanana.NewClient()
task, err := client.Generations.Create(context.Background(), nanobanana.GenerationParams{
  // Pass the Nano Banana JSON request body from https://runapi.ai/docs#nano-banana.
})
status, err := client.Generations.Get(context.Background(), task.ID)
```

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion. In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

## Language notes

Use the public Go module with `github.com/runapi-ai/core-sdk/go` options when building image services, CLIs, or workers. The available resources include generations, and edits. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

## Links

- Model page: https://runapi.ai/models/nano-banana
- SDK docs: https://runapi.ai/docs#sdk-nano-banana
- Product docs: https://runapi.ai/docs#nano-banana
- Pricing and rate limits: https://runapi.ai/models/nano-banana/nano-banana
- Provider comparison: https://runapi.ai/providers/google
- Full catalog: https://runapi.ai/models
- Repository: https://github.com/runapi-ai/nano-banana-sdk

## License

Licensed under the Apache License, Version 2.0.
