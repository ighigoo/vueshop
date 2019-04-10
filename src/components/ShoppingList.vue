<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="row pt-4">
      <div class="col-md-3">
        <!-- 左側選單 (List group) -->
        <div class="list-group sticky-top sticky-top--fixNav">
          <a
            class="list-group-item list-group-item-action"
            :class="{'active':item.typeName===listNow}"
            data-toggle="list"
            :id="`#${item.type}`"
            href="#"
            v-for="item in lists"
            :key="item.type"
            @click.prevent="listClick(item)"
          >
            <i class="fa mr-2" :class="item.iconClass" aria-hidden="true"></i>
            {{item.typeName}}
          </a>

          <!-- <a
            class="list-group-item list-group-item-action active"
            data-toggle="list"
            id="#list-all"
            href="#"
          >
            <i class="fa fa-glass-cheers mr-2" aria-hidden="true"></i>全部
          </a>
          <a
            class="list-group-item list-group-item-action"
            data-toggle="list"
            id="list-juice"
            href="#list-gift"
          >
            <i class="fas fa-cocktail mr-2" aria-hidden="true"></i>果汁
          </a>
          <a href="#" class="list-group-item list-group-item-action" id="list-tea">
            <i class="fa fa-leaf mr-2" aria-hidden="true"></i>茶
          </a>
          <a href="#" class="list-group-item list-group-item-action" id="list-coffee">
            <i class="fas fa-mug-hot mr-2" aria-hidden="true"></i>咖啡
          </a>
          <a href="#" class="list-group-item list-group-item-action" id="list-bubble">
            <i class="fa fa-wine-bottle mr-2" aria-hidden="true"></i>氣泡
          </a>-->
        </div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <!-- 卡片 -->
          <div class="col-md-4 mb-4" v-for="item in getComputeProducts" :key="item.id">
            <div class="card border-0 shadow-sm" v-if="item.is_enabled==1">
              <div
                style="height: 350px; background-size: cover; background-position: center"
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
                  <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem"></i>
                  查看更多
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm ml-auto"
                  @click="addtoCart(item.id)"
                >
                  <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingCart"></i>
                  加到購物車
                </button>
              </div>
            </div>
          </div>
          <!-- 卡片 End -->
        </div>
        <div class="row">
          <!-- 頁碼 -->
        </div>
      </div>
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
            <select name class="form-control mt-3" v-model="product.num" v-if="product.id">
              <!-- <option value disabled selected hidden>請選擇數量</option> -->
              <option v-for="(num) in 10" :value="num" :key="num">選購 {{num}} {{product.unit}}</option>
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
              @click="addtoCart(product.id, product.num, 1)"
            >
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingCartModal"></i>
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
      products: [], // 商品列表
      product: {}, // 查看更多
      lists: [
        {
          type: "all",
          typeName: "全部",
          iconClass: "fa-glass-cheers"
        },
        {
          type: "juice",
          typeName: "果汁",
          iconClass: "fa-cocktail"
        },
        {
          type: "tea",
          typeName: "茶",
          iconClass: "fa-leaf"
        },
        {
          type: "coffee",
          typeName: "咖啡",
          iconClass: "fa-mug-hot"
        },
        {
          type: "bubble",
          typeName: "氣泡",
          iconClass: "fa-wine-bottle"
        }
      ],

      listNow: "全部", // 目前分類(左側列表)

      cart: {},
      status: {
        loadingItem: "", // 查看更多
        loadingCart: "", // 加入購物車( 主畫面 )
        loadingCartModal: "" // 加入購物車( 單一商品Modal )
      },
      isLoading: false,
      pagination: {},
      defaultNum: ""
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
      });
    },
    // 取得單一產品
    getProduct(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(api).then(response => {
        vm.status.loadingItem = "";
        response.data.product.num = 1;
        vm.product = response.data.product;
        $("#productModal").modal("show");
      });
    },
    // 加入購物車 id: 商品ID qty:數量 type:按鈕 0-主畫面 1-modal
    addtoCart(id, qty = 1, type = 0) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      if (type === 0) {
        vm.status.loadingCart = id;
      } else {
        vm.status.loadingCartModal = id;
      }

      const cart = {
        product_id: id,
        qty
      };
      this.$http.post(api, { data: cart }).then(response => {
        if (response.data.success) {
          if (type === 0) {
            vm.status.loadingCart = "";
          } else {
            vm.status.loadingCartModal = "";
          }
          // 加入成功訊息
          // 重新取得nav購物車資料
          vm.$bus.$emit("cartNav:reflash");
          $("#productModal").modal("hide");
        }
      });
    },
    listClick(item) {
      this.listNow = item.typeName;
    }
  },
  computed: {
    // 列表(分類)切換
    getComputeProducts() {
      const vm = this;
      let ary = [];
      if (vm.listNow === "全部") {
        return vm.products;
      } else {
        return vm.products.filter(function(item, index, array) {
          return item.category === vm.listNow;
        });
      }
    },
    productTotalPrice() {
      const vm = this;
      return vm.product.num * vm.product.price;
    }
  },
  created() {
    this.getProducts();
    //this.getCart();
  }
};
</script>

<style lang="scss">
.sticky-top--fixNav {
  top: 6rem;
}
</style>
