<template>
  <div>
    <!-- 轉盤icon -->
    <div
      class="icon btn btn-primary d-flex flex-column justify-content-center text-center text-light p-3"
      data-toggle="modal"
      data-target="#turntableModal"
    >
      <i class="fas fa-money-bill-wave fa-5x"></i>
      <h5 class="mt-1">優惠轉盤</h5>
    </div>
    <!-- 未使用過優惠券才顯示輸入欄位/轉盤 -->
    <!-- 轉盤 -->
    <!-- Modal -->
    <div
      class="modal fade"
      id="turntableModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="turntableModal"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-light" id="turntableModalLabel">優惠轉盤</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body d-flex justify-content-center bg-primary-bg">
            <TurnTable @getCoupon="getTurntableCoupon"></TurnTable>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="d-flex justify-content-center" v-if="cart.carts.length > 0">
      <TurnTable @getCoupon="getTurntableCoupon" v-if="cart.final_total === cart.total"></TurnTable>
    </div>-->
  </div>
</template>

<script>
import $ from "jquery";
import TurnTable from "./TurnTable";

export default {
  components: {
    TurnTable
  },
  data() {
    return {
      couponCode: ""
    };
  },

  methods: {
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

      setTimeout(function() {
        // 1.5s 後關閉轉盤
        $("#turntableModal").modal("hide");
        //修正轉盤消失後灰色區域還留在畫面上的問題
        $(".modal-backdrop").remove();
      }, 1500);
      this.$http.post(api, { data: coupon }).then(response => {
        if (response.data.success) {
          //   this.getCart();
          vm.$bus.$emit("cartOrder:reflash");
        } else {
          console.log(response.data.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 16px 0px;
  position: fixed;
  bottom: 15vh;
  right: 3rem;
  cursor: pointer;
}
</style>
