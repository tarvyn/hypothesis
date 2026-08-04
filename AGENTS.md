# Project instructions

## Notion workspace

This repository is pinned to the Notion workspace **Investment**
(`1dc64b10-4c8d-8130-b6f2-00035f6fa5e6`).

- Run Notion CLI commands through `./scripts/ntn-project`; do not invoke bare
  `ntn`, because the global default belongs to another workspace.
- Run notion-agents commands through `./scripts/notion-agents-project`; do not
  invoke bare `notion-agents`. The wrapper pins both the Investment workspace
  and this repository's `.agents/notion-agents.yml` config.
- Read the repository page ID from `.agents/repo-id` for `notion-agents repo`
  commands.
- Keep authentication in the OS keychain. Do not add Notion tokens to this
  repository.
