<template>
  <div class="home">
    <head-box></head-box>

    <div class="main"><router-view /></div>
  
  </div>
</template>

<script>
import HeadBox from "./header/head";


export default {
  components: {
    HeadBox,

  }
};
</script>
<style  lang="less" scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .main {
    flex: auto;
    margin-top: 60px;
  }
}
</style>
