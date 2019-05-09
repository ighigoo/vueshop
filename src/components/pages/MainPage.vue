<template>
  <div>
    <!-- navbar -->
    <Navbar></Navbar>
    <Alert></Alert>

    <div class="container-fliud">
      <!-- 輪播 -->
      <Carousel></Carousel>
    </div>
    <main role="main" class="container-fluid bg-main">
      <div class="container">
        <div class="row">
          <div class="d-flex text-center mx-auto mb-5">
            <h2 class="text-primary-dark text-background px-5 py-3">暢銷飲品</h2>
          </div>
          <!-- 暢銷商品 -->
          <HotSales></HotSales>
          <!-- <router-view></router-view> -->
        </div>
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
import Alert from "../AlertMessage";

export default {
  components: {
    Navbar,
    Carousel,
    HotSales,
    Footer,
    Alert
  }
};
</script>

<style lang="scss">
// @import "~bootstrap/scss/functions";
// @import "../../assets/helpers/variables";
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

main {
  min-height: calc(100vh - (72px + 106px));
}

.text-background {
  background-color: rgba($light, 0.2);
}
@media screen and (max-width: 768px) {
  .text-background {
    background-color: rgba($light, 0.4);
  }
}
</style>
