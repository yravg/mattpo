### Upstream sync

**Upstream is synced by the daily `upstream-sync` Action in yravg/mattpo. Locally you check and pull.**

1. Follow `../../mattpo-sync/SKILL.md`.
2. A licence change or a skill path that was added, removed or renamed is a coverage review. The Action opens an issue for it. Do not apply it in this playbook. Do the review in a clone of yravg/mattpo (update `coverage.json` and `COVERAGE.md`, then run `node scripts/sync.mjs --apply` and the tests there, and open a PR).
3. Run the QA gate in `../../mattpo/SKILL.md`.

**Reply:** the check output, whether the Action ran, and whether the plugin was updated.
