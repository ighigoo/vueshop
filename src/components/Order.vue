<template>
  <div>
    <div class="container main-contant py-5">
      <h1 class="text-center mb-3 text-secondary">結帳</h1>
      <!-- 進度 -->
      <section class="form-row align-items-center text-center">
        <div class="col">
          <div class="alert alert-success alert-rounded mb-0" role="alert">輸入訂單資料</div>
        </div>

        <div class="col">
          <div class="alert alert-secondary alert-rounded mb-0" role="alert">完成</div>
        </div>
      </section>
      <!-- 購物車 -->
      <section class="row justify-content-center mt-5">
        <div class="col-md-8">
          <!-- 總金額 -->
          <div class="card">
            <div class="card-header" id="headingOne">
              <h6 class="mb-0 d-flex align-items-center">
                <a data-toggle="collapse" href="#collapseOne">
                  顯示購物車細節
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </a>
                <span
                  class="h3 ml-auto mb-0 text-success"
                  v-if="cart.total !== cart.final_total"
                >{{ cart.final_total | currency}}</span>
                <span class="h3 ml-auto mb-0" v-else>{{ cart.total | currency}}</span>
              </h6>
            </div>
          </div>
          <!-- 購物車內容 -->
          <div id="collapseOne" class="collapse mt-3">
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
                      @click="deleteCart(item.id,item.detailId)"
                    >
                      <i class="fas fa-spinner fa-spin" v-if="item.id === loadingItem"></i>
                      <i class="far fa-trash-alt" v-else></i>
                    </button>
                  </td>
                  <td class="align-middle">
                    {{ item.product.title }} ({{ detailSetting.size[item.detail.size] }})
                    <!-- <span>{{ detailSetting[item.detail.ice] }}</span> -->
                    <span class="h6 text-danger font-detail">
                      {{ detailSetting.ice[item.detail.ice] }} ,
                      {{ detailSetting.sweet[item.detail.sweet] }}
                    </span>

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
            <!-- 未使用過優惠券才顯示輸入欄位/轉盤 -->
            <!-- 轉盤 -->
            <div class="d-flex justify-content-center">
              <TurnTable @getCoupon="getTurntableCoupon" v-if="cart.final_total === cart.total"></TurnTable>
            </div>
            <!-- <div class="input-group mb-3 input-group-sm" v-if="cart.final_total === cart.total">
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
            </div>-->
          </div>
          <h5 class="py-3 mt-5 mb-2 text-center bg-light">訂購人資訊</h5>
          <!-- 訂購表單 -->
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
            <div class="text-center mt-3">
              <router-link class="btn btn-secondary" to="/Shopping/Shopping_List">繼續選購</router-link>
              <button type="submit" class="btn btn-primary">確認付款</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// TODO:

import $ from "jquery";
import TurnTable from "./TurnTable";
export default {
  components: {
    TurnTable
  },
  data() {
    return {
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

      loadingItem: "",
      couponCode: "",
      detailSetting: {
        ice: ["正常冰", "少冰", "去冰"],
        sweet: ["正常糖", "少糖", "無糖"],
        size: ["M", "L"]
      }
    };
  },
  methods: {
    // 取得購物車列表
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const apiDetail = `${process.env.DETAILAPIPATH}/carts`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.cart = response.data.data;

        // get detail
        this.$http.get(apiDetail).then(response => {
          const detailCarts = response.data; // detail array
          // vm.cart 跑foreach 和 detail 比對cart_id
          vm.cart.carts.forEach((cartItem, index) => {
            let detailItem = detailCarts.find(item => {
              return item.cart_id === cartItem.id;
            });

            // 比對成功將detailId和detail{}加入cart.carts
            this.$set(this.cart.carts[index], "detailId", detailItem.id);
            this.$set(this.cart.carts[index], "detail", detailItem.detail);
            vm.isLoading = false;
          });
        });
      });
    },
    // 刪除購物車商品
    deleteCart(id, detailId) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/cart/${id}`;

      // 傳入參數增加detailId
      const apiDetail = `${process.env.DETAILAPIPATH}/carts/${detailId} `;

      vm.loadingItem = id;
      this.$http.delete(api).then(response => {
        //刪除detail
        this.$http.delete(apiDetail).then(response => {
          vm.getCart();
          // 重新取得nav購物車資料
          vm.$bus.$emit("cartNav:reflash");
          //console.log(response.data);
        });
      });
    },
    // 取得轉盤優惠碼
    getTurntableCoupon(couponCode) {
      this.couponCode = couponCode;
      this.addCouponCode();
    },
    // 加入優惠碼
    addCouponCode() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
      const coupon = {
        code: vm.couponCode
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
    this.getCart();
  }
};
</script>

<style>
.font-detail {
  font-size: 0.5rem;
}
</style>
