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

    <!-- 購物車 -->
    <div>
      <table class="table">
        <thead>
          <th></th>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
        </thead>
        <tbody>
          <tr></tr>
          <tr v-for="item in cart.carts" :key="item.id">
            <td class="align-middle">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="deleteCart(item.id)"
              >
                <i class="far fa-trash-alt"></i>
              </button>
            </td>
            <td class="align-middle">
              {{ item.product.title }}
              <div class="text-success" v-if="item.coupon">已套用優惠券</div>
            </td>
            <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
            <td class="align-middle text-right">{{ item.final_total | currency}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-right">總計</td>
            <td class="text-right">{{ cart.total | currency}}</td>
          </tr>
          <tr v-if="cart.total !== cart.final_total">
            <td colspan="3" class="text-right text-success">折扣價</td>
            <td class="text-right text-success">{{ cart.final_total | currency}}</td>
          </tr>
        </tfoot>
      </table>
      <!-- 未使用過優惠券才顯示輸入欄位 -->
      <div class="input-group mb-3 input-group-sm" v-if="cart.final_total === cart.total">
        <input
          type="text"
          class="form-control"
          placeholder="請輸入優惠碼"
          v-model="coupon_code"
          @click.enter="addCouponCode"
        >
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click.prevent="addCouponCode"
          >套用優惠碼</button>
        </div>
      </div>

      <!-- 訂購資訊 -->
      <h5 class="py-3 mt-5 mb-2 text-center bg-light">訂購人資訊</h5>
      <form id="needs-validation" novalidate @submit.prevent="CreateOrder">
        <!-- 姓名 -->
        <div class="form-row">
          <div class="form-group col-md-8 mx-auto">
            <label for="username">姓名</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid' : errors.has('name')}"
              id="username"
              placeholder="請輸入姓名"
              name="name"
              v-model="form.user.name"
              v-validate="'required'"
            >
            <span class="text-danger" v-if="errors.has('name')">請輸入姓名</span>
          </div>
          <!-- Email -->
          <div class="form-group col-md-8 mx-auto">
            <label for="email">Email</label>
            <input
              type="email"
              class="form-control"
              :class="{'is-invalid' : errors.has('email')}"
              id="email"
              placeholder="請輸入Email"
              name="email"
              v-model="form.user.email"
              v-validate="'required|email'"
            >
            <span class="text-danger" v-if="errors.has('email')">{{errors.first('email')}}</span>
          </div>
          <!-- 手機號碼 -->
          <div class="form-group col-md-8 mx-auto">
            <label for="tel">手機號碼</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid' : errors.has('tel')}"
              id="tel"
              placeholder="請輸入手機號碼"
              name="tel"
              v-model="form.user.tel"
              v-validate="'required|digits:10'"
            >
            <span class="text-danger" v-if="errors.has('tel')">請輸入手機號碼</span>
          </div>
          <div class="form-group col-md-8 mx-auto">
            <label for="address">地址</label>
            <input
              type="text"
              class="form-control"
              :class="{'is-invalid' : errors.has('address')}"
              id="address"
              placeholder="請輸入地址"
              name="address"
              v-model="form.user.address"
              v-validate="'required'"
            >
            <span class="text-danger" v-if="errors.has('address')">請輸入地址</span>
          </div>
        </div>
        <div class="text-right">
          <a href="shoppingCart.html" class="btn btn-secondary">繼續選購</a>
          <button type="submit" class="btn btn-primary">確認付款</button>
          <!-- <a href="shoppingCart-purchase.html" class="btn btn-primary">確認付款</a> -->
        </div>
      </form>
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
              <option value="0" disabled selected hidden>請選擇數量</option>

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
      products: [],
      product: {},
      cart: {},
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      status: {
        loadingItem: "", // 查看更多
        loadingCart: "", // 加入購物車( 主畫面 )
        loadingCartModal: "" // 加入購物車( 單一商品Modal )
      },
      isLoading: false,
      pagination: {},
      coupon_code: ""
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
        vm.product = response.data.product;
        vm.product.num = 0;
        $("#productModal").modal("show");
      });
    },
    // 加入購物車 id: 商品ID qty:數量 type:按鈕 0-主畫面 1-modal
    addtoCart(id, qty = 1, type = 0) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const apiJsonServer = `${process.env.JSONSERVERPATH}/carts`;
      console.log(apiJsonServer);
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
          const result = response.data.data;
          // 客制資料上傳
          const cartM = {
            cart_id: result.id,
            product_id: result.product_id,
            qty: result.qty,
            detail: {
              ice: 0,
              sweet: 0,
              size: 0,
              add: []
            }
          };
          this.$http.post(apiJsonServer, cartM).then(response => {});

          // 重新取得nav購物車資料
          vm.$bus.$emit("cartNav:reflash");
        }
      });
    },
    // 取得購物車列表
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.cart = response.data.data;
      });
    },
    // 刪除購物車商品
    deleteCart(id) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(api).then(response => {
        vm.isLoading = false;
        vm.getCart();
        console.log(response.data);
      });
    },
    // 加入優惠碼
    addCouponCode() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.coupon_code
      };
      this.$http.post(api, { data: coupon }).then(response => {
        if (response.data.success) {
          this.getCart();
        } else {
          console.log(response.data.message);
        }
      });
    },
    // 建立訂單
    CreateOrder() {
      const vm = this;
      const order = vm.form;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
      // 驗證
      this.$validator.validate().then(valid => {
        if (valid) {
          // 訂單API
          vm.isLoading = true;
          this.$http.post(api, { data: order }).then(response => {
            if (response.data.success) {
              console.log(response.data.message);
              this.getCart();
              vm.isLoading = false;
            } else {
              console.log(response.data.message);
            }
          });
        } else {
          console.log("請填寫訂購人資訊");
        }
      });
    }
  },
  created() {
    this.getProducts();
    this.getCart();
  }
};
</script>

<style>
</style>
