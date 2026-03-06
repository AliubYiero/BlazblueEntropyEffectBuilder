# Inherit Checkbox Redesign Design

## Overview

Redesign the inherit-filters checkboxes in SectBuilderPage.vue to support three states (checked, pending, unchecked) based on activated dual strategies, and add an "Inherit Dual Strategy" dialog for manual activation.

## Data Model Changes

### SkillCardInfo Extension

```typescript
interface SkillCardInfo {
  triggerName: Trigger;
  sect: SectValue | '';
  inherit: boolean;
  inheritSkill?: SkillInfo;  // NEW: records the inherited dual strategy
}
```

### Checkbox Three-State Logic (computed, not stored)

| State | Condition | Visual |
|-------|-----------|--------|
| **Checked** | `inherit === true`, or trigger is the only available trigger for a dual strategy | Solid checked |
| **Pending** | Trigger is in a dual strategy's trigger array, but other triggers are not yet confirmed | Dashed border |
| **Unchecked** | Trigger is not associated with any activated dual strategy | Default empty |

### Auto-Check Rules

1. Single-trigger dual strategy -> auto-check
2. Multi-trigger dual strategy, but all other triggers already checked -> auto-check the last remaining one
3. A checked trigger cannot simultaneously be in pending state

### activatedSkills Extension

The `activatedSkills` computed result merges inherited dual strategies (`inheritSkill`) alongside the normally activated ones.

## Component Design

### New Component: `InheritSkillForm.vue`

Location: `src/components/SectBuilderPage/InheritSkillForm.vue`

- **Props:** `triggerName: Trigger`
- **Emit:** `closeDialog`
- **Content:** Filters `activatedSkills` where `skill.trigger` includes the current `triggerName`, displayed as SkillCard cards
- **Interaction:** Click card -> store sets `inherit = true` + `inheritSkill = selected skill` -> close dialog

### SectBuilderPage.vue Changes

1. **inherit-filters area:** el-checkbox uses `indeterminate` for pending state + custom CSS for dashed border
2. **Click behavior:**
   - Click unchecked/pending -> open inherit dialog
   - Click checked -> directly clear inherit (`inherit = false`, `inheritSkill = undefined`)
3. **New el-dialog:** for inherit form, separate from the existing sect change dialog

### Store New Methods

- `setInheritSkill(triggerName: Trigger, skill: SkillInfo)` — set inherit + record skill
- `clearInheritSkill(triggerName: Trigger)` — clear inherit and associated skill

## Three-State Visual Implementation

Uses el-checkbox `indeterminate` property for pending state:

| State | el-checkbox props | Custom CSS |
|-------|-------------------|------------|
| Checked | `model-value=true` | Default checked |
| Pending | `model-value=false`, `indeterminate=true` | Dashed border on `.el-checkbox__inner` |
| Unchecked | `model-value=false`, `indeterminate=false` | Default empty |

### Computation Pseudocode

```typescript
function getCheckboxState(trigger: Trigger): 'checked' | 'pending' | 'unchecked' {
  const card = store.getSkillCardByTrigger(trigger);
  if (card?.inherit) return 'checked';

  const relatedSkills = activatedSkills.filter(s => s.trigger.includes(trigger));
  if (relatedSkills.length === 0) return 'unchecked';

  for (const skill of relatedSkills) {
    if (skill.trigger.length === 1) return 'checked'; // auto-check single trigger
    const otherTriggers = skill.trigger.filter(t => t !== trigger);
    const allOthersChecked = otherTriggers.every(t => {
      const otherCard = store.getSkillCardByTrigger(t);
      return otherCard?.inherit;
    });
    if (allOthersChecked) return 'checked'; // last remaining, auto-check
  }

  return 'pending';
}
```

## Interaction Flow

```
User configures sects for trigger positions
  -> activatedSkills recalculates
  -> checkboxes auto-derive three states
  -> single-trigger skills auto-check
  -> multi-trigger skills show pending (dashed border)

User clicks pending/unchecked checkbox
  -> inherit dialog opens showing related dual strategies
  -> user clicks a strategy card
  -> store.setInheritSkill(trigger, skill)
  -> checkbox becomes checked
  -> if this was the last pending trigger for another multi-trigger skill, that one auto-checks too

User clicks checked checkbox
  -> store.clearInheritSkill(trigger)
  -> checkbox reverts to pending or unchecked
```
