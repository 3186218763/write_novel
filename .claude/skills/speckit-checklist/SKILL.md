---
name: speckit-checklist
description: Generate a custom checklist for the current feature based on user requirements. Checklists validate requirements quality — they are "unit tests for English", NOT verification of implementation.
argument-hint: Domain or focus area for the checklist
user-invocable: true
disable-model-invocation: false
---

## Checklist Purpose: "Unit Tests for English"

**CRITICAL CONCEPT**: Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING** - they validate the quality, clarity, and completeness of requirements in a given domain.

**NOT for verification/testing**:
- ❌ NOT "Verify the button clicks correctly"
- ❌ NOT "Test error handling works"
- ❌ NOT "Confirm the API returns 200"

**FOR requirements quality validation**:
- ✅ "Are visual hierarchy requirements defined for all card types?" (completeness)
- ✅ "Is 'prominent display' quantified with specific sizing/positioning?" (clarity)
- ✅ "Are hover state requirements consistent across all interactive elements?" (consistency)
- ✅ "Are accessibility requirements defined for keyboard navigation?" (coverage)
- ✅ "Does the spec define what happens when logo image fails to load?" (edge cases)

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before checklist generation)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_checklist` key
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each executable hook, output based on its `optional` flag.
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Execution Steps

1. **Setup**: Parse FEATURE_DIR and AVAILABLE_DOCS list from repo root.

2. **Clarify intent (dynamic)**: Derive up to THREE initial contextual clarifying questions based on user's phrasing and extracted signals from spec/plan/tasks.

3. **Understand user request**: Combine `$ARGUMENTS` + clarifying answers to derive checklist theme, consolidate must-have items, map focus selections, and infer missing context.

4. **Load feature context**: Read from FEATURE_DIR: spec.md, plan.md (if exists), tasks.md (if exists).

5. **Generate checklist** - Create "Unit Tests for Requirements":
   - Create `FEATURE_DIR/checklists/` directory if it doesn't exist
   - Generate unique checklist filename based on domain (e.g., `ux.md`, `api.md`, `security.md`)
   - If file exists: Append new items; if not: Create new
   - Number items starting from CHK001

   **CORE PRINCIPLE - Test the Requirements, Not the Implementation**:
   Every checklist item MUST evaluate the REQUIREMENTS THEMSELVES for:
   - **Completeness**: Are all necessary requirements present?
   - **Clarity**: Are requirements unambiguous and specific?
   - **Consistency**: Do requirements align with each other?
   - **Measurability**: Can requirements be objectively verified?
   - **Coverage**: Are all scenarios/edge cases addressed?

   **Category Structure**: Requirement Completeness, Requirement Clarity, Requirement Consistency, Acceptance Criteria Quality, Scenario Coverage, Edge Case Coverage, Non-Functional Requirements, Dependencies & Assumptions, Ambiguities & Conflicts

   **Item Structure**: Question format asking about requirement quality, with quality dimension in brackets, reference spec section when checking existing requirements, use [Gap] marker for missing requirements.

   **Traceability Requirements**: MINIMUM ≥80% of items must include at least one traceability reference.

   **Content Consolidization**: Soft cap at 40 items, merge near-duplicates checking same requirement aspect.

   **🚫 ABSOLUTELY PROHIBITED**:
   - ❌ Any item starting with "Verify", "Test", "Confirm", "Check" + implementation behavior
   - ❌ References to code execution, user actions, system behavior
   - ❌ "Click", "navigate", "render", "load", "execute"

   **✅ REQUIRED PATTERNS**:
   - ✅ "Are [requirement type] defined/specified/documented for [scenario]?"
   - ✅ "Is [vague term] quantified/clarified with specific criteria?"
   - ✅ "Are requirements consistent between [section A] and [section B]?"
   - ✅ "Can [requirement] be objectively measured/verified?"

6. **Structure Reference**: Follow the canonical template in `templates/checklist-template.md` for title, meta section, category headings, and ID formatting.

7. **Report**: Output full path to checklist file, item count, and summarize whether created new or appended.

## Post-Execution Checks

Check `.specify/extensions.yml` for `hooks.after_checklist` entries and dispatch accordingly.
