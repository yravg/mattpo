# Handoff: mattpo

## Continue prompt

```
Repo: https://github.com/yravg/mattpo (branch main). Read AGENTS.md, then docs/handoff/mattpo.md, then README.md.
Next step: check open issues labelled upstream-sync (gh issue list -R yravg/mattpo --label upstream-sync). If any, do the coverage review it asks for in a branch and open a PR. If none, there is nothing to do.
Checks that must pass: node scripts/test-snapshot.mjs && node scripts/test-sync.mjs, and the ci workflow on the PR.
```

## Status (2026-11-23)

| Item | State | Evidence |
|---|---|---|
| Release 0.1.0 from the verified ZIP `mattpo-0.1.0.zip` | done | First commit on main. Pin `abeeaf95660ba9e8b7c753eb38f441ca707a8823`, upstream plugin 1.3.2. |
| Own public repo, MIT | done | `LICENSE` (glue) and `vendor/LICENSE` (upstream, Matt Pocock). |
| Repo is its own marketplace (`mattpo`, source `./`) | done | `.claude-plugin/marketplace.json`. Checked by `test-snapshot.mjs`. |
| Daily upstream sync Action | done | `.github/workflows/upstream-sync.yml`. First manual run is recorded in the Actions tab. |
| CI on push and PR | done | `.github/workflows/ci.yml`. |
| Installed on the owner's Mac (Claude Code, marketplace `mattpo`, auto-update on) | done | `claude plugin list` shows `mattpo@mattpo`. |
| `yravg/yra-skills` PR #1 (the earlier in-monorepo version) | open, superseded | Recommend closing it. It conflicts with main and would duplicate the plugin. |
| Claude Desktop namespacing | not checked | anthropics/claude-code issue 86627. |

## Where things live

- Source of truth: this repo. The release ZIP and the test report from 23-Nov-2026 are backed up in Google Drive, folder `mattpo` (owner's Drive, id `12SRQNwOIi1McLk4Llfa9nCZZ1fiFNBdU`). They are not needed to rebuild. Rebuild a ZIP with `git archive --format=zip -o mattpo-<version>.zip HEAD`.
- No Claude-only links are needed to work on this repo.

## When the sync opens an issue

1. Read the `REFUSED:` line in the issue.
2. Licence changed: read the new `LICENSE` upstream. If it is still permissive, continue. If not, stop and ask the owner.
3. Skill path added, removed or renamed: decide expose or vendor-only for each and update `coverage.json` and `COVERAGE.md`.
4. `node scripts/sync.mjs --apply`, then both tests, then `node scripts/bump-version.mjs`, then a `CHANGELOG.md` entry, then a PR. Close the issue when the PR merges.

## Open decisions

- Auto-commit vs PR for clean upstream syncs. Current choice is auto-commit to main after the tests pass, because the owner asked for the plugin to always follow the source. The guards still stop any licence or coverage change. To switch to PRs, change the "Commit to main" step to push a branch and run `gh pr create`.
