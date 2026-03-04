import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { router } from './router';
import { initializeRepository } from './domains/skill';

const app = createApp( App );

// 引入 pinia
const pinia = createPinia();
app.use( pinia );

// 引入 element-plus
app.use( ElementPlus );

// 引入 vue-router
app.use( router );

// 初始化技能数据仓库
initializeRepository().then( ( success ) => {
	if ( !success ) {
		console.error( '[main] 技能数据加载失败' );
	}
} );

app.mount( '#app' );
