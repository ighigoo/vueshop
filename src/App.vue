<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    // api test
    // const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`;
    // this.$http.get(api).then(response => {
    //   console.log(response.data);
    // });
  }
};

// todo:
// 1. 圖片上傳 input 欄位清空
// 2. 503error
// 3  $set 複習

// 4.分頁(pagination)製作成元件
// 5.元件 套件 .js引用方式
</script>

<style lang="scss">
@import "./assets/all";
</style>

