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

// Order
// vm.$bus.$emit("cartOrder:reflash")
// 重新取得購物車資料(Order頁面)

// ShoppingPage
// vm.$bus.$emit("cartOrder:isDiscount", isDiscount)
// 傳遞購物車是否已使用優惠券的資訊(Order -> ShoppingPage)
// isDiscount : 購物車是否已使用優惠券



