<template>
<div id="basic_source">
  <el-form ref="form" :model="form" label-width="80px" label-position="top">
    <el-form-item>
      <span class="bs-title">ReportID:</span>
      <span class="bs-title">{{ form.ReportID }}</span>
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="Reporter">
          <el-select v-model="form.Reporter" placeholder="Reporter" v-if="!uneditable">
            <el-option v-for="item in reporterOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="form.Reporter" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Disease">
          <el-select v-model="form.Disease" placeholder="Disease" v-if="!uneditable">
            <el-option v-for="item in diseaseOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="form.Disease" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="Country">
          <el-select v-model="form.Country" placeholder="Country" v-if="!uneditable">
            <el-option v-for="item in countryOptions" v-bind:label="item" v-bind:value="item"></el-option>
          </el-select>
          <el-input v-model="form.Country" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Document Category">
          <el-select v-model="form.DocumentCategory" placeholder="DocumentCategory" v-if="!uneditable">
            <el-option v-for="item in documentCategoryOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="form.DocumentCategory" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Journal">
          <el-input placeholder="Journal" v-model="form.Journal" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Title">
          <el-input placeholder="Title" v-model="form.Title" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Authors">
          <el-input placeholder="Authors" v-model="form.Authors" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Year of Pub">
          <el-input placeholder="Year of Pub" v-model="form.YearOfPub" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Volume">
          <el-input placeholder="Volume" v-model="form.Volume" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Issue">
          <el-input placeholder="Issue" v-model="form.Issue" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Page From">
          <el-input placeholder="Page From" v-model="form.PageFrom" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Page To">
          <el-input placeholder="Page To" v-model="form.PageTo" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="Author Contact Needed">
          <el-select v-model="form.AuthorContactNeeded" placeholder="Author Contact Needed" v-if="!uneditable">
            <el-option v-for="item in contactNeededOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="form.AuthorContactNeeded" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Open Access">
          <el-select v-model="form.OpenAccess" placeholder="Open Access" v-if="!uneditable">
            <el-option v-for="item in openAccessOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="form.OpenAccess" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Checked">
          <el-select v-model="form.Checked" placeholder="Checked" v-if="!uneditable">
            <el-option v-for="item in checkedOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input placeholder="Checked" v-model="form.Checked" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Note">
      <el-input type="textarea" :rows="2" placeholder="Note" v-model="form.Note1"
                :readonly="uneditable"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSave" v-show="editable">Save</el-button>
        <el-button @click="onNext" v-show="editable" :readonly="isModified">Next</el-button>
        <el-button @click="onAdd" v-show="editable">Add Report</el-button>
        <el-button @click="onDelete" v-show="editable" icon="delete">Delete</el-button>
      </el-button-group>
      <el-button-group id="basic-import-group">
        <el-button @click="onImport" v-show="editable" icon="upload2">Import</el-button>
      <el-button-group>
    </el-form-item>
  </el-form>

  <el-dialog :title="dialogMsg" v-model="dialogVisible" size="small">
    <i class="el-icon-information"></i>
    <span>此操作将无法撤销</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="danger" @click="deleteConfrim">删 除</el-button>
    </span>
  </el-dialog>

  <el-dialog id="basic-upload" title="Upload"
    v-model="dialogUploadVisible" size="small"
    :close-on-click-modal="false">
    <el-upload
        drag
        :action="uploadUrl"
        name="report"
        :show-file-list="showlist"
        :on-success="onUploadSuccess"
        :data="payload"
        mutiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只支持.xls/.xlsx格式</div>
    </el-upload>
  </el-dialog>
</div>
</template>

<script>
import detailData from '../static/detailData.js'
import api from '../model/api.js'
import util from '../model/util.js'
import checker from '../model/format-checker.js'
import config from '../config.js'

export default {
  name: 'app',
  props: ['tree', 'idPath', 'nodeID', 'buff'],
  data() {
    return {
      uploadUrl: '//' + config.baseURL + '/importtable',
      form: {
        ReportID: -1,  //  自动生成的随机值，从数据库获取
        Reporter: '',
        Disease: '',
        Country: '',
        DocumentCategory: '',
        Journal: '',
        Title: '',
        Authors: '',
        YearOfPub: '',
        Volume: null,
        Issue: null,
        PageFrom: null,
        PageTo: null,
        AuthorContactNeeded: '',
        OpenAccess: '',
        Checked: '',
        Note1: ''  //  note1
      },
      reporterOptions: detailData.basicDetail.reporterOptions,
      diseaseOptions: detailData.basicDetail.diseaseOptions,
      countryOptions: detailData.basicDetail.countryOptions,
      documentCategoryOptions: detailData.basicDetail.documentCategoryOptions,
      contactNeededOptions: ['No', 'Yes', 'Already'],
      openAccessOptions: ['No', 'Yes'],
      checkedOptions: ['No', 'Yes'],
      dialogVisible: false,
      //  upload dialog
      dialogUploadVisible: false,
      payload: null,
      showlist: false
    }
  },
  computed: {
    id: {
      get () {
        return this.$store.state.treeID
      },
      set (v) {
        this.$store.commit('updateTreeID', v)
      }
    },
    uneditable: function () {
      return this.$store.state.opt === 'view'
    },
    editable: function () {
      return this.$store.state.opt !== 'view'
    },
    dialogMsg: function () {
      return '确认删除Report ' + this.nodeID + '？'
    },
    isModified: function () {
      return false
    }
  },
  methods: {
    // upload
    onUploadSuccess (response, file, fileList) {
      // console.log(response)
      if (!response.success) {
        this.dialogUploadVisible = false
        this.$alert('上传失败', '解析Excel时发生错误', {
          confirmButtonText: '确定',
          callback: action => {}
        })
      } else {
        this.dialogUploadVisible = false
        this.$notify({
          title: '上传成功',
          message: '批量导入了一系列Survey',
          type: 'success'
        })
        this.$router.push('/home')
      }
      if (this.active++ > 4) this.active = 0
    },
    onNext () {
      api.checkModified(() => {
        api.getId('Survey Description')
          .then((res) => {
            var nextId = res.data.id
            var cur = this.tree.currentNode
            util.appendNode.call(this, cur, res.data.id, 'Survey')
          })
          .catch((err) => {
            this.$notify({
              title: '',
              message: '网络错误',
              type: 'warning'
            })
            // console.log(err)
          })
      }, 'Basic Sources', this)
    },
    onSave () {
      var msg = checker.checkForm(this.form, 'Basic Sources')
      if (msg !== '') {
        this.$notify({
          title: '警告',
          message: msg,
          type: 'warning'
        })
        return
      }
      api.add('Basic Sources', this.form, this)
    },
    onMenu () {
      this.$router.push('/home')
    },
    onDelete () {
      this.dialogVisible = true
    },
    onImport () {
      this.dialogUploadVisible = true
      this.payload = {
        type: 'Basic Sources',
        bid: this.idPath[0]
      }
    },
    deleteConfrim () {
      this.dialogVisible = false
      api.delete.call(this, this.nodeID, 'Basic Sources')
    },
    onAdd () {
      api.getId('Basic Sources')
        .then((res) => {
          var parent = this.tree.currentNode.$parent
          util.appendNode.call(this, parent, res.data.id, 'Report ID')
        })
        .catch((err) => {
          // console.log(err)
          this.$notify({
            title: '',
            message: '网络错误',
            type: 'warning'
          })
        })
    },
    removeTest () {
      var curNode = this.tree.currentNode.node
      curNode.store.remove(curNode.data)
    },
    initForm () {
      this.form = {
        ReportID: this.nodeID, Reporter: '', Disease: '', Country: '',
        DocumentCategory: '', Journal: '', Title: '', Authors: '',
        YearOfPub: '', Volume: '', Issue: '', PageFrom: '',
        PageTo: '', AuthorContactNeeded: '', OpenAccess: '', Checked: '',
        Note1: ''
      }
    },
    //  根据ReportID更新当前页面上的数据
    updateData () {
      if (this.buff.B[this.nodeID] !== undefined) {
        this.form = this.buff.B[this.nodeID]
      } else {
        //  从服务器取回数据
        api.getIdContent(this.nodeID, 'Basic Sources')
          .then((res) => {
            if (res.data.data == null) {
              this.initForm()
            } else {
              this.form = res.data.data
            }
          })
          .catch((err) => {
            this.initForm()
          })
      }
    }
  },
  created: function () {
    this.updateData()
  },
  beforeDestroy: function () {
    this.$emit('getBuffer', 'B', this.nodeID, this.form)
  },
  watch: {
    nodeID: function (val, oldVal) {
      this.$emit('getBuffer', 'B', oldVal, this.form)
      this.updateData()
    },
    form: {
      handler: function (val, oldVal) {
      },
      deep: true
    }
  }
}
</script>

<style>
body {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#basic-import-group {
  margin-left: 15px;
}

#basic-upload {
  text-align: center;
}

.bs-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
