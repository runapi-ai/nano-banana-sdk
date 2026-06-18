<p align="center">
  <a href="https://github.com/runapi-ai/nano-banana">
    <h3 align="center">Nano Banana API Skill for RunAPI</h3>
  </a>
</p>

<p align="center">
  Install this agent skill, inspect Nano Banana fields, then run jobs through the RunAPI CLI.
</p>

<p align="center">
  <a href="https://runapi.ai/models/nano-banana"><strong>Model Reference</strong></a> · <a href="https://github.com/runapi-ai/cli"><strong>CLI</strong></a> · <a href="https://github.com/runapi-ai/nano-banana-sdk"><strong>SDK</strong></a>
</p>

<div align="center">

[![skills.sh](https://www.skills.sh/b/runapi-ai/nano-banana)](https://www.skills.sh/runapi-ai/nano-banana/nano-banana)
[![ClawHub](https://img.shields.io/badge/ClawHub-runapi--nano--banana-111827)](https://clawhub.ai/runapi-ai/runapi-nano-banana)
[![License](https://img.shields.io/github/license/runapi-ai/nano-banana)](https://github.com/runapi-ai/nano-banana/blob/main/LICENSE)

</div>
<br/>

Generate and edit images with Nano Banana standard, pro, and edit models. This skill helps Claude Code, Codex, Gemini CLI, Cursor, and 50+ agents integrate Nano Banana through RunAPI.

The canonical agent file is `skills/nano-banana/SKILL.md`.

## Install

```bash
npx skills add runapi-ai/nano-banana -g
```

Or paste this prompt to your AI agent:

```text
Install the nano-banana skill for me:

1. Clone https://github.com/runapi-ai/nano-banana
2. Copy the skills/nano-banana/ directory into your
   user-level skills directory (e.g. ~/.claude/skills/
   for Claude Code, ~/.codex/skills/ for Codex).
3. Verify that SKILL.md is present.
4. Confirm the install path when done.
```

## Quick example

```typescript
import { NanoBananaClient } from '@runapi.ai/nano-banana';

const client = new NanoBananaClient();
const result = await client.textToImage.run({
  model: 'nano-banana',
  prompt: 'A bowl of fruit on a wooden table, soft daylight',
  aspect_ratio: '16:9',
});
const url = result.images[0].url;
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

- Integration work uses the target language SDK; one-off generation, manual smoke tests, debugging, or user-requested CLI runs use the RunAPI CLI skill: https://github.com/runapi-ai/cli-skill
- RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.
- Keep API keys in `RUNAPI_API_KEY` or RunAPI CLI config; never commit secrets.
- Prefer `create`, `get`, and `run` JSON passthrough patterns instead of inventing flags for every model parameter.
- For nano banana api pricing, rate-limit, and commercial-usage answers, link to the variant page rather than the repository README.

## License

Licensed under the Apache License, Version 2.0.
