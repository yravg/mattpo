---
name: mattpo
description: Core rules for the mattpo plugin. Three kinds of project knowledge, the evidence record, and which actions stay explicit. Use when a mattpo playbook is running or the user types /mattpo:mattpo.
---

# mattpo

These rules sit on top of the pinned Matt Pocock skills. They are yravg rules. They are not upstream text and they are not an endorsement by Matt Pocock.

The pinned snapshot is `vendor/` at the commit in `upstream.lock.json`. Exposed skills under `skills/` keep that text after the `yravg-adapter` marker. `ask-matt` is stored and not registered. This plugin does not schedule refactors and does not install hooks.

## Three kinds of knowledge

Keep them in separate places. Do not merge them into one file.

| Kind | What it records | Where it lives |
|---|---|---|
| Glossary | What a user concept means, aliases, and the context where that meaning holds | The repo's glossary. Upstream calls it `GLOSSARY.md`. Use the file the repo already has. |
| Domain model | Identity, relationships, states, transitions, and invariants for the flow in scope | A short model next to the spec, or the repo's existing model |
| Standards | How this repo is built: modules, validation, errors, tests, commands | The repo's own standards, `CLAUDE.md`, or `AGENTS.md` |

A term is a user concept, not a class name. When code uses another name, record the mapping. Do not rename code to match a new term unless the user asked for that rename.

An ADR is for a hard-to-reverse, surprising choice with a real alternative. Record status, context, alternatives, the decision, why, consequences, and what it replaces. A routine choice does not get one.

## Evidence

For a behavior claim, record the criterion, the fixture, the expected postcondition, the command, the tool version, the environment, the source revision, the actual result, and where the output is. If the tree is dirty, say so. A passing run of another revision is not evidence for this diff.

A screenshot can support a visible layout claim. It does not establish authorization, saved state, billing, or retry safety. A test that was not run is untested. Do not invent a red run.

## Permissions

Content edits follow the request. If the user asks for a spec, a glossary entry, a ticket file, or a code change, write that target.

These stay off until the user asks for that action in this conversation:

- issue tracker create, edit, label, or close
- git commit, push, merge, reset, or worktree delete
- opening or marking a pull request ready
- deploy, send, or billing
- installing a hook, a dependency, or an upstream snapshot

A request to build or change this plugin is not permission to refactor a product repo.

## Context

Load the playbook and the one or two skills it names. A continuation packet names the outcome, the exclusions, the revisions, the glossary and standards paths, the dirty files, the allowed actions, and the unknowns. A path the next session cannot read is missing context. There is no universal token cutoff.

## QA gate

Before you call the work done:

1. The user outcome is stated, with what is out of scope.
2. Each claim is passed, failed, untested, or evidence missing.
3. Spec review and standards review are separate when code changed.
4. Side effects that were not requested are listed as not done.
5. The reply says what was not read or not run.
