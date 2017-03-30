<template>
<div id="intervention">
  <el-form ref="form" :model="form" label-width="80px" label-position="top">
    <el-form-item>
      <span class="bs-title">InterventionID:</span>
      <span class="bs-title">{{ form.InterventionID }}</span>
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="Group">
          <el-select v-model="form.Group" placeholder="Group" :readonly="uneditable" v-if="!uneditable">
            <el-option v-for="item in groupOptions" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="form.Group" :readonly="uneditable" v-else></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="Months">
          <el-input v-model="form.MonthsAfterBaseline" :readonly="uneditable"
                    placeholder="Months after baseline"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Drug">
          <el-input placeholder="Drug" v-model="form.Drug" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Frequency">
          <el-input placeholder="Frequency" v-model="form.FrequencyPerYear" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="Period">
          <el-input placeholder="Period" v-model="form.PeriodMonths" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Coverage">
          <el-input placeholder="Coverage" v-model="form.Coverage" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-form-item label="Other Method">
        <el-input placeholder="Other Method" v-model="form.OtherMethod" :readonly="uneditable"></el-input>
      </el-form-item>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="Num Examine">
          <el-input placeholder="Num_examine" v-model="form.INumExamine" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Num Positive">
          <el-input placeholder="Num_positive" v-model="form.INumPositive" :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Percent Positive">
          <el-input placeholder="Percent_positive" :readonly="uneditable"
                    v-model="form.IPercentPositive"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="Num Examine Male">
          <el-input placeholder="Num_examine_male" v-model="form.INumExamineMale"
                    :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Num Positive Male">
          <el-input placeholder="Num_positive_male" v-model="form.INumPositiveMale"
                    :readonly="uneditable"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Percent Positive Male">
          <el-input placeholder="Percent_positive_male" :readonly="uneditable"
                    v-model="form.IPercentPositiveMale"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form-item label="Num Examine Female">
          <el-input placeholder="Num_examine_female" :readonly="uneditable"
                    v-model="form.INumExamineFemale"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Num Positive Female">
          <el-input placeholder="Num_positive_female" :readonly="uneditable"
                    v-model="form.INumPositiveFemale"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="Percent Positive Female">
          <el-input placeholder="Percent_positive_female" :readonly="uneditable"
                    v-model="form.IPercentPositiveFemale"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Note">
      <el-input v-model="form.Note5" type="textarea" :readonly="uneditable" placeholder="Note"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSave" v-show="editable">Save</el-button>
        <el-button @click="onAdd" v-show="editable">Add Intervention</el-button>
        <el-button @click="onCancel" v-show="editable">Cancel</el-button>
        <el-button @click="onDelete" v-show="editable" icon="delete">Delete</el-button>
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
</div>
</template>

<script>
import detailData from '../static/detailData.js'
import api from '../model/api.js'
import util from '../model/util.js'
import checker from '../model/format-checker.js'

export default {
  name: 'app',
  props: ['tree', 'idPath', 'nodeID', 'buff'],
  data() {
    return {
      form: {
        InterventionID: -1,
        Group: '',
        MonthsAfterBaseline: '',
        Drug: '',
        FrequencyPerYear: '',
        PeriodMonths: '',
        Coverage: '',
        OtherMethod: '',
        INumExamine: '',
        INumPositive: '',
        IPercentPositive: '',
        INumExamineMale: '',
        INumPositiveMale: '',
        IPercentPositiveMale: '',
        INumExamineFemale: '',
        INumPositiveFemale: '',
        IPercentPositiveFemale: '',
        Note5: '',
        DiseaseDataDiseaseID: -1,
        DiseaseDataLocationInformationLocationID1: -1,
        DiseaseDataLReportID: -1,
        DiseaseDataLocationInformationSurveyDescriptionSurveyID: -1
      },
      groupOptions: detailData.interventionDetail.groupOptions,
      dialogVisible: false
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
      return '确认删除Intervention ' + this.nodeID + '？'
    }
  },
  methods: {
    onSave() {
      var msg = checker.checkForm(this.form, 'Intervention Data')
      if (msg !== '') {
        this.$notify({
          title: '警告',
          message: msg,
          type: 'warning'
        })
        return
      }
      api.add('Intervention Data', this.form, this)
    },
    onMenu() {
      this.$router.push('/home')
    },
    onCancel() {
      util.deleteNode(this.tree.currentNode)
    },
    onAdd() {
      api.getId('Intervention Data')
        .then((res) => {
          var parent = this.tree.currentNode.$parent
          util.appendNode.call(this, parent, res.data.id, 'Intervention')
        })
        .catch((err) => {
          this.$notify({
            title: '',
            message: '网络错误',
            type: 'warning'
          })
        })
    },
    onDelete() {
      this.dialogVisible = true
    },
    deleteConfrim() {
      this.dialogVisible = false
      api.delete.call(this, this.nodeID, 'Intervention Data')
    },
    initForm() {
      this.form = {
        InterventionID: this.idPath[4],
        Group: '', MonthsAfterBaseline: '', Drug: '',
        FrequencyPerYear: '', PeriodMonths: '', Coverage: '',
        OtherMethod: '', Note5: '',
        INumExamine: '', INumPositive: '', IPercentPositive: '',
        INumExamineMale: '', INumPositiveMale: '', IPercentPositiveMale: '',
        INumExamineFemale: '', INumPositiveFemale: '', IPercentPositiveFemale: '',
        DiseaseDataDiseaseID: this.idPath[3],
        DiseaseDataLocationInformationLocationID1: this.idPath[2],
        DiseaseDataLReportID: this.idPath[0],
        DiseaseDataLocationInformationSurveyDescriptionSurveyID: this.idPath[1]
      }
    },
    updateData() {
      if (this.buff.I[this.nodeID] !== undefined) {
        this.form = this.buff.I[this.nodeID]
      } else {
        api.getIdContent(this.nodeID, 'Intervention Data')
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
    this.$emit('getBuffer', 'I', this.nodeID, this.form)
  },
  watch: {
    nodeID: function(val, oldVal) {
      this.$emit('getBuffer', 'I', oldVal, this.form)
      this.updateData()
    }
  }
}
</script>
