<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="150">訂單編號</th>
          <th width="150">建立時間</th>
          <th width="120">是否付款</th>
          <th width="100">付款方式</th>
          <th width="100">留言</th>
          <th width="120">功能欄</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in orders" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.create_at}}</td>
          <td>
            <span class="text-success" v-if="item.is_paid">O</span>
            <span class="text-danger" v-else>X</span>
          </td>
          <td>{{item.payment_method}}</td>
          <td>{{item.message}}</td>
          <td>
            <button
              class="btn btn-outline-primary btn-sm"
              data-toggle="modal"
              data-target="#orderModal"
              @click="openModal(false,item)"
            >訂單內容</button>
            <button
              class="btn btn-outline-danger btn-sm"
              data-toggle="modal"
              data-target="#delOrderModal"
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
            @click.prevent="getOrders(pagination.current_page - 1)"
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
          <a class="page-link" href="#" @click.prevent="getOrders(page)">{{page}}</a>
        </li>
        <!-- 下一頁 -->
        <li class="page-item" :class="{ 'disabled': !pagination.has_next }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="getOrders(pagination.current_page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- orderModal 訂單內容-->
    <div
      class="modal fade"
      id="orderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="orderModalLabel">
              <span>訂單內容</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table">
              <thead>
                <th>商品代號</th>
                <th class="text-right">數量</th>
              </thead>
              <tbody>
                <tr v-for="item in tempOrder.products" :key="item.id">
                  <td>{{ item.product_id }}</td>
                  <td class="text-right">{{ item.qty }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="text-right">總計</td>
                  <td class="text-right">{{ tempOrder.total | currency}}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- orderModal 刪除-->
    <div
      class="modal fade"
      id="delOrderModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="delOrderModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="delOrderModalLabel">
              <span>刪除訂單</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempOrder.title }}</strong>
            訂單(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
    <!-- orderModal End-->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      orders: [],
      tempOrder: {},
      pagination: {},
      isNew: false,
      isLoading: false,
      status: {}
    };
  },
  methods: {
    getOrders(page = 1) {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/orders?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempOrder = {};
        this.isNew = true;
      } else {
        this.tempOrder = Object.assign({}, item);
        this.isNew = false;
      }
      $("#orderModal").modal("show");
    },
    openDelModal(item) {
      this.tempOrder = Object.assign({}, item);
      $("#delOrderModal").modal("show");
    },
    updateOrder() {
      const vm = this;
      let httpMethod = "post";
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/admin/order`;
      if (!vm.isNew) {
        // 編輯
        api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/admin/order/${vm.tempOrder.id}`;
        httpMethod = "put";
      }

      this.$http[httpMethod](api, { data: vm.tempOrder }).then(response => {
        if (response.data.success) {
          $("#orderModal").modal("hide");
          vm.getOrders();
        } else {
          $("#orderModal").modal("hide");
          vm.getOrders();
          console.log("新增失敗");
        }
      });
    }
  },
  created() {
    this.getOrders();
  }
};
</script>

<style>
</style>
