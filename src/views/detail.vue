<!-- 编辑数据库条目界面 -->
<template>
<div id="detail">
  <el-menu id="top-menu" :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1"><i class="el-icon-menu"></i>Menu</el-menu-item>
    <el-menu-item index="2"><i class="el-icon-setting"></i>Work Bench</el-menu-item>
  </el-menu>
  <!-- <h1>Detail Page</h1> -->
  <div id="detail-page-container">
    <el-row>
      <el-col id="detail-left-part" :span="7">
        <el-tree id="detail-tree" :data="treedata" :props="defaultProps"
          node-key="id" default-expand-all :expand-on-click-node="false"
          :highlight-current="true" @node-click="clickEvent" ref="tree"
          accordion>
        </el-tree>
      </el-col>
      <el-col id="detail-right-part" :span="17">
        <!--  向孩子传递参数: tree组件  -->
        <router-view @getBuffer="updateBuff"
          :buff="buff" :tree="tree" :idPath="idPath" :nodeID="nodeID">
        </router-view>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import api from '../model/api.js'

let id = 1000;

export default {
  data() {
    return {
      inputData: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      nodeType: ['ReportID', 'SurveyID', 'LocationID', 'DiseaseID', 'InterventionID'],
      tree: null,
      treedata: [],
      treeId: 2,
      idPath: [],
      nodeID: -1,
      buff: { 'B': {}, 'S': {}, 'L': {}, 'D': {}, 'I': {} },
      //  导航菜单
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  computed: {
    opt: {
      get() {
        return this.$store.state.opt
      },
      set(value) {
        this.$store.commit('updateOpt', value)
      }
    },
    id: {
      get() {
        return this.$store.state.treeID
      },
      set(v) {
        this.$store.commit('updateTreeID', v)
      }
    }
  },
  methods: {
    //  顶部导航菜单
    handleSelect(key, keyPath) {
      if (key == 1) {  // menu
        this.$router.push('/home')
      }
    },
    //  点击树状视图，进行导航操作
    clickEvent(data, node, tree) {
      var curNode = this.tree.currentNode.node
      this.idPath = []
      while (typeof(curNode.data.dataID) !== "undefined") {
        this.idPath.push(curNode.data.dataID)
        curNode = curNode.parent
      }
      this.idPath.reverse()
      this.nodeID = this.idPath[node.level - 1]
      //  TODO: 数据库查询默认数据操作
      switch (node.level) {
        case 1:
          this.$router.push('/detail/basicsource');
          break;
        case 2:
          this.$router.push('/detail/survey');
          break;
        case 3:
          this.$router.push('/detail/location');
          break;
        case 4:
          this.$router.push('/detail/disease');
          break;
        case 5:
          this.$router.push('/detail/intervention');
          break;
        default:
          console.log('err');
      };
    },
    updateBuff(type, id, form) {
      this.buff[type][id] = form
    },
    buildNode(node, nodeData, level) {
      var len = 0
      for (let i in nodeData) len++
      if (len === 0) return
      for (let i in nodeData) {
        let newNode = {
          id: this.id++,
          label: this.nodeType[level] + ' ' + i,
          children: [],
          dataID: i
        }
        node.push(newNode)
        this.buildNode(newNode.children, nodeData[i], level + 1)
      }
    },
    initTreeData(rawData) {
      this.buildNode(this.treedata, rawData, 0)
    }
  },
  created: function() {
    //  初始化 从服务器拿数据
  },
  mounted: function () {
    //  获取树组件的引用
    this.tree = this.$refs.tree
    switch (this.opt) {
      case 'new':
        api.getId('Basic Sources')
          .then((res) => {
            var getid = res.data.id
            this.treedata = [{
              id: this.id++,
              label: "Report ID " + getid,
              children: [],
              dataID: getid  //  id from database
            }]
            setTimeout(() => {
              this.$refs.tree.$children[0].handleClick()
            }, 0)
          })
          .catch((err) => {
            this.$notify({
              title: '',
              message: '网络错误',
              type: 'warning'
            })
          })
        break
      case 'edit':
        //  从服务器读取数据
        api.getIdTree(this.$store.state.editOpt.editID)
          .then((res) => {
            if (res.data.err === null) {
              // console.log(res.data.data);
              this.initTreeData(res.data.data)
            } else {
              console.log('>> /getidtree Error')
              console.log(res.data.err)
            }
            setTimeout(() => {
              this.$refs.tree.$children[0].handleClick()
            }, 0)
          }).catch((err) => {
            console.log('>> /getidtree catch Error')
            console.log(err)
          })
        break
      case 'view':
        api.getIdTree(this.$store.state.viewOpt.viewID)
          .then((res) => {
            if (res.data.err === null) {
              console.log(res.data.data);
              this.initTreeData(res.data.data)
            } else {
              console.log('>> /getidtree Error')
              console.log(res.data.err)
            }
            setTimeout(() => {
              this.$refs.tree.$children[0].handleClick()
            }, 0)
          }).catch((err) => {
            console.log('>> /getidtree catch Error')
            console.log(err)
          })
        break
      default:
        //  do nothing
    }
  },
  beforeDestroy: function() {
    this.opt = ''  //  清除痕迹
  }
}
</script>

<style>
#detail-page-container {
  position: relative;
  top: 40px;
  text-align: left;
  border-style: solid;
  border-radius: 4px;
  border-width: 1px;
}

#detail-left-part {
  height: 550px;
  overflow: scroll;
  border-right-width: 2px;
  border-right-style: solid;
  border-color: #BFCBD9;
}

#detail-right-part {
  height: 550px;
  overflow: scroll;
  padding: 20px;
}

.dt-title {
  font-size: 18pt;
  font-weight: bold;
  margin: 20px;
}

#detail-tree {
  border-width: 0;
}

#top-menu {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  /*width: auto;*/
}
</style>
