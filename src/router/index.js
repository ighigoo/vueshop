import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import CouponsList from '@/components/pages/CouponsList'
import OrderList from '@/components/pages/OrderList'
import CustomerOrder from '@/components/pages/CustomerOrder'
import MainPage from '@/components/pages/MainPage'
import ShoppingPage from '@/components/pages/ShoppingPage'
import ShoppingList from '@/components/ShoppingList'
import Order from '@/components/Order'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/admin'
      // redirect: '/login'
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: Login
    // },
    {
      path: '/',
      name: '',
      component: MainPage,
      children: [
        { // /#/  (預設)
          path: '',
          name: 'MainPage',
          component: MainPage,
        },

      ]
    },
    {
      path: '/shopping',
      name: '',
      component: ShoppingPage,
      children: [
        { // /#/ShoppingPage/
          path: '',
          name: 'ShoppingPage',
          component: ShoppingList,
        },
        { // /#/Shopping/Shopping_List
          path: 'Shopping_list',
          name: 'ShoppingList',
          component: ShoppingList,
        },
        { // /#/Shopping/Order
          path: 'Order',
          name: 'Order',
          component: Order,
        },

      ]
    },
    {
      path: '/admin',
      name: '',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'coupons_list',
          name: 'CouponsList',
          component: CouponsList,
          meta: { requiresAuth: true },
        },
        {
          path: 'order_list',
          name: 'OrderList',
          component: OrderList,
          meta: { requiresAuth: true },
        },
        { // /#/admin/customer_order
          path: '/customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder,
          meta: { requiresAuth: true },
        },

      ]
    },


  ]
})
