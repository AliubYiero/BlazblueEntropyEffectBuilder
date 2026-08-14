/**
 * V2 数据层校验脚本（Q12）
 * @description 数据自检 + 索引结构一致性验证（V2 为唯一数据源）
 * @usage node scripts/validate-v2-data.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf-8'));

const V2 = readJson('src/data/DoubleSkillInfoListV2.json');

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`✗ ${msg}`);
};

// ---- 1. 版本校验 ----
if (V2.version !== '2.0') fail(`version 应为 "2.0"，实际 "${V2.version}"`);
else console.log('✓ version === "2.0"');

// ---- 2. 顶层结构 ----
const expectedKeys = ['version', 'slots', 'styleAliases', 'dualStrategies'];
const actualKeys = Object.keys(V2).sort();
if (JSON.stringify(actualKeys) !== JSON.stringify([...expectedKeys].sort())) {
  fail(`顶层结构异常: ${actualKeys}`);
} else {
  console.log('✓ 顶层结构完整');
}

// ---- 3. 索引构建（与 core/data/loader.ts 逻辑一致） ----
const canonicalStyle = new Map();
for (const [canonical, variants] of Object.entries(V2.styleAliases ?? {})) {
  for (const v of variants) canonicalStyle.set(v, canonical);
}
const canonical = (s) => canonicalStyle.get(s) ?? s;

const strategies = V2.dualStrategies;
if (!Array.isArray(strategies) || strategies.length === 0) fail('dualStrategies 为空');
else console.log(`✓ dualStrategies 数量 ${strategies.length}`);

// 单侧单一流派校验（Q3/Q10 前提）
for (const st of strategies) {
  const p = new Set(st.primary.map((c) => c.style));
  const s = new Set(st.secondary.map((c) => c.style));
  if (p.size !== 1 || s.size !== 1) fail(`策略 ${st.id} 单侧非单一流派: primary=${[...p]} secondary=${[...s]}`);
}
console.log('✓ 全部策略单侧单一流派');

// id / name 唯一性（去重与继承 key 化的前提）
const ids = strategies.map((s) => s.id);
const names = strategies.map((s) => s.name);
if (new Set(ids).size !== ids.length) fail('策略 id 存在重复');
if (new Set(names).size !== names.length) fail('策略 name 存在重复');
console.log('✓ 策略 id 与 name 均唯一');

// bySlotStyle 倒排
const bySlotStyle = new Map();
const addSlotStyle = (slot, style, id) => {
  const key = `${slot}:${canonical(style)}`;
  if (bySlotStyle.has(key)) bySlotStyle.get(key).push(id);
  else bySlotStyle.set(key, [id]);
};
for (const st of strategies) {
  for (const c of st.primary) addSlotStyle(c.slot, c.style, st.id);
  for (const c of st.secondary) addSlotStyle(c.slot, c.style, st.id);
}
if (bySlotStyle.size === 0) fail('bySlotStyle 为空');
else console.log(`✓ bySlotStyle 条目数 ${bySlotStyle.size}`);

// stylesBySlot 槽位
const stylesBySlot = new Map(Object.entries(V2.slots));
if (stylesBySlot.size !== 5) fail(`stylesBySlot 应为 5 个槽位，实际 ${stylesBySlot.size}`);
else console.log(`✓ stylesBySlot 槽位数 ${stylesBySlot.size}（${[...stylesBySlot.keys()].join('/')}）`);

// ---- 4. 策略候选槽位与 triggerSlots 合法性 ----
const allSlots = new Set(stylesBySlot.keys());
let badSlot = 0;
for (const st of strategies) {
  for (const c of [...st.primary, ...st.secondary]) {
    if (!allSlots.has(c.slot)) { badSlot++; fail(`策略 ${st.id} 候选槽位非法: ${c.slot}`); }
  }
  for (const t of st.triggerSlots) {
    if (!allSlots.has(t)) { badSlot++; fail(`策略 ${st.id} triggerSlots 非法: ${t}`); }
  }
}
if (!badSlot) console.log('✓ 全部策略槽位合法');

// ---- 5. stylesBySlot 与 sectList 对齐（Q5/Q8） ----
const ts = readFileSync(join(ROOT, 'src/domains/config/constants.ts'), 'utf-8');
const ATTR_OF = new Map();
const re = /attribute:\s*'([^']+)'\s*,\s*sect:\s*'([^']+)'/g;
let m;
while ((m = re.exec(ts)) !== null) ATTR_OF.set(m[2], m[1]);
if (ATTR_OF.size === 0) fail('无法从 sectList 解析流派属性映射');

const slotStyles = new Set([...stylesBySlot.values()].flat());
const sectNames = new Set(ATTR_OF.keys());
const notInSect = [...slotStyles].filter((s) => !sectNames.has(s));
const notInSlots = [...sectNames].filter((s) => !slotStyles.has(s));
if (notInSect.length || notInSlots.length) {
  fail('stylesBySlot 与 sectList 未对齐');
  if (notInSect.length) console.error('  slots 有而 sectList 无:', notInSect);
  if (notInSlots.length) console.error('  sectList 有而 slots 无:', notInSlots);
} else {
  console.log(`✓ stylesBySlot 与 sectList 完全对齐（${slotStyles.size} 个流派）`);
}

// ---- 6. 副侧属性可从 sectList 反查（element 仅等于主侧） ----
let unResolvable = 0;
for (const st of strategies) {
  const secondaryStyle = st.secondary[0].style;
  if (!ATTR_OF.has(secondaryStyle)) { unResolvable++; fail(`副侧流派 ${secondaryStyle} 不在 sectList`); }
}
if (!unResolvable) console.log('✓ 全部副侧流派可经 sectList 反查属性');

if (failures) {
  console.error(`\n✗ 校验失败，共 ${failures} 处`);
  process.exit(1);
} else {
  console.log('\n✓ 全部校验通过');
}
