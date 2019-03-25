<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <!-- 卡片 -->
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm" v-if="item.is_enabled==1">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage:`url(${item.imageUrl})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">內容</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- 僅有原價 -->
              <div class="h5" v-if="!item.price ">{{item.origin_price | currency }} 元</div>
              <!-- 僅有原價+優惠價 且 原價>優惠價(正確資料)-->
              <del
                class="h6"
                v-if="item.price && item.origin_price > item.price"
              >原價 {{item.origin_price | currency }} 元</del>
              <div
                class="h5"
                v-if="item.price && item.origin_price > item.price"
              >現在只要 {{item.price | currency }} 元</div>
              <!-- 錯誤資料須從admin驗證-->
              <div class="h5" v-else>{{item.origin_price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="item.id = status.loadingItem"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto">
              <i class="fas fa-spinner fa-spin"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
      <!-- 卡片 End -->
    </div>

    <!-- 查看更多 modal -->
    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt>
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addtoCart(product.id, product.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看更多 modal End -->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      products: [],
      product: {},
      status: {
        loadingItem: ""
      },
      pagination: {},
      isLoading: false
    };
  },
  methods: {
    // 取得產品列表
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
        console.log(response.data.products);
      });
    },
    // 取得單一產品
    getProduct(id) {
      // const vm = this;
      // const api = `${process.env.APIPATH}/api/${
      //   process.env.CUSTOMPATH
      // }/product/${id}`;
      // vm.status.loadingItem = id;
      // this.$http.get(api).then(response => {
      //   vm.status.loadingItem = "";
      //   vm.product = response.data.product;
      //   $("#productModal").modal("show");
      // });
    }
  },
  created() {
    this.getProducts();
  }
};
</script>

<style>
</style>
