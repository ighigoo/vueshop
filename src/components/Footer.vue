<template>
  <div>
    <footer
      class="container-fluid bg-primary-light d-flex flex-column justify-content-center align-items-center py-4 text-center"
    >
      <p>© Copright 2019 好喝飲料鋪</p>
      <p>練習作品無商業用途</p>
    </footer>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
p {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
