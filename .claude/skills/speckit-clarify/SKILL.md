---
name: speckit-clarify
description: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.
argument-hint: Optional areas to clarify in the spec
user-invocable: true
disable-model-invocation: false
handoffs: 
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before clarification)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_clarify` key
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- For each executable hook, output the following based on its `optional` flag.
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Outline

Goal: Detect and reduce ambiguity or missing decision points in the active feature specification and record the clarifications directly in the spec file.

Note: This clarification workflow is expected to run (and be completed) BEFORE invoking `__SPECKIT_COMMAND_PLAN__`.

Execution steps:

1. Parse FEATURE_DIR and FEATURE_SPEC paths.

2. Load the current spec file. Perform a structured ambiguity & coverage scan using this taxonomy:
   - Functional Scope & Behavior
   - Domain & Data Model
   - Interaction & UX Flow
   - Non-Functional Quality Attributes
   - Integration & External Dependencies
   - Edge Cases & Failure Handling
   - Constraints & Tradeoffs
   - Terminology & Consistency
   - Completion Signals

   For each category, mark status: Clear / Partial / Missing.

3. Generate (internally) a prioritized queue of candidate clarification questions (maximum 5). Do NOT output them all at once.

4. Sequential questioning loop (interactive):
    - Present EXACTLY ONE question at a time.
    - For multiple-choice questions: analyze all options, recommend the most suitable based on best practices, present options in a markdown table
    - After the user answers: record it, then move to the next queued question
    - Stop when all critical ambiguities resolved, user signals completion, or 5 questions reached

5. Integration after EACH accepted answer (incremental update approach):
    - Maintain in-memory representation of the spec
    - Ensure a `## Clarifications` section exists
    - Append a bullet line: `- Q: <question> → A: <final answer>`
    - Apply the clarification to the most appropriate section(s)
    - Save the spec file AFTER each integration

6. Validation (performed after EACH write plus final pass)

7. Write the updated spec back to FEATURE_SPEC.

8. Re-validate Spec Quality Checklist (if it exists)

Behavior rules:
- If no meaningful ambiguities found: "No critical ambiguities detected worth formal clarification."
- If spec file missing, instruct user to run `__SPECKIT_COMMAND_SPECIFY__` first
- Never exceed 5 total asked questions
- Avoid speculative tech stack questions unless absence blocks functional clarity
- Respect user early termination signals

## Mandatory Post-Execution Hooks

Check `.specify/extensions.yml` for `hooks.after_clarify` entries and dispatch accordingly.

## Completion Report

Report: number of questions asked & answered, path to updated spec, sections touched, checklist status, coverage summary table, suggested next command.
