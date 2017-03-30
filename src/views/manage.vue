<template>
<div id="manage">
  <el-menu id="top-menu" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1"><i class="el-icon-menu"></i>Menu</el-menu-item>
    <el-menu-item index="2"><i class="el-icon-setting"></i>Work Bench</el-menu-item>
  </el-menu>
  <!-- <h1>Detail Page</h1> -->
  <div id="manage-page-container">
    <h1>This is management page.</h1>
  </div>
</div>
</template>

<script>
import api from '../model/api.js'

let id = 1000;

export default {
  data() {
    return {
      activeIndex: '2'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      if (key == 1) {  // menu
        this.$router.push('/home')
      }
    }
  }
}

</script>
