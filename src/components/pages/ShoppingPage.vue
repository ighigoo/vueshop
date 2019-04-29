<template>
  <div>
    <!-- navbar -->
    <Navbar></Navbar>
    <div class="container-fluid main bg-main py-5">
      <div class="container">
        <!-- 商品列表+客制功能欄  購買流程+ (確認結帳 付款成功) -->
        <router-view></router-view>
      </div>
      <TurnTableIcon v-if="showIcon"></TurnTableIcon>
    </div>
    <!-- footer -->
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from "../Navbar";
import Footer from "../Footer";
import TurnTableIcon from "../TurnTableIcon";

export default {
  components: {
    Navbar,
    Footer,
    TurnTableIcon
  },
  data() {
    return {
      showIcon: false
    };
  },
  methods: {
    checkRoute() {
      const vm = this;
      if (vm.$route.name === "Order") {
        vm.showIcon = true;
      } else {
        vm.showIcon = false;
      }
    }
  },
  created() {
    const vm = this;
    vm.checkRoute();
  },
  watch: {
    $route(to, from) {
      const vm = this;
      vm.checkRoute();
    }
  }
};
</script>

<style lang="scss">
.bg-main {
  background-image: linear-gradient(
      to right bottom,
      rgba($dark, 0.2),
      rgba($light-blue, 0.2)
    ),
    url(https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350);

  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
}
.main {
  min-height: calc(100vh - (72px + 106px));
  margin-top: 72px; // nav height
}

.page-mt {
  margin-top: 3rem;
}
</style>
