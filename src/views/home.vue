<template>
<div id="home">
  <el-menu id="top-menu" :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1"><i class="el-icon-menu"></i>Menu</el-menu-item>
    <el-menu-item index="2"><i class="el-icon-setting"></i>Work Bench</el-menu-item>
    <el-menu-item index="3"><i class="el-icon-close"></i>Log Out</el-menu-item>
  </el-menu>
  <div id="page-container">
    <h1>{{ helloMsg }}</h1>
    <el-row id="input_row" :gutter="10">
      <el-col v-bind:span="4">
        <el-input placeholder="Report ID" v-model="conditions.searchID"></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="conditions.dValue" placeholder="Disease" clearable>
          <el-option v-for="item in diseaseOptions" v-bind:label="item" v-bind:value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="conditions.cValue" placeholder="Country" clearable>
          <el-option v-for="item in countryOptions" v-bind:label="item" v-bind:value="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker v-model="conditions.yValue" align="right" type="year" placeholder="Year">
        </el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-select v-model="conditions.doubleClick" placeholder="Double Click" clearable>
          <el-option v-for="item in clickOptions" v-bind:label="item" v-bind:value="item"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row id="buttons" type="flex" justify="end" :gutter="10">
      <el-col :span="20" class="btn-container">
        <el-button-group>
          <el-button @click="onSearch" icon="search">Search</el-button>
          <el-button @click="onBatchExport" icon="share">Export</el-button>
          <el-button @click="onBatchInput" icon="upload2" v-show="canEdit">Batch Input</el-button>
          <el-button @click="onView" icon="view">View</el-button>
          <el-button @click="onEdit" icon="edit" v-show="canEdit">Edit</el-button>
          <el-button @click="onDelete" icon="delete" v-show="canEdit">Delete</el-button>
          <el-button type="primary" @click="onNew" icon="plus" v-show="canEdit">New</el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <el-table id="result-table" :data="tableData" highlight-current-row align="center" height="350"
      @current-change="handleCurrentChange" @row-dblclick="doubleClickEvent"
      style="width: 100%" @selection-change="handleSelectionChange"
      :default-sort = "{ prop: 'id', order: 'descending' }"
      v-loading="isLoading" element-loading-text="Searching">
      <el-table-column type="selection" width="55" sortable></el-table-column>
      <el-table-column property="id" label="id" width="90" sortable></el-table-column>
      <el-table-column property="title" label="Title" width="200" sortable></el-table-column>
      <el-table-column property="author" label="Author" width="200" sortable></el-table-column>
      <el-table-column property="disease" label="Disease" width="200" sortable></el-table-column>
      <el-table-column property="reporter" label="Reporter" width="160" sortable></el-table-column>
      <el-table-column property="time" label="Year of publish" sortable></el-table-column>
    </el-table>
  </div>
  <el-dialog id="dialog" :title="dialogTitle"
    v-model="dialogUploadVisible" size="small"
    :close-on-click-modal="false"
    @close="onCloseDialog">
    <el-upload
        v-show="canUpload"
        class="upload-demo" drag
        :action="importUrl"
        name="report"
        :show-file-list="showlist"
        :on-success="onUploadSuccess"
        :data="payload"
        mutiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">{{ uploadHint }}</div>
    </el-upload>
    <div v-show="!canUpload">{{ uploadHint }}</div>
    <div id="upload-steps">
      <el-steps :space="110" :active="active" finish-status="success" :center="center">
        <el-step title="Step 1"></el-step>
        <el-step title="Step 2"></el-step>
        <el-step title="Step 3" ></el-step>
        <el-step title="Step 4"></el-step>
        <el-step title="Step 5"></el-step>
      </el-steps>
    </div>
    <div>
      <el-button id="download-demo" @click="downloadDemo" icon="arrow-down" type="primary">Get Demo</el-button>
    </div>
  </el-dialog>
  <!--  用于为用户提供下载文档功能  -->
  <a id="getexcel" href=""></a>
  <a id="getdemo" href=""></a>
</div>
</template>

<script>
import detailData from '../static/detailData.js'
import api from '../model/api.js'
import config from '../config.js'

export default {
  name: 'home',
  data() {
    return {
      //  download url
      //  //172.18.215.237:3000/importexcel
      importUrl: '//' + config.baseURL + '/importexcel',
      //  search conditions
      conditions: {
        searchID: null,
        dValue: '',
        cValue: '',
        yValue: '',
        doubleClick: ''
      },
      //  options
      diseaseOptions: detailData.basicDetail.diseaseOptions,
      countryOptions: detailData.basicDetail.countryOptions,
      clickOptions: ['Yes', 'No'],
      // table
      tableData: [],
      currentRow: null,
      isLoading: false,
      resultMultipleSelection: [],
      // dialog
      dialogUploadVisible: false,
      // upload
      showlist: false,
      // steps
      active: 0,
      center: true,
      hints: [ 'Basic Sources', 'Survey', 'Location', 'Disease', 'Intervention' ],
      //  导航菜单
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  computed: {
    helloMsg: function() {
      return 'Hello, ' + this.$store.state.userInfo.username
    },
    opt: {
      get() { return this.$store.state.opt },
      set(v) { this.$store.commit('updateOpt', v) }
    },
    editID: {
      get() { return this.$store.state.editID },
      set(v) { this.$store.commit('updateEditID', v) }
    },
    viewID: {
      get() { return this.$store.state.viewID },
      set(v) { this.$store.commit('updateViewID', v) }
    },
    dialogTitle: function() {
      if (this.active >= 5) {
        return 'Done~'
      }
      return 'Please Upload ' + this.hints[this.active]
    },
    uploadHint: function() {
      if (this.active >= 5) {
        return 'You can close this dialog now'
      }
      return this.hints[this.active] + ' file needed, .xls/.xlsx support only'
    },
    canUpload: function() {
      return this.active < 5
    },
    payload: function() {
      return { id: this.active }
    },
    canEdit: function() {
      return this.$store.state.userInfo.authority <= 3
    }
  },
  methods: {
    //  顶部导航菜单
    handleSelect (key, keyPath) {
      if (key == 1) {  // menu
        this.$router.push('/home')
      } else if (key == 2) {
        this.$router.push('/manage')
      } else if (key == 3) {
        this.conditions = {
          searchID: null,
          dValue: '',
          cValue: '',
          yValue: '',
          doubleClick: ''
        }
        this.tableData = []
        this.$router.push('/login')
      }
    },
    isEmpty (ele) {
      return ele === undefined || ele === null || ele === ''
    },
    // dialog
    onCloseDialog () {
      this.onSearch()
    },
    // upload
    onUploadSuccess (response, file, fileList) {
      // console.log(response)
      if (!response.success) {
        this.dialogUploadVisible = false
        this.$alert('上传失败', '解析Excel时发生错误', {
          confirmButtonText: '确定',
          callback: action => {}
        })
      }
      if (this.active++ > 4) {
        this.active = 0
      }
    },
    // table
    doubleClickEvent(row, e) {
      this.onView()
    },
    handleCurrentChange (val) {  //  记录当前选中的行
      this.currentRow = val
    },
    handleSelectionChange (val) {  //  记录当前选中的所有行(多选)
      this.resultMultipleSelection = val
    },
    onBatchInput () {
      this.active = 0
      this.dialogUploadVisible = true
    },
    onBatchExport () {
      var ids = []
      for (let i in this.resultMultipleSelection) {
        ids.push(this.resultMultipleSelection[i].id)
      }
      if (ids.length === 0) {
        this.$alert('请在左侧框框中勾选您需要导出的条目', '未选中任何条目', {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return
      }
      var url = 'http://' + config.baseURL + '/exportexcel?'
      // var url = 'http://' + this.$store.state.baseHost + ':3000/exportexcel?'
      for (let i in ids) {
        url += 'id' + i + '=' + ids[i]
        if (i != ids.length - 1) {
          url += '&'
        }
      }
      var x = document.getElementById("getexcel")
      x.href = url
      x.click()
    },
    onView () {
      if (this.currentRow == null) {
        this.$alert('请选中需要查看的条目', '未选中任何条目',
          { confirmButtonText: '确定', callback: action => {} });
      } else {
        this.opt = 'view'
        this.viewID = this.currentRow.id
        this.$router.push('/detail')
      }
    },
    onEdit () {
      if (this.currentRow == null) {
        this.$alert('请选中需要编辑的条目', '未选中任何条目', {
          confirmButtonText: '确定',
          callback: action => {
            //  do nothing
          }
        })
      } else {
        this.opt = 'edit'
        this.editID = this.currentRow.id
        this.$router.push('/detail')
      }
    },
    onDelete () {
      var ids = []
      var confirmDeleteReports = ''
      for (let i in this.resultMultipleSelection) {
        ids.push(this.resultMultipleSelection[i].id)
        confirmDeleteReports += this.resultMultipleSelection[i].id + ' '
      }
      if (ids.length === 0) {
        this.$alert('请在左侧框框中勾选您需要删除的条目', '未选中任何条目', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        })
        return
      }

      this.$confirm('即将删除Report:  ' + confirmDeleteReports + ', 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i in ids) {
            api.delete.call(this, ids[i], 'Basic Sources')
          }
          this.onSearch()
        }).catch(() => {
          //  donothing
        })
    },
    onNew() {
      this.opt = 'new'
      this.$router.push('/detail')
    },
    onSearch() {
      if (this.isEmpty(this.conditions.searchID) && this.isEmpty(this.conditions.dValue) &&
          this.isEmpty(this.conditions.cValue) && this.isEmpty(this.conditions.yValue) &&
          this.isEmpty(this.conditions.doubleClick)) {
        api.queryAll(this.authority, this)
        return
      }
      var that = this
      that.isLoading = true
      var yearArr = String(this.conditions.yValue).split(' ')
      api.query(this.conditions.searchID, {
        disease: this.conditions.dValue == '' ? null : this.conditions.dValue,
        country: this.conditions.cValue == '' ? null : this.conditions.cValue,
        year: this.conditions.yValue == '' ? null : parseInt(yearArr[3]),
        doubleClick: this.conditions.doubleClick == '' ? null : (this.conditions.doubleClick == 'Yes' ? 'Yes' : 'No')
      }, this.$store.state.userInfo.authority, that)
    },
    downloadDemo () {
      var url = 'http://' + config.baseURL + '/exportdemo'
      var x = document.getElementById("getdemo")
      x.href = url
      x.click()
    }
  },
  created: function() {
    if (this.$store.state.homeTableBuff !== null) {
      this.tableData = this.$store.state.homeTableBuff
      this.conditions.searchID = this.$store.state.homeConditionsBuff.searchID
      this.conditions.dValue = this.$store.state.homeConditionsBuff.dValue
      this.conditions.cValue = this.$store.state.homeConditionsBuff.cValue
      this.conditions.yValue = this.$store.state.homeConditionsBuff.yValue
      this.conditions.doubleClick = this.$store.state.homeConditionsBuff.doubleClick
    }
    this.onSearch()
  },
  beforeDestroy: function() {
    this.$store.commit('updateHomeTableBuff', this.tableData)
    this.$store.commit('updateHomeConditionsBuff', this.conditions)
  },
}
</script>

<style>
#buttons {
  margin-top: 10px;
  margin-bottom: 10px;
}

#page-container {
  position: relative;
  top: 20px;
  padding: 5px;
  border: solid;
  border-width: 1px;
  border-radius: 4px;
}

#dialog {
  user-select: none;
}

#result-table {
  user-select: none;
}

#upload-steps {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
}

.btn-container {
  text-align: right;
}

#download-demo {
  margin-top: 15px;
}
</style>
