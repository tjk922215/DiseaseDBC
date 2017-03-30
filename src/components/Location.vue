<template>
<div id="location">
  <el-form ref="form" :model="form" label-width="80px" label-position="top">
    <el-form-item>
      <span class="bs-title">LocationID:</span>
      <span class="bs-title">{{ form.LocationID }}</span>
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="ADM1">
          <el-input placeholder="ADM1" v-model="form.ADM1" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="ADM2">
          <el-input placeholder="ADM2" v-model="form.ADM2" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="ADM3">
          <el-input placeholder="ADM3" v-model="form.ADM3" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="PointName">
          <el-input placeholder="Point Name" v-model="form.PointName" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="PointType">
          <el-select v-model="form.PointType" placeholder="Point Type" :readonly="uneditable" v-if="!uneditable">
            <el-option v-for="item in pointTypeOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input placeholder="Point Type" v-model="form.PointType" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="GeoRef">
          <el-select v-model="form.GeoReferenceSources" placeholder="Point Type" :readonly="uneditable" v-if="!uneditable">
            <el-option v-for="item in grSourceOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input placeholder="Geo Reference Sources" v-model="form.GeoReferenceSources" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Latitude">
          <el-input placeholder="Latitude" v-model="form.Latitude" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Longitude">
          <el-input placeholder="Longitude" v-model="form.Longitude" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="note3">
      <el-input placeholder="Note" v-model="form.Note3" type="textarea" :readonly="uneditable"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSave" v-show="editable">Save</el-button>
        <el-button @click="onNext" v-show="editable">Next</el-button>
        <el-button @click="onAdd" v-show="editable">Add Location</el-button>
        <el-button @click="onCancel" v-show="editable">Cancel</el-button>
        <el-button @click="onDelete" v-show="editable" icon="delete">Delete</el-button>
      </el-button-group>
      <el-button-group id="location-import-group">
        <el-button @click="onImport" v-show="editable">Import</el-button>
      </el-button-group>
    </el-form-item>
  </el-form>

  <el-dialog :title="dialogMsg" v-model="dialogVisible" size="small">
    <span>此操作将无法撤销</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="danger" @click="deleteConfrim">删 除</el-button>
    </span>
  </el-dialog>

  <el-dialog id="location-upload" title="Upload"
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
        LocationID: -1,
        SurveyDescriptionBasicSourcesReportID: -1,
        SurveyDescriptionSurveyID: -1,
        ADM1: '',
        ADM2: '',
        ADM3: '',
        PointName: '',
        PointType: '',
        Latitude: '',
        Longitude: '',
        GeoReferenceSources: '',
        Note3: ''
      },
      grSourceOptions: detailData.locationDetail.grSourceOptions,
      pointTypeOptions: detailData.locationDetail.pointTypeOptions,
      dialogVisible: false,
      //  upload dialog
      dialogUploadVisible: false,
      payload: null,
      showlist: false
    }
  },
  computed: {
    id: {
      get() {
        return this.$store.state.treeID
      },
      set(v) {
        this.$store.commit('updateTreeID', v)
      }
    },
    uneditable: function() {
      return this.$store.state.opt === 'view'
    },
    editable: function() {
      return this.$store.state.opt !== 'view'
    },
    dialogMsg: function() {
      return '确认删除Location ' + this.nodeID + '？'
    }
  },
  methods: {
    // upload
    onUploadSuccess (response, file, fileList) {
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
          message: '批量导入了一系列Disease',
          type: 'success'
        })
        this.$router.push('/home')
      }
      if (this.active++ > 4) this.active = 0
    },
    onNext() {
      api.checkModified(() => {
        api.getId('Disease Data')
          .then((res) => {
            var cur = this.tree.currentNode
            util.appendNode.call(this, cur, res.data.id, 'Disease')
          })
          .catch((err) => {
            this.$notify({
              title: '',
              message: '网络错误',
              type: 'warning'
            })
          })
      }, 'Location Information', this)
    },
    onSave() {
      var msg = checker.checkForm(this.form, 'Location Information')
      if (msg !== '') {
        this.$notify({
          title: '警告',
          message: msg,
          type: 'warning'
        })
        return
      }
      api.add('Location Information', this.form, this)
    },
    onMenu() {
      this.$router.push('/home')
    },
    onCancel() {
      util.deleteNode(this.tree.currentNode)
    },
    onDelete() {
      this.dialogVisible = true
    },
    onImport () {
      this.dialogUploadVisible = true
      this.payload = {
        type: 'Location Information',
        bid: this.idPath[0],
        sid: this.idPath[1],
        lid: this.idPath[2]
      }
    },
    deleteConfrim() {
      this.dialogVisible = false
      api.delete.call(this, this.nodeID, 'Location Information')
    },
    onAdd() {
      api.getId('Location Information')
        .then((res) => {
          var parent = this.tree.currentNode.$parent
          util.appendNode.call(this, parent, res.data.id, 'Location')
        })
        .catch((err) => {
          this.$notify({
            title: '',
            message: '网络错误',
            type: 'warning'
          })
        })
    },
    initForm() {
      this.form = {
        LocationID: this.idPath[2],
        SurveyDescriptionBasicSourcesReportID: this.idPath[0],
        SurveyDescriptionSurveyID: this.idPath[1],
        ADM1: '',
        ADM2: '',
        ADM3: '',
        PointName: '',
        PointType: '',
        Latitude: '',
        Longitude: '',
        GeoReferenceSources: '',
        Note3: ''
      }
    },
    updateData() {
      if (this.buff.L[this.nodeID] !== undefined) {
        this.form = this.buff.L[this.nodeID]
      } else {
        api.getIdContent(this.nodeID, 'Location Information')
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
  created: function() {
    this.updateData()
  },
  beforeDestroy: function() {
    this.$emit('getBuffer', 'L', this.nodeID, this.form)
  },
  watch: {
    nodeID: function(val, oldVal) {
      this.$emit('getBuffer', 'L', oldVal, this.form)
      this.updateData()
    }
  }
}
</script>

<style>
#location-upload {
  text-align: center;
}
#location-import-group {
  margin-left: 15px;
}
</style>
