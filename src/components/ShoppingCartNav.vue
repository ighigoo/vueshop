<template>
  <!-- 購物車內的數量 (Button 內包含 icon, 數量 badge) -->
  <div class="dropdown">
    <button class="btn btn-sm" data-toggle="dropdown" data-flip="false">
      <i class="fa fa-shopping-cart text-white fa-2x" aria-hidden="true"></i>
      <span class="badge badge-pill badge-danger">{{cartItemNum}}</span>
    </button>
    <div class="dropdown-menu dropdown-menu-right p-3" data-offset="600">
      <h6>已選擇商品</h6>
      <!-- 購物車 -->
      <table class="table">
        <thead>
          <th></th>
          <th>品名</th>
          <th class="text-nowrap">數量</th>
          <th class="text-nowrap">單價</th>
        </thead>
        <tbody>
          <tr v-if="cart.carts.length === 0">
            <td colspan="4" class="text-center">購物車尚無選購商品</td>
          </tr>
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
              {{ item.product.title }}
              ({{ detailSetting.size[item.detail.size] }})
              <span
                class="h6 text-danger font-detail"
              >
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
            <td class="text-right" v-if="cart.total">{{ cart.total | currency }}</td>
            <td class="text-right" v-else>0</td>
          </tr>
          <tr v-if="cart.total !== cart.final_total">
            <td colspan="3" class="text-right text-success">折扣價</td>
            <td class="text-right text-success">{{ cart.final_total | currency}}</td>
          </tr>
        </tfoot>
      </table>
      <router-link
        tag="button"
        class="btn btn-primary w-100 text-center text-light"
        to="/Shopping/Order"
      >結帳去</router-link>

      <!-- 未使用過優惠券才顯示輸入欄位 -->
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
  </div>
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      cart: {
        carts: []
      },

      detailSetting: {
        ice: ["正常冰", "少冰", "去冰"],
        sweet: ["正常糖", "少糖", "無糖"],
        size: ["M", "L"]
      },
      loadingItem: "false",

      coupon_code: ""
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
            if (detailItem) {
              this.$set(this.cart.carts[index], "detailId", detailItem.id);
              this.$set(this.cart.carts[index], "detail", detailItem.detail);
            }
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
          // vm.loadingItem = "";
          // 重新取得nav購物車資料
          // vm.$bus.$emit("cartNav:reflash");

          console.log(response.data);
        });
      });
    }
    // 加入優惠碼
    // addCouponCode() {
    //   const vm = this;
    //   const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
    //   const coupon = {
    //     code: vm.coupon_code
    //   };
    //   this.$http.post(api, { data: coupon }).then(response => {
    //     if (response.data.success) {
    //       vm.getCart();
    //     } else {
    //       console.log(response.data.message);
    //     }
    //   });
    // }
  },
  computed: {
    cartItemNum() {
      const vm = this;
      if (vm.cart.carts) {
        return vm.cart.carts.length;
      } else {
        return 0;
      }
    }
  },
  created() {
    const vm = this;

    vm.getCart();
    vm.$bus.$on("cartNav:reflash", () => {
      vm.getCart();
    });
  }
};

$(function() {
  // 避免點擊購物車dropdown關閉
  $(".dropdown-menu").on("click", function(event) {
    event.stopPropagation();
  });
});
</script>

<style lang="scss" scoped>
.btn .badge {
  position: relative;
  top: -16px;
  right: 10px;
}
.font-detail {
  font-size: 0.5rem;
}
.dropdown-menu {
  min-width: 500px;
}
@media screen and (max-width: 576px) {
  .dropdown-menu {
    min-width: 100vw;
    width: 300px;
    right: -3.5rem;
  }
}
</style>
