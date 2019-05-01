<template>
  <div>
    <loading :active.sync="isLoading"></loading>

    <div class="row">
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
        </div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <!-- 卡片 -->
          <div class="col-md-4 mb-4" v-for="item in getComputeProducts" :key="item.id">
            <div class="card border-0 shadow-sm" v-if="item.is_enabled==1">
              <!-- title -->
              <div class="card-title bg-primary mb-0 px-3 py-2">
                <span
                  class="badge badge-primary-dark text-gray float-right p-1 mt-1"
                >{{item.category}}</span>
                <h5 class="font-weight-bold">
                  <a href="#" class="text-gray">{{item.title}}</a>
                </h5>
              </div>
              <!-- img -->
              <div class="card-body bg-img px-1 py-0">
                <div class="card-img" :style="{backgroundImage:`url(${item.imageUrl})`}"></div>
              </div>
              <!-- price -->
              <div class="card-body bg-light">
                <!-- <p class="card-text">內容</p> -->
                <div class="d-flex justify-content-between align-items-baseline">
                  <!-- 僅有原價 -->
                  <div class="h5" v-if="!item.price ">{{item.origin_price | currency }}</div>
                  <!-- 僅有原價+優惠價 且 原價>優惠價(正確資料)-->
                  <del
                    class="h6"
                    v-if="item.price && item.origin_price > item.price"
                  >原價 {{item.origin_price | currency }}</del>
                  <div
                    class="h5"
                    v-if="item.price && item.origin_price > item.price"
                  >現在只要 {{item.price | currency }}</div>
                  <!-- 錯誤資料須從admin驗證-->
                  <div class="h5" v-else>{{item.origin_price | currency }}</div>
                </div>
              </div>
              <div class="card-footer bg-primary-bg d-flex">
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
                  class="btn btn-outline-success btn-sm ml-auto"
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
          <!-- header -->
          <div class="modal-header bg-primary-dark">
            <h5 class="modal-title text-light" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body bg-light p-0">
            <!-- img -->
            <div class="d-flex bg-primary-bg pb-1">
              <img :src="product.imageUrl" class="img-fluid mx-auto" alt>
            </div>
            <div class>
              <!-- description -->

              <blockquote class="blockquote mx-3 mt-3">
                <p class="mb-0">{{ product.content }}</p>
                <footer class="blockquote-footer text-right">{{ product.description }}</footer>
              </blockquote>
              <!-- price -->
              <div class="d-flex justify-content-between align-items-baseline mx-3">
                <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
              </div>
              <!-- detail -->
              <div class="d-flex justify-content-between mx-3 my-1">
                <div class="btn-group" role="group" aria-label="iceBtn">
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.iceBtn===0}"
                    @click="productMod.iceBtn=0"
                  >正常</button>
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.iceBtn===1}"
                    @click="productMod.iceBtn=1"
                  >少冰</button>
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.iceBtn===2}"
                    @click="productMod.iceBtn=2"
                  >去冰</button>
                </div>
                <div class="btn-group" role="group" aria-label="sweetBtn">
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.sweetBtn===0}"
                    @click="productMod.sweetBtn=0"
                  >正常</button>
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.sweetBtn===1}"
                    @click="productMod.sweetBtn=1"
                  >少糖</button>
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.sweetBtn===2}"
                    @click="productMod.sweetBtn=2"
                  >無糖</button>
                </div>
                <div class="btn-group" role="group" aria-label="sizeBtn">
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.sizeBtn===0}"
                    @click="productMod.sizeBtn=0"
                  >M</button>
                  <button
                    type="button"
                    class="btn btn-outline-primary-dark"
                    :class="{active: productMod.sizeBtn===1}"
                    @click="productMod.sizeBtn=1"
                  >L</button>
                </div>
              </div>
              <select
                name
                class="form-control w-93 mx-3 my-3"
                v-model="product.num"
                v-if="product.id"
              >
                <!-- <option value disabled selected hidden>請選擇數量</option> -->
                <option v-for="(num) in 10" :value="num" :key="num">選購 {{num}} {{product.unit}}</option>
              </select>
            </div>
          </div>
          <div class="modal-footer bg-primary-light">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button
              type="button"
              class="btn btn-primary-dark text-light"
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
      productMod: {
        iceBtn: 0, // 0正常 1少冰 2去冰
        sweetBtn: 0, // 0正常 1少糖 2無糖
        sizeBtn: 0 // 0M 1L
      },
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
      const apiDetail = `${process.env.DETAILAPIPATH}/carts`;

      let detail = {
        ice: 0,
        sweet: 0,
        size: 0,
        add: []
      };

      if (type === 0) {
        vm.status.loadingCart = id;
      } else {
        vm.status.loadingCartModal = id;
        detail = {
          ice: vm.productMod.iceBtn,
          sweet: vm.productMod.sweetBtn,
          size: vm.productMod.sizeBtn,
          add: []
        };
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
            //關閉modal
            $("#productModal").modal("hide");
          }
          const result = response.data.data;

          // 加入成功訊息
          vm.$bus.$emit(
            "message:push",
            `${result.product.title}成功加入購物車`,
            "success"
          );

          // 客制資料上傳
          const cartM = {
            cart_id: result.id,
            product_id: result.product_id,
            qty: result.qty,
            detail
          };
          this.$http.post(apiDetail, cartM).then(response => {
            // 重新取得nav購物車資料
            vm.$bus.$emit("cartNav:reflash");
            // vm.getCart();
          });
        }
      });
    },
    // 分類列表點擊
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
    }
  },
  created() {
    this.getProducts();
  }
};
</script>

<style lang="scss" scoped>
.w-93 {
  width: 93%;
}

.sticky-top--fixNav {
  top: 6rem;
}

.card {
  box-shadow: 0 0.5rem 1rem rgba($dark, 0.2) !important;
}

.card-title {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
  z-index: 1;
}

.card-footer {
  border-top-color: rgba($primary, 0.2);
}
.card-img {
  height: 350px;
  background-size: cover;
  background-position: center;
  transform: translateY(-5px);
  z-index: -1;
}
.bg-img {
  background-image: linear-gradient(to bottom, $primary-bg, $light);
}

.img-fluid {
  width: auto;
  max-height: 50vh;
}
.modal-header {
  border: 0;
}
</style>
