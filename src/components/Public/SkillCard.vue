<script lang="ts" setup>
import type { SkillInfo } from '../../core/data/types.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import { getSkillsBySect } from '../../domains/config/index.ts';

interface Props {
  skill: SkillInfo;
  size?: 'compact' | 'normal';
  showTriggers?: boolean;
  showTooltip?: boolean;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  showTriggers: true,
  showTooltip: true,
  clickable: false,
});

const emit = defineEmits<{
  (e: 'click', skill: SkillInfo): void;
}>();

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.skill);
  }
};

const styleMapper: Record<Attribute, string> = {
  '火': 'fire', '冰': 'ice', '电': 'thunder',
  '毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

const getSkillDisplay = (sectName: string): string => {
  const skills = getSkillsBySect(sectName);
  return Array.isArray(skills) ? skills.join('、') : skills;
};

const getElementDotClass = (attribute: Attribute): string => {
  return styleMapper[attribute] || 'default';
};
</script>

<template>
  <div
    class="skill-card"
    :class="[`skill-card--${size}`, { 'skill-card--clickable': clickable }]"
    @click="handleClick"
  >
    <div class="skill-card__header">
      <h3 class="skill-card__name">{{ skill.name }}</h3>
      <div v-if="showTriggers && skill.trigger.length > 0" class="skill-card__triggers">
        <span v-for="trigger in skill.trigger" :key="trigger" class="trigger-badge">
          {{ trigger }}
        </span>
      </div>
    </div>

    <div class="skill-card__sects">
      <div class="sect-item">
        <span :class="['element-dot', `element-dot--${getElementDotClass(skill.mainAttribute)}`]"></span>
        <template v-if="showTooltip && getSkillDisplay(skill.mainSect)">
          <el-tooltip :content="getSkillDisplay(skill.mainSect)" placement="top">
            <span class="sect-name">{{ skill.mainSect }}</span>
          </el-tooltip>
        </template>
        <template v-else>
          <span class="sect-name">{{ skill.mainSect }}</span>
        </template>
      </div>
      <span class="sect-connector">+</span>
      <div class="sect-item">
        <span :class="['element-dot', `element-dot--${getElementDotClass(skill.secondAttribute)}`]"></span>
        <template v-if="showTooltip && getSkillDisplay(skill.secondSect)">
          <el-tooltip :content="getSkillDisplay(skill.secondSect)" placement="top">
            <span class="sect-name">{{ skill.secondSect }}</span>
          </el-tooltip>
        </template>
        <template v-else>
          <span class="sect-name">{{ skill.secondSect }}</span>
        </template>
      </div>
    </div>

    <p class="skill-card__desc">{{ skill.description }}</p>
  </div>
</template>

<style lang="scss" scoped>
.skill-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  transition: all 0.15s ease;

  &:hover {
    border-color: hsl(var(--ring));
    background: hsl(var(--accent) / 0.3);
  }
}

.skill-card--normal {
  padding: 16px;

  .skill-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .skill-card__name {
    font-family: var(--font-chinese);
    font-size: 14px;
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .skill-card__triggers {
    display: flex;
    gap: 4px;
  }

  .trigger-badge {
    font-family: var(--font-chinese);
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: calc(var(--radius) - 4px);
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }

  .skill-card__sects {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .sect-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .sect-name {
    font-family: var(--font-chinese);
    font-size: 13px;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .sect-connector {
    color: hsl(var(--muted-foreground));
    font-size: 12px;
  }

  .skill-card__desc {
    font-family: var(--font-chinese);
    font-size: 13px;
    line-height: 1.5;
    color: hsl(var(--muted-foreground));
    padding-top: 8px;
    border-top: 1px solid hsl(var(--border));
  }
}

.skill-card--compact {
  padding: 10px 12px;

  .skill-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .skill-card__name {
    font-family: var(--font-chinese);
    font-size: 13px;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .skill-card__triggers {
    display: flex;
    gap: 4px;
  }

  .trigger-badge {
    font-family: var(--font-chinese);
    font-size: 10px;
    font-weight: 500;
    padding: 2px 6px;
    border-radius: calc(var(--radius) - 4px);
    background: hsl(var(--secondary));
    color: hsl(var(--secondary-foreground));
  }

  .skill-card__sects {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .sect-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .sect-name {
    font-family: var(--font-chinese);
    font-size: 11px;
    color: hsl(var(--foreground));
  }

  .sect-connector {
    color: hsl(var(--muted-foreground));
    font-size: 10px;
  }

  .skill-card__desc {
    font-family: var(--font-chinese);
    font-size: 11px;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
  }
}

.skill-card--clickable {
  cursor: pointer;
}
</style>
