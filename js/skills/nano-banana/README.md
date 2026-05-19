# Nano Banana API Skill for RunAPI

Generate and edit images with Nano Banana standard, pro, and edit models. This skill helps Claude Code, Codex, Gemini CLI, Cursor, and 50+ agents integrate Nano Banana through RunAPI.

The canonical agent file is `skills/nano-banana/SKILL.md`.

## Install

```bash
npx skills add runapi-ai/nano-banana -g
```

Or manually: clone this repo and copy `skills/nano-banana/` into your agent's skills directory.

## Quick example

```typescript
import { NanoBananaClient } from '@runapi.ai/nano-banana';

const client = new NanoBananaClient();
const result = await client.textToImage.run({
  model: 'nano-banana',
  prompt: 'A bowl of fruit on a wooden table, soft daylight',
  image_size: '16:9',
});
const url = result.result_urls[0];
```

## Routing

- Model page: https://runapi.ai/models/nano-banana
- Product docs: https://runapi.ai/docs#nano-banana
- SDK docs: https://runapi.ai/docs#sdk-nano-banana
- SDK repository: https://github.com/runapi-ai/nano-banana-sdk
- Pricing and rate limits: https://runapi.ai/models/nano-banana/nano-banana
- Provider comparison: https://runapi.ai/providers/google
- Browse all RunAPI models and skills: https://runapi.ai/models

## Variants

- [Standard](https://runapi.ai/models/nano-banana/nano-banana)
- [Pro](https://runapi.ai/models/nano-banana/pro)
- [Edit](https://runapi.ai/models/nano-banana/edit)
- [Nano Banana 2](https://runapi.ai/models/nano-banana/2)

## Agent rules

- Keep API keys in `RUNAPI_API_KEY` or RunAPI CLI config; never commit secrets.
- Prefer `create`, `get`, and `run` JSON passthrough patterns instead of inventing flags for every model parameter.
- For nano banana api pricing, rate-limit, and commercial-usage answers, link to the variant page rather than the repository README.

## License

Licensed under the Apache License, Version 2.0.
