<template>
  <div>
    <nav
      class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow navbar-expand-sm d-flex"
    >
      <!-- <a class="navbar-brand px-3 mr-0" href="#">
        <i class="fas fa-glass-cheers mr-2"></i>好喝飲料鋪
      </a>-->
      <router-link class="navbar-brand px-3 mr-0" to="/">
        <i class="fas fa-glass-cheers mr-2"></i>好喝飲料鋪
      </router-link>
      <ShoppingCartNav class="ml-auto order-sm-1"></ShoppingCartNav>
      <button
        class="navbar-toggler order-sm-2"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto p-3">
          <!-- <li class="nav-item active">
            <a class="nav-link" href="#">產品列表</a>
          </li>-->
          <li class="nav-item active">
            <router-link class="nav-link" to="/Shopping/Shopping_List">產品列表</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">訂單查詢</a>
          </li>
          <li class="nav-item text-nowrap">
            <a class="nav-link" href="#" @click.prevent="logOut" v-if="isLogin">登出</a>
            <a class="nav-link" href="#" v-else>登入</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import $ from "jquery";
import ShoppingCartNav from "./ShoppingCartNav";

export default {
  name: "Navbar",
  components: {
    ShoppingCartNav
  },
  data() {
    return {
      isLogin: false
    };
  },
  methods: {
    logOut() {
      let vm = this;
      const api = `${process.env.APIPATH}/logout`;

      this.$http.post(api).then(response => {
        if (response.data.success) {
          vm.checkLogin();
          vm.$router.push("/admin/login");
        }
      });
    },
    checkLogin() {
      let vm = this;
      const api = `${process.env.APIPATH}/api/user/check`;
      this.$http.post(api).then(response => {
        vm.isLogin = response.data.success;
      });
    }
  },

  created() {
    const vm = this;
    vm.checkLogin();

    // 自定義名稱 'checkLogin'
    // 確認登入狀態並反映在NavBar上(登入/登出 btn)
    vm.$bus.$on("checkLoginBus", () => {
      vm.checkLogin();
    });
    //vm.$bus.$emit("checkLogin", true);
  }
};
</script>

<style>
</style>
