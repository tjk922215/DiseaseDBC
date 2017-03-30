import axios from 'axios'
import md5 from 'md5'

import util from './util'

//  为form中的属性值前后加上单引号，不会改变原有的表格值
function addQuote (form, ex) {
  var newObj = {}
  for (let i in form) {
    if (ex !== undefined && !ex.includes(i)) {
      if (form[i] !== null && form[i] !== undefined) {
        newObj[i] = '\'' + form[i] + '\''
      }
    } else {
      newObj[i] = form[i]
    }
  }
  return newObj
}

function empty2Null (form) {
  var newObj = {}
  for (let i in form) {
    newObj[i] = form[i] === '' || form[i] === null || form[i] === '\'\'' ? 'null' : form[i]
  }
  return newObj
}

//  依照type对data中的属性值前后加上单引号，若为数字或者null则不进行处理
function getHandledData (type, data) {
  var ex = {
    basicSources: ['ReportID', 'YearOfPub', 'Volume', 'Issue', 'PageFrom', 'PageTo'],
    survey: ['SurveyID', 'BasicSources_ReportID'],
    location: [
      'LocationID', 'SurveyDescription_BasicSources_ReportID',
      'SurveyDescription_SurveyID', 'Latitude', 'Longitude'
    ],
    disease: [
      'DiseaseID', 'AgeLower', 'AgeUpper',
      'NumExamine', 'NumPositive', 'PercentPositive',
      'NumExamineMale', 'NumPositiveMale', 'Percent_positive_male',
      'NumExamineFemale', 'NumPositiveFemale', 'PercentPositiveFemale'
    ],
    intervention: [
      'InterventionID', 'MonthsAfterBaseline', 'FrequencyAfterYear',
      'PeriodMonths', 'Coverage', 'INumExamine',
      'INumPositive', 'IPercentPositive', 'INumExamineMale',
      'INumPositiveMale', 'IPercentPositiveMale', 'INumExamineFemale',
      'INumPositiveFemale', 'IPercentPositiveFemale', 'DiseaseDataDiseaseID',
      'DiseaseDataLocationInformationLocationID1', 'DiseaseDataLReportID',
      'DiseaseDataLocationInformationSurveyDescriptionSurveyID'
    ]
  }
  switch (type) {
    case 'Basic Sources':
      return empty2Null(addQuote(data, ex.basicSources))
    case 'Survey Description':
      return empty2Null(addQuote(data, ex.survey))
    case 'Location Information':
      return empty2Null(addQuote(data, ex.location))
    case 'Disease Data':
      return empty2Null(addQuote(data, ex.disease))
    case 'Intervention Data':
      return empty2Null(addQuote(data, ex.intervention))
    default:
      console.log('type error')
  }
}

export default {
  login: function (name, password) {
    const url = '/loginReq'
    return axios.post(url, {
      username: name,
      password: md5(password)
    })
  },
  register: function (name, password, authority) {
    const url = '/register'
    return axios.post(url, {
      username: name,
      password: md5(password),
      authority: authority
    })
  },
  getId: function (type) {
    const url = '/getid'
    return axios.post(url, {
      type: type
    })
  },
  getIdTree: function (id) {
    const url = '/getidtree'
    return axios.post(url, {
      id: id
    })
  },
  getIdContent: function (id, type) {
    const url = '/getidcontent'
    return axios.post(url, {
      id: id,
      type: type
    })
  },
  query: function (id, condition, authority, context) {
    const url = '/query'
    axios.post(url, {
      id: id,
      condition: condition,
      authority: authority
    }).then(function (res) {
      // console.log(res)
      context.tableData = []  //  清空上次搜索结果
      if (res.data.result !== null && res.data.result !== undefined) {
        for (let i in res.data.result) {
          context.tableData.push({
            id: res.data.result[i].ReportID,
            title: res.data.result[i].Title,
            author: res.data.result[i].Authors,
            disease: res.data.result[i].Disease,
            reporter: res.data.result[i].Reporter,
            time: res.data.result[i].YearOfPub
          })
        }
      } else {
        context.$notify({
          title: 'Not Found',
          message: '未查询到相应结果',
          type: 'warning'
        })
      }
      context.isLoading = false
    }).catch(function (err) {
      console.log('>> /query catch Error \n' + err)
      context.isLoading = false
    })
  },
  queryAll: function (authority, context) {
    const url = '/queryAll'
    axios.post(url, {
      authority: authority
    }).then((res) => {
      context.tableData = []  //  清空上次搜索结果
      if (res.data.result !== null && res.data.result !== undefined) {
        for (let i in res.data.result) {
          context.tableData.push({
            id: res.data.result[i].ReportID,
            title: res.data.result[i].Title,
            author: res.data.result[i].Authors,
            disease: res.data.result[i].Disease,
            reporter: res.data.result[i].Reporter,
            time: res.data.result[i].YearOfPub
          })
        }
      } else {
        context.$notify({
          title: 'Not Found',
          message: '数据库中暂无数据',
          type: 'warning'
        })
      }
      context.isLoading = false
    }).catch((err) => {
      console.log('>> /query catch Error \n' + err)
      context.isLoading = false
    })
  },
  add: function (type, data, context) {
    var that = this
    const url = '/add'
    var handledData = getHandledData(type, data)
    axios.post(url, {
      type: type,
      data: handledData
    })
      .then(function (res) {
        console.log(res)
        if (res.data.success === true) {
          setTimeout(function () {
            context.$notify({
              title: '保存成功',
              message: '提交了一条' + type,
              type: 'success'
            })
          }, 500)
        } else {
          //  若是由于重复id导致的错误，调用editAPI进行更新数据的操作
          if (res.data.err.errno === 1062) {
            that.edit(type, util.getID(type, data), data, context)
          } else {
            console.log('>> /add Error: \n' + res.data.err)
          }
        }
      })
      .catch((err) => {
        console.log('>> /add catch Error' + err)
      })
  },
  edit: function (type, id, data, context) {
    const url = '/edit'
    console.log(data)
    console.log('---')
    var handledData = getHandledData(type, data)
    console.log(handledData)
    axios.post(url, {
      type: type,
      id: id,
      data: handledData
    })
    .then(function (res) {
      if (context === undefined) {
        console.log('>> /edit Error: undefined context')
      } else {
        if (res.data.success === true) {
          setTimeout(function () {
            context.$notify({
              title: '更改成功',
              message: '修改了一条' + type,
              type: 'success'
            })
          }, 500)
        } else {
          console.log(context.form)
          console.log('>> /edit Error:')
          console.log(res.data.err)
        }
      }
    })
    .catch(function (err) {
      console.log('>> /edit catch Error: \n' + err)
    })
  },
  delete: function (id, type) {
    const url = '/delete'
    axios.post(url, {
      id: id,
      type: type
    })
      .then((res) => {
        if (res.data.success) {
          this.$notify({
            title: '删除成功',
            message: '删除了' + type + ' ID:' + id,
            type: 'success'
          })
          if (this.tree !== undefined) {
            util.deleteNode(this.tree.currentNode)
            if (type === 'Basic Sources') {
              this.$router.push('/home')
            }
          }
        } else {
          console.log('>> /delete Error: \n' + res.data.err)
          console.log(res.data.err)
        }
      })
      .catch((err) => {
        console.log('>> /delete catch Error')
        console.log(err)
      })
  },
  checkModified (operation, type, context) {
    this.getIdContent(context.nodeID, type)
      .then((res) => {
        // console.log(res.data)
        var flag = false
        if (res.data.data == null) {
          flag = false
        } else {
          flag = util.isEqual(res.data.data, context.form)
        }
        if (flag) {
          operation()
        } else {
          context.$notify({
            title: '警告',
            message: '需要先保存当前条目才能继续创建',
            type: 'warning'
          })
        }
      })
      .catch((err) => {
        console.log(err)
        console.log('>> err: on next catch error')
      })
  }
}
