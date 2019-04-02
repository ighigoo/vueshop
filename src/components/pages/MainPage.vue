<template>
  <div>
    <!-- navbar -->
    <Navbar></Navbar>
    <div class="container-fliud">
      <!-- 輪播 -->
      <Carousel></Carousel>
    </div>
    <main role="main" class="container">
      <div class="row">
        <h2 class="col-12 text-center mb-5">暢銷飲品</h2>
        <!-- 暢銷商品 -->
        <HotSales></HotSales>
        <!-- <router-view></router-view> -->
      </div>
    </main>

    <!-- footer -->
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from "../Navbar";
import Carousel from "../Carousel";
import HotSales from "../HotSales";
import Footer from "../Footer";
export default {
  components: {
    Navbar,
    Carousel,
    HotSales,
    Footer
  }
};
</script>

<style>
</style>
