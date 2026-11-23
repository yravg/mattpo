---
name: mattpo-sync
description: Check the pinned mattpocock/skills snapshot against upstream, and pull the latest mattpo release. Use for /mattpo:mattpo-sync.
disable-model-invocation: true
allowed-tools: Bash(node:*), Bash(gh:*), Bash(claude plugin:*)
---

# mattpo sync

Upstream syncing happens in the public repo, not in the installed copy. The GitHub Action `upstream-sync` in `yravg/mattpo` runs every day, applies a new upstream commit behind the licence and coverage guards, runs the tests, bumps the version and commits to `main`. A refused or failing sync opens an issue labelled `upstream-sync` instead.

Never run `sync.mjs --apply` inside the installed plugin folder. Claude Code replaces that folder on every plugin update, so a local apply is lost.

Steps:

1. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/sync.mjs"` and show the output as it is. It is a read-only check of this installed copy against upstream.
   - Exit 0: this copy matches upstream. Go to step 3.
   - Exit 1 with `REFUSED`: say which licence or coverage review is needed. Run `gh issue list -R yravg/mattpo --label upstream-sync` and show any open issue.
   - Exit 1 with an update: either the daily Action has not run yet or it already committed and this install is behind. Ask whether to trigger the Action now. Only after a yes, run `gh workflow run upstream-sync.yml -R yravg/mattpo`, then `gh run watch -R yravg/mattpo $(gh run list -R yravg/mattpo --workflow upstream-sync.yml --limit 1 --json databaseId --jq '.[0].databaseId')`.
   - Exit 2: show the error. Nothing changed.
2. If the Action committed, continue to step 3.
3. Pull the latest release into Claude Code: `claude plugin marketplace update mattpo` and then `claude plugin update mattpo@mattpo`. Tell the user to restart Claude Code to load it.

Never run a script, template, or hook from `vendor/`. Never add a SessionStart hook to re-run this check.
