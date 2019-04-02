<template>
  <div class="row">
    <!-- 1 -->
    <div class="col-md-4 col-sm-9 mb-4 mx-auto mb-5 order-md-2 order-sm-1">
      <div class="rank">
        <div class="rank__box rank__box--first">
          <i class="fas fa-crown rank__icon"></i>
        </div>
      </div>

      <div class="card border-0 box-shadow text-center h-100">
        <div class="rank"></div>
        <h5 class="card-title card-title--slide">清涼果汁</h5>
        <div class="card__img">
          <img
            class="card-img-top"
            src="https://images.unsplash.com/photo-1546173159-315724a31696?w=1350"
            alt="Card image cap"
          >
        </div>

        <!-- <div class="card-body">
          <h4 class="card-title">金牌西裝</h4>
          <p class="card-text">
            This is a longer card with supporting text below as a natural lead-in to additional content. This content
            is a little bit longer.
          </p>
          <p class="card-text">
            This is a longer card with supporting text below as a natural lead-in to additional content. This content
            is a little bit longer.
          </p>
        </div>-->
        <div class="card-footer card-footer--slide">
          <div class="btn btn-primary btn--slide mb-3">
            <i class="fas fa-shopping-cart mr-1"></i>來一杯
          </div>
          <div class="btn btn-outline-secondary btn--slide">查看更多</div>

          <!-- <div class="btn-group btn-group-sm">
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">SM</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">M</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary disabled">L</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">XL</a>
          </div>-->
        </div>
      </div>
    </div>
    <!-- 2 -->
    <div class="col-md-4 col-sm-9 mb-4 mx-auto mb-5 order-md-1 order-sm-2">
      <div class="rank">
        <div class="rank__box rank__box--second">
          <i class="fas fa-crown rank__icon"></i>
        </div>
      </div>
      <div class="card border-0 box-shadow text-center h-100">
        <img
          class="card-img-top"
          src="https://images.unsplash.com/photo-1501841580093-a258b1937efe?=1350"
          alt="Card image cap"
        >
        <!-- <div class="card-body">
          <h4 class="card-title">金牌西裝</h4>
          <p class="card-text">
            This is a longer card with supporting text below as a natural lead-in to additional content. This content
            is a little bit longer.
          </p>
          <p class="card-text">
            This is a longer card with supporting text below as a natural lead-in to additional content. This content
            is a little bit longer.
          </p>
        </div>-->
        <!-- <div class="card-footer border-top-0 bg-white">
          <div class="btn-group btn-group-sm">
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">SM</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">M</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary disabled">L</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">XL</a>
          </div>
        </div>-->
      </div>
    </div>
    <!--3 -->
    <div class="col-md-4 col-sm-9 mb-4 mx-auto mb-5 order-md-3 order-sm-3">
      <div class="rank">
        <div class="rank__box rank__box--third">
          <i class="fas fa-crown rank__icon"></i>
        </div>
      </div>
      <div class="card border-0 box-shadow text-center h-100">
        <img
          class="card-img-top"
          src="https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?w=1350"
          alt="Card image cap"
        >
        <!-- <div class="card-body">
          <h4 class="card-title">金牌西裝</h4>
          <p class="card-text">
            This is a longer card with supporting text below as a natural lead-in to additional content. This content
            is a little bit longer.
          </p>
          <p class="card-text">
            This is a longer card with supporting text below as a natural lead-in to additional content. This content
            is a little bit longer.
          </p>
        </div>-->
        <!-- <div class="card-footer border-top-0 bg-white">
          <div class="btn-group btn-group-sm">
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">SM</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">M</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary disabled">L</a>
            <a href="shoppingCart-product.html" class="btn btn-outline-secondary">XL</a>
          </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.card {
  overflow: hidden;

  //card-title--slide
  &-title--slide {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s;
    z-index: 10;
  }
  &:hover &-title--slide {
    top: 10%;
    transform: translate(-50%, 50%);
  }

  //card-footer--slide
  &-footer--slide {
    padding: 0;
    position: absolute;
    bottom: -30%;
    left: 50%;
    border: 0;
    background-color: rgba(0, 0, 0, 0);
    transform: translateX(-50%);
    transition: all 0.3s;
    z-index: 10;
  }
  &:hover &-footer--slide {
    bottom: 40%;
  }

  &__img {
    overflow: hidden;
    img {
      transition: all 0.3s;
    }
  }
  &:hover &__img img {
    transform: scale(1.1);
    filter: blur(1.5px) brightness(80%);
  }
}

.rank {
  position: relative;
  &__box {
    position: absolute;
    top: 0;
    right: 5%;
    width: 3.75rem;
    height: 5rem;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    clip-path: polygon(50% 0, 100% 20%, 100% 100%, 0 100%, 0 20%);
    z-index: 20;
    &--first {
      background-color: #fee101;
    }
    &--second {
      background-color: #a7a7ad;
    }
    &--third {
      background-color: #cd853f;
    }
  }

  &__icon {
    font-size: 2rem;
    color: #ffffff;
  }
}
</style>
