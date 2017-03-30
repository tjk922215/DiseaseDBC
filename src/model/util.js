export default {
  //  扩展对树形控件的操作
  appendNode: function (parent, nextId, typeString) {
    var key = -1
    var parentNode = parent.node
    var nodeToAppend = {
      id: this.id++,
      label: typeString + ' ' + nextId,
      children: [],
      dataID: nextId
    }
    if (parentNode === undefined) {  //  parentNode is the root of the tree
      this.tree.root.store.append(nodeToAppend)
      key = this.tree.root.childNodes.length - 1
    } else {                         //  parentNode is a leaf
      parentNode.store.append(nodeToAppend, parentNode.data)
      key = parentNode.childNodes.length
    }
    //  click the created node
    setTimeout(() => { parent.$children[key].handleClick() }, 0)
  },
  deleteNode: function (cur) {
    var curNode = cur.node
    // var parent = curNode.parent
    if (cur.$parent.handleClick !== undefined) {
      setTimeout(() => {
        cur.$parent.handleClick()
      }, 0)
    }
    curNode.store.remove(curNode.data)
  },
  //  获取表名对应的缩写
  getShortTypeName: function (type) {
    switch (type) {
      case 'ReportID':
      case 'Basic Sources':
        return 'ReportID'
      case 'Survey':
      case 'Survey Description':
        return 'Survey'
      case 'Location':
      case 'Location Information':
        return 'Location'
      case 'Disease':
      case 'Disease Data':
        return 'Disease'
      case 'Intervention':
      case 'Intervention Data':
        return 'Intervention'
      default:
        return 'Not Match'
    }
  },
  //  返回对应类型数据表的ID，若type对应表不存在，返回-1
  getID (type, data) {
    switch (type) {
      case 'ReportID':
      case 'Basic Sources':
        return data.ReportID
      case 'Survey':
      case 'Survey Description':
        return data.SurveyID
      case 'Location':
      case 'Location Information':
        return data.LocationID
      case 'Disease':
      case 'Disease Data':
        return data.DiseaseID
      case 'Intervention':
      case 'Intervention Data':
        return data.InterventionID
      default:
        return -1
    }
  },
  isEqual (f1, f2) {
    for (let i in f1) {
      if (f1[i] === '' || f1[i] === null) {
        if (f2[i] !== '' && f2[i] !== null) {
          return false
        }
      } else if (!isNaN(f1[i]) && !isNaN(f2[i])) {
        if (parseInt(f1[i]) !== parseInt(f2[i])) {
          return false
        }
      } else {
        if (f1[i] !== f2[i]) {
          return false
        }
      }
    }
    return true
  }
}
