<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <a href="#" class="btn btn-primary" @click="openModal(true)">建立新優惠券</a>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="150">優惠券名稱</th>
          <th width="150">優惠券代碼</th>
          <th width="120">折價百分比(%)</th>
          <th width="100">到期日</th>
          <th width="100">啟用狀態</th>
          <th width="120">功能欄</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.code}}</td>
          <td>{{item.percent}}</td>
          <td>{{item.due_date}}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled==1">已啟用</span>
            <span class="text-danger" v-else>未啟用</span>
          </td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              data-toggle="modal"
              data-target="#couponModal"
              @click="openModal(false,item)"
            >編輯</button>
            <button
              class="btn btn-outline-danger btn-sm"
              data-toggle="modal"
              data-target="#delCouponModal"
              @click="openDelModal(item)"
            >刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav
      aria-label="Page navigation example"
      class="d-flex justify-content-center"
      v-if="pagination.total_pages>=0"
    >
      <ul class="pagination">
        <!-- 前一頁 -->
        <li class="page-item" :class="{ 'disabled': !pagination.has_pre }">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="getCoupons(pagination.current_page - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <!-- 頁碼 -->
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{ 'active': pagination.current_page === page}"
        >
          <a class="page-link" href="#" @click.prevent="getCoupons(page)">{{page}}</a>
        </li>
        <!-- 下一頁 -->
        <li class="page-item" :class="{ 'disabled': !pagination.has_next }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="getCoupons(pagination.current_page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- couponModal 新增-->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="couponModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">優惠券名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入優惠券名稱"
                    v-model="tempCoupon.title"
                  >
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">優惠券代碼</label>
                    <input
                      type="text"
                      class="form-control"
                      id="code"
                      placeholder="請輸入優惠券代碼"
                      v-model="tempCoupon.code"
                    >
                  </div>
                  <div class="form-group col-md-6">
                    <label for="percent">折價百分比</label>
                    <input
                      type="unit"
                      class="form-control"
                      id="percent"
                      placeholder="請輸入折價百分比"
                      v-model="tempCoupon.percent"
                    >
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="due-date">到期日</label>
                    <input
                      type="date"
                      class="form-control"
                      id="due-date"
                      placeholder="請輸入到期日"
                      v-model="tempCoupon.due_date"
                    >
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="tempCoupon.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    >
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- couponModal 刪除-->
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="delCouponModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="delCouponModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong>
            優惠券(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="delCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
    <!-- couponModal End-->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      pagination: {},
      isNew: false,
      isLoading: false,
      status: {}
    };
  },
  methods: {
    getCoupons(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupons?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
      }
      $("#couponModal").modal("show");
    },
    openDelModal(item) {
      this.tempCoupon = Object.assign({}, item);
      $("#delCouponModal").modal("show");
    },
    updateCoupon() {
      const vm = this;
      let httpMethod = "post";
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon`;
      if (!vm.isNew) {
        // 編輯
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = "put";
      }

      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons();
        } else {
          $("#couponModal").modal("hide");
          vm.getCoupons();
          console.log("新增失敗");
        }
      });
    },
    delCoupon() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/coupon/${vm.tempCoupon.id}`;
      this.$http.delete(api).then(response => {
        if (response.data.success) {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
          console.log(response.data.message);
        }
      });
    }
  },
  created() {
    this.getCoupons();
  }
};
</script>

<style>
</style>
