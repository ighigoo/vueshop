<template>
  <div>
    <!-- navbar -->
    <Navbar></Navbar>
    <div class="container page-mt">
      <!-- 商品列表+客制功能欄  購買流程+ (確認結帳 付款成功) -->
      <router-view></router-view>
    </div>
    <!-- footer -->
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from "../Navbar";
import Footer from "../Footer";
export default {
  components: {
    Navbar,
    Footer
  }
};
</script>

<style lang="scss">
.page-mt {
  margin-top: 5rem;
}
</style>
