<p align="center">
  <a href="https://runapi.ai"><img src="https://runapi.ai/icon.svg" height="56" alt="RunAPI"></a>
</p>

<h3 align="center">
  <a href="https://github.com/runapi-ai/nano-banana-sdk">Nano Banana API SDK for RunAPI</a>
</h3>

<p align="center">
  Nano Banana API SDKs for JavaScript, Python, Ruby, Go, and Java on RunAPI.
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@runapi.ai/nano-banana)](https://www.npmjs.com/package/@runapi.ai/nano-banana)
[![PyPI](https://img.shields.io/pypi/v/runapi-nano-banana)](https://pypi.org/project/runapi-nano-banana/)
[![RubyGems](https://img.shields.io/gem/v/runapi-nano_banana)](https://rubygems.org/gems/runapi-nano_banana)
[![Go Reference](https://pkg.go.dev/badge/github.com/runapi-ai/nano-banana-sdk/go.svg)](https://pkg.go.dev/github.com/runapi-ai/nano-banana-sdk/go)
[![Maven Central](https://img.shields.io/maven-central/v/ai.runapi/runapi-nano-banana)](https://central.sonatype.com/artifact/ai.runapi/runapi-nano-banana)
[![License](https://img.shields.io/github/license/runapi-ai/nano-banana-sdk)](https://github.com/runapi-ai/nano-banana-sdk/blob/main/LICENSE)

</div>
<br/>

The Nano Banana API SDK packages JavaScript, Python, Ruby, Go, and Java clients for Nano Banana on RunAPI. Use it for text-to-image and image editing workflows when your app needs typed request builders, predictable task polling, file upload helpers, account helpers, and consistent RunAPI errors.

Nano Banana is listed in the RunAPI model catalog at https://runapi.ai/models/nano-banana. Variant pages below carry pricing, rate-limit, and commercial-usage details. The public `nano-banana-sdk` repository groups the language packages, examples, CI, and release tags for this model.

## Install

```bash
npm install @runapi.ai/nano-banana
pip install runapi-nano-banana
gem install runapi-nano_banana
go get github.com/runapi-ai/nano-banana-sdk/go@latest
```

Gradle:

```kotlin
dependencies {
  implementation("ai.runapi:runapi-nano-banana:0.1.0")
}
```

Maven:

```xml
<dependency>
  <groupId>ai.runapi</groupId>
  <artifactId>runapi-nano-banana</artifactId>
  <version>0.1.0</version>
</dependency>
```

Use the Java BOM when installing multiple RunAPI Java modules:

```kotlin
dependencies {
  implementation(platform("ai.runapi:runapi-bom:0.1.0"))
  implementation("ai.runapi:runapi-nano-banana")
}
```

## What you can build

- Build apps, agent workflows, batch jobs, and production services around Nano Banana requests.
- Install only the language package your app needs while keeping one model-specific repository for docs and releases.
- Use `create` for submit-only jobs, `get` for status lookup, and `run` for submit-and-poll scripts.
- Upload local files, URL files, or base64 files through shared RunAPI file helpers.
- Handle validation, authentication, rate limits, insufficient credits, task failures, and polling timeouts through RunAPI SDK errors.

## Java quick start

```java
import ai.runapi.nanobanana.NanoBananaClient;
import ai.runapi.nanobanana.types.TextToImageParams;
import ai.runapi.nanobanana.types.CompletedTextToImageResponse;
import ai.runapi.nanobanana.types.TextToImageModel;

NanoBananaClient client = NanoBananaClient.builder()
    .apiKey(System.getenv("RUNAPI_API_KEY"))
    .build();

CompletedTextToImageResponse result = client.textToImage().run(
    TextToImageParams.builder()
        .model(TextToImageModel.NANO_BANANA)
        .prompt("A realistic photo of a glass apple on blue fabric")
        .aspectRatio("1:1")
        .outputResolution("720p")
        .build()
);
```

Java packages target Java 8 bytecode and are tested on Java 8, 11, 17, and 21. Each model artifact depends on `ai.runapi:runapi-core`, so application code normally installs only `ai.runapi:runapi-nano-banana`.

## Task lifecycle

Most media endpoints are asynchronous. `create()` submits a task and returns its id, `get(id)` fetches the latest task state, and `run(params)` creates the task and polls until it reaches a terminal state. In web request handlers, prefer `create()` plus webhook or later `get()` polling so the server does not hold a worker open.

## Repository layout

- `js/` publishes `@runapi.ai/nano-banana`.
- `python/` publishes `runapi-nano-banana`.
- `ruby/` publishes `runapi-nano_banana` when RubyGems publishing resumes.
- `go/` publishes `github.com/runapi-ai/nano-banana-sdk/go` and depends on `github.com/runapi-ai/core-sdk/go`.
- `java/` publishes `ai.runapi:runapi-nano-banana` and depends on `ai.runapi:runapi-core`.

## Public links

- Model page: https://runapi.ai/models/nano-banana
- SDK docs: https://runapi.ai/docs#sdk-nano-banana
- Product docs: https://runapi.ai/docs#nano-banana
- SDK repository: https://github.com/runapi-ai/nano-banana-sdk
- Skill repository: https://github.com/runapi-ai/nano-banana
- Provider comparison: https://runapi.ai/providers/google
- Full catalog: https://runapi.ai/models

## Pricing and variants

Use the most specific Nano Banana variant page for pricing, rate limits, and commercial usage:
- [Standard](https://runapi.ai/models/nano-banana/nano-banana)
- [Pro](https://runapi.ai/models/nano-banana/pro)
- [Edit](https://runapi.ai/models/nano-banana/edit)
- [Nano Banana 2](https://runapi.ai/models/nano-banana/2)

Default pricing link for the Nano Banana SDK: https://runapi.ai/models/nano-banana/nano-banana

## File storage

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## FAQ

### Which package should I install for Nano Banana work?

Install the model package for your language: `@runapi.ai/nano-banana` on npm, `runapi-nano-banana` on PyPI, `runapi-nano_banana` on RubyGems, `github.com/runapi-ai/nano-banana-sdk/go`, or `ai.runapi:runapi-nano-banana`. Install core SDK packages only when you are building shared SDK infrastructure.

### Where should public links point?

Primary Nano Banana links point to https://runapi.ai/models/nano-banana. Pricing and usage-policy links point to variant pages such as https://runapi.ai/models/nano-banana/nano-banana. Provider comparisons point to https://runapi.ai/providers/google, and broad browsing points to https://runapi.ai/models.

## License

Licensed under the Apache License, Version 2.0.
