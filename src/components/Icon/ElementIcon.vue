<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue';
import type { Attribute } from '../../interfaces/Attribute.ts';
import { styleMapper } from '../../domains/config/index.ts';

const props = defineProps<{ element: Attribute }>();

/**
 * 组件实例唯一 id，用于 defs/mask 内部 id 去重，
 * 避免同一页面多个图标实例引用到已卸载实例的 defs 而失效
 */
const uid = getCurrentInstance()?.uid ?? 0;

const cssKey = computed( () => styleMapper[ props.element ] );
const color = computed( () => `var(--element-${cssKey.value})` );
</script>

<template>
	<svg
		class="element-icon"
		viewBox="0 0 300 300"
		:style="{ color }"
		aria-hidden="true"
	>
		<!-- 火 -->
		<template v-if="element === '火'">
			<g transform="translate(150 150) scale(0.278293) translate(-445.935316 -461.200357)">
				<path fill="currentColor" d="M462,30 C468,120 495,205 555,295 C615,385 690,465 735,555 C768,622 772,695 735,758 C695,826 610,866 515,884 C420,902 320,892 245,845 C168,796 126,705 131,618 C135,545 172,483 205,425 C218,400 224,372 222,350 C216,338 208,330 202,326 C214,316 234,313 248,322 C262,352 276,400 306,441 C331,476 366,502 376,546 C383,586 361,621 341,661 C319,706 313,751 331,786 C353,823 401,839 446,833 C496,827 536,796 549,751 C561,706 553,656 533,611 C513,566 481,526 453,486 C421,441 386,396 369,341 C353,289 356,231 376,176 C396,121 426,70 462,30 Z"/>
			</g>
		</template>

		<!-- 冰 -->
		<template v-else-if="element === '冰'">
			<defs>
				<path :id="`petal-${uid}`" d="M150,8 L163,52 L150,94 L137,52 Z"/>
			</defs>
			<g transform="translate(150 150) scale(1.153846) translate(-150 -112)">
				<g fill="currentColor">
					<use :href="`#petal-${uid}`"/>
					<use :href="`#petal-${uid}`" transform="rotate(60 150 112)"/>
					<use :href="`#petal-${uid}`" transform="rotate(120 150 112)"/>
					<use :href="`#petal-${uid}`" transform="rotate(180 150 112)"/>
					<use :href="`#petal-${uid}`" transform="rotate(240 150 112)"/>
					<use :href="`#petal-${uid}`" transform="rotate(300 150 112)"/>
				</g>
			</g>
		</template>

		<!-- 电 -->
		<template v-else-if="element === '电'">
			<g transform="translate(150 150) scale(0.941176) translate(-145 -142.5)">
				<path fill="currentColor" d="M95,15 L205,15 L172,95 L225,105 L100,270 L122,168 L65,160 Z"/>
			</g>
		</template>

		<!-- 毒 -->
		<template v-else-if="element === '毒'">
			<defs>
				<g :id="`node-${uid}`">
					<line x1="150" y1="120" x2="150" y2="52" stroke="currentColor" stroke-width="14"/>
					<circle cx="150" cy="52" r="34" fill="currentColor"/>
				</g>
			</defs>
			<g transform="translate(150 150) scale(1.139227) translate(-150 -109.222432)">
				<use :href="`#node-${uid}`"/>
				<use :href="`#node-${uid}`" transform="rotate(120 150 120)"/>
				<use :href="`#node-${uid}`" transform="rotate(240 150 120)"/>
			</g>
		</template>

		<!-- 暗 -->
		<template v-else-if="element === '暗'">
			<g transform="translate(150 150) scale(1.333247) translate(-141 -112)">
				<path fill="currentColor" d="M222,58 A90,90 0 1 0 222,166 A75,75 0 1 1 222,58 Z"/>
				<circle cx="170" cy="112" r="38" fill="currentColor"/>
			</g>
		</template>

		<!-- 光 -->
		<template v-else-if="element === '光'">
			<g transform="translate(150 150) scale(1.090909) translate(-150 -112)">
				<circle cx="150" cy="112" r="88" fill="none" stroke="currentColor" stroke-width="7"/>
				<path fill="currentColor" d="M150,12 Q160,102 260,112 Q160,122 150,212 Q140,122 40,112 Q140,102 150,12 Z"/>
			</g>
		</template>

		<!-- 刃 -->
		<template v-else-if="element === '刃'">
			<defs>
				<path :id="`comma-${uid}`" d="M205,52 C214,64 217,81 210,95 C203,107 187,111 177,103 C169,96 169,84 176,76 C183,68 192,66 197,60 C200,56 202,54 205,52 Z"/>
				<mask :id="`spin-${uid}`">
					<g fill="#fff">
						<circle cx="150" cy="112" r="74"/>
					</g>
					<g fill="#000">
						<circle cx="150" cy="112" r="15"/>
						<use :href="`#comma-${uid}`"/>
						<use :href="`#comma-${uid}`" transform="rotate(120 150 112)"/>
						<use :href="`#comma-${uid}`" transform="rotate(240 150 112)"/>
					</g>
				</mask>
			</defs>
			<g transform="translate(150 150) scale(1.621622) translate(-150 -112)">
				<rect width="300" height="225" fill="currentColor" :mask="`url(#spin-${uid})`"/>
			</g>
		</template>
	</svg>
</template>

<style lang="scss" scoped>
.element-icon {
	display: block;
	width: 1em;
	height: 1em;
}
</style>
