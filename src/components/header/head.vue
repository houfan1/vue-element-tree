<template>
  <div class="head">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#409eff"
      text-color="#fff"
      active-text-color="#fff"
      @select="handleSelect"
    >
      <el-menu-item index="/test" key="1">测试</el-menu-item>
    </el-menu>
  </div>
</template>


<script>
export default {
  data() {
    return {
      activeIndex: ""
    };
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key;
      this.$router.push(key);
    }
  },

};
</script>

<style lang="less" scope>
.head {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  background: #409eff;
  justify-content: center;
}
</style>