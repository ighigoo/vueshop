<template>
  <div>
    <div class="row">
      <!--  order-md-2 order-sm-1 -->
      <div
        class="col-md-4 col-sm-9 mb-4 mx-auto mb-5"
        :class="[`order-md-${classRank.order.md[index]}`,
      `order-sm-${classRank.order.sm[index]}`]"
        v-for="(item,index) in products.slice(0,3)"
        :key="index"
      >
        <div class="rank">
          <!-- rank__box--first -->
          <div class="rank__box" :class="`rank__box--${classRank.rank.box.mod[index]}`">
            <i class="fas fa-crown rank__icon"></i>
          </div>
        </div>

        <div class="card border-0 box-shadow text-center h-100">
          <div class="rank"></div>
          <div
            class="card-title card-title--slide d-flex justify-content-center align-items-center w-auto h-10 px-3 py-1"
          >
            <h5 class="text-light font-weight-bold text-nowrap">{{item.title}}</h5>
          </div>
          <div class="card__img">
            <img class="card-img-top" :src="item.imageUrl" alt="Card image cap">
          </div>

          <div class="card-footer card-footer--slide btn-group w-100 h-20">
            <router-link
              tag="button"
              class="btn btn-secondary btn--slide w-50"
              to="/Shopping/Shopping_List"
            >查看更多</router-link>
            <button
              type="button"
              class="btn btn-primary-dark btn--slide d-block w-50"
              @click="addtoCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingCart"></i>
              <i class="fas fa-shopping-cart mr-1" v-else></i>
              來一杯
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO:
// 1.訂單列表>1頁時 getOrderList() 內的迴圈是否正常運作
// 2.如何判斷products & orderList 資料設定完成 後乎叫 countSaleNum()
// 3.countSaleNum() 中 saleNumArry 計算加總使用reduce 在 只有一筆資料的情況會出現錯誤, 故用 for迴圈

export default {
  data() {
    return {
      products: [], // 產品列表
      orderList: [], // 銷售列表
      isLoading: false,
      orderTotalPages: 0, // 訂單列表總頁數
      status: {
        loadingCart: "" // 加入購物車( 主畫面 )
      },
      // 判斷資料是否已經取得
      settingStatus: {
        products: false,
        orderList: false
      },
      classRank: {
        order: {
          // order-md-
          md: ["2", "1", "3"],
          // order-sm-
          sm: ["1", "2", "3"]
        },
        rank: {
          box: {
            //  rank__box--
            mod: ["first", "second", "third"]
          }
        }
      }
    };
  },
  methods: {
    // 取得產品列表
    getProducts() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/products/all`;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.filterProductsActive();
        vm.settingStatus.products = true;
      });
    },
    // 過濾啟用產品列表
    filterProductsActive() {
      const vm = this;
      vm.products = vm.products.filter(item => {
        return item.is_enabled === 1;
      });
    },

    // 取得訂單列表 - 僅取出產品部份
    getOrderList() {
      const vm = this;
      let totalPages = vm.orderTotalPages;
      let ajaxArry = [];
      // 取得列表每頁的get 請求
      for (let nowPage = 1; nowPage <= totalPages; nowPage++) {
        let api = `${process.env.APIPATH}/api/${
          process.env.CUSTOMPATH
        }/orders?page=${nowPage}`;
        let temp = vm.axios.get(api);
        ajaxArry.push(temp);
      }
      // 等所有請求完成再進行資料處理
      vm.axios.all(ajaxArry).then(
        vm.axios.spread((...res) => {
          const resList = Object.values(res).map(item => item.data);
          resList.forEach(item => {
            let resultOrderList = item.orders;
            // 列表中products物件 (裡面為各項商品)
            let resultProductsList = [];
            resultOrderList.forEach(item => {
              resultProductsList.push(item.products);
            });
            // 將物件中的商品轉換為array 存至 orderList
            resultProductsList.forEach(item => {
              let productList = Object.values(item).map(p => {
                let temp = {
                  productId: p.product_id,
                  qty: p.qty,
                  product: p.product
                };
                return temp;
              });
              vm.orderList = vm.orderList.concat(productList);
            });
          });
          vm.settingStatus.orderList = true;
        })
      );

      // for (let nowPage = 1; nowPage <= totalPages; nowPage++) {
      //   let api = `${process.env.APIPATH}/api/${
      //     process.env.CUSTOMPATH
      //   }/orders?page=${nowPage}`;
      //   this.$http.get(api).then(response => {
      //     // 訂單列表
      //     let resultOrderList = response.data.orders;
      //     // 列表中products物件 (裡面為各項商品)
      //     let resultProductsList = [];
      //     resultOrderList.forEach(item => {
      //       resultProductsList.push(item.products);
      //     });
      //     // 將物件中的商品轉換為array 存至 orderList
      //     resultProductsList.forEach(item => {
      //       let productList = Object.values(item).map(p => {
      //         let temp = {
      //           productId: p.product_id,
      //           qty: p.qty,
      //           product: p.product
      //         };
      //         return temp;
      //       });
      //       vm.orderList = vm.orderList.concat(productList);
      //     });
      //   });
      //   if (nowPage === totalPages) {
      //     vm.settingStatus.orderList = true;
      //   }
      // }
    },

    //取得訂單列比總頁數
    getOrderTotalPages() {
      const vm = this;
      let api = `${process.env.APIPATH}/api/${
        process.env.CUSTOMPATH
      }/orders?page=1`;
      this.$http.get(api).then(response => {
        vm.orderTotalPages = response.data.pagination.total_pages;
        return true;
      });
    },

    // 計算商品銷售總量
    countSaleNum() {
      const vm = this;
      vm.products.forEach((productItem, index) => {
        // 將單一商品 從銷售列表過濾出來
        let saleNumArry = vm.orderList.filter(orderItem => {
          return productItem.id === orderItem.productId;
        });
        // 計算商品銷售
        let saleTotalNum = 0;
        for (let i = 0; i < saleNumArry.length; i++) {
          saleTotalNum += saleNumArry[i].qty;
        }

        vm.$set(vm.products[index], "saleNum", saleTotalNum);
      });
    },

    // 商品列表銷售排序
    sortProducts() {
      const vm = this;
      vm.products.sort((a, b) => {
        return b.saleNum - a.saleNum;
      });

      // 測試用 顯示銷量
      // vm.products.forEach((item, index) => {
      //   console.log(`${index}: ${item.title} -  ${item.saleNum} 杯`);
      // });
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
      vm.status.loadingCart = id;

      const cart = {
        product_id: id,
        qty
      };

      this.$http.post(api, { data: cart }).then(response => {
        if (response.data.success) {
          vm.status.loadingCart = "";
          // 加入成功訊息
          const result = response.data.data;
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
          });
        }
      });
    }
  },
  created() {
    this.getOrderTotalPages();
  },
  watch: {
    orderTotalPages: {
      handler: function(val) {
        this.getProducts();
        this.getOrderList();
      },
      deep: true
    },
    settingStatus: {
      handler: function(val) {
        if (val.products && val.orderList) {
          // console.log(this.products, this.orderList);
          this.countSaleNum();
          this.sortProducts();
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.card {
  overflow: hidden;
  //card-title
  &-title {
    letter-spacing: 5px;
    background-color: rgba($dark, 0.2);
  }

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
    bottom: 0;
  }

  &__img {
    overflow: hidden;
    height: 100%;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
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
