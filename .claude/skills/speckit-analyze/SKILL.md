---
name: speckit-analyze
description: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.
argument-hint: Optional focus areas for analysis
user-invocable: true
disable-model-invocation: false
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before analysis)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_analyze` key
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- For each executable hook, output the following based on its `optional` flag:
  - **Optional hook** (`optional: true`):
    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **Mandatory hook** (`optional: false`):
    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}

    Wait for the result of the hook command before proceeding to the Goal.
    ```
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Goal

Identify inconsistencies, duplications, ambiguities, and underspecified items across the three core artifacts (`spec.md`, `plan.md`, `tasks.md`) before implementation. This command MUST run only after `__SPECKIT_COMMAND_TASKS__` has successfully produced a complete `tasks.md`.

## Operating Constraints

**STRICTLY READ-ONLY**: Do **not** modify any files. Output a structured analysis report. Offer an optional remediation plan (user must explicitly approve before any follow-up editing commands would be invoked manually).

**Constitution Authority**: The project constitution (`/memory/constitution.md`) is **non-negotiable** within this analysis scope. Constitution conflicts are automatically CRITICAL and require adjustment of the spec, plan, or tasks—not dilution, reinterpretation, or silent ignoring of the principle. If a principle itself needs to change, that must occur in a separate, explicit constitution update outside `__SPECKIT_COMMAND_ANALYZE__`.

## Execution Steps

### 1. Initialize Analysis Context

Parse FEATURE_DIR and AVAILABLE_DOCS. Derive absolute paths to spec.md, plan.md, tasks.md. Abort if any required file missing.

### 2. Load Artifacts (Progressive Disclosure)

Load minimal necessary context from each artifact: spec.md (requirements, success criteria, user stories, edge cases), plan.md (architecture, data model, phases, constraints), tasks.md (task IDs, descriptions, phase grouping, parallel markers, file paths), constitution (`/memory/constitution.md`).

### 3. Build Semantic Models

- **Requirements inventory**: For each Functional Requirement (FR-###) and Success Criterion (SC-###), record a stable key
- **User story/action inventory**: Discrete user actions with acceptance criteria
- **Task coverage mapping**: Map each task to one or more requirements or stories
- **Constitution rule set**: Extract principle names and MUST/SHOULD normative statements

### 4. Detection Passes

Focus on high-signal findings. Limit to 50 findings total.

#### A. Duplication Detection
#### B. Ambiguity Detection
#### C. Underspecification
#### D. Constitution Alignment
#### E. Coverage Gaps
#### F. Inconsistency

### 5. Severity Assignment

- **CRITICAL**: Violates constitution MUST, missing core spec artifact, or requirement with zero coverage
- **HIGH**: Duplicate or conflicting requirement, ambiguous security/performance attribute, untestable criterion
- **MEDIUM**: Terminology drift, missing non-functional task coverage, underspecified edge case
- **LOW**: Style/wording improvements, minor redundancy

### 6. Produce Compact Analysis Report

Output a Markdown report with findings table, coverage summary, constitution alignment issues, unmapped tasks, and metrics (total requirements, tasks, coverage %, ambiguity/duplication/critical counts).

### 7. Provide Next Actions

### 8. Offer Remediation

### 9. Check for extension hooks (after_analyze)
