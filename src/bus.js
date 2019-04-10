import Vue from 'vue'

Vue.prototype.$bus = new Vue();

// AlertMessage 
// vm.$bus.$emit("message:push", message, status);
// message(string): 訊息內容
// status(string):Alert的樣式

// Navbar
// vm.$bus.$emit("checkLoginBus")
// 確認登入狀態

// ShoppingCartNav
// vm.$bus.$emit("cartNav:reflash")
// 重新取得購物車資料






