<style lang="scss" scoped>

</style>

<template>
	<el-menu
		:default-active="defaultActiveTab"
		mode="horizontal"
		router
	>
		<el-menu-item :index="tabMapper.searchDouble">双重词条选择
		</el-menu-item>
		<el-menu-item :index="tabMapper.sectBuilder">流派构建
		</el-menu-item>
	</el-menu>
</template>

<script lang="ts" setup>

import { router } from '../../router';
import { computed } from 'vue';

/**
 * tabs router Mapper
 * */
const tabMapper = {
	searchDouble: '/',
	sectBuilder: '/builder',
};

/**
 * 默认菜单
 * */
const defaultActiveTab = computed( () => router.currentRoute.value.fullPath );
</script>
