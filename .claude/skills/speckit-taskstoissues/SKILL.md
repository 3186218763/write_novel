---
name: speckit-taskstoissues
description: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.
argument-hint: Optional filter or label for GitHub issues
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before tasks-to-issues conversion)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_taskstoissues` key
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each executable hook, output based on its `optional` flag.
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Outline

1. Parse FEATURE_DIR and AVAILABLE_DOCS list. Extract path to tasks.md.

2. Get the Git remote by running:

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> ONLY PROCEED TO NEXT STEPS IF THE REMOTE IS A GITHUB URL

3. For each task in the list, use the GitHub MCP server to create a new issue in the repository that is representative of the Git remote.

> [!CAUTION]
> UNDER NO CIRCUMSTANCES EVER CREATE ISSUES IN REPOSITORIES THAT DO NOT MATCH THE REMOTE URL

## Post-Execution Checks

Check `.specify/extensions.yml` for `hooks.after_taskstoissues` entries and dispatch accordingly.
