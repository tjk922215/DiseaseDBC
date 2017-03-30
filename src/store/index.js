import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  strict: debug,
  state: {
    // baseHost: '172.18.215.237',
    treeID: 1,         //  作为树形视图的唯一标识
    islogin: false,    //  标记登录状态
    opt: '',           //  'new | edit | view |' 确定了进入detail页面时的相应初始化操作
    homeTableBuff: null,
    homeConditionsBuff: {
      searchID: null,
      dValue: '',
      cValue: '',
      yValue: '',
      doubleClick: ''
    },
    editOpt: {
      editID: -1       //  标记编辑哪一条report
    },
    viewOpt: {
      viewID: -1
    },
    userInfo: {
      username: '',
      id: -1,
      authority: -1  //  1->管理员 2->内部人员 3->外部录入人员 4->访客
    }
  },
  mutations: {
    updateTreeID: (state, newId) => { state.treeID = newId },
    updateIslogin: (state, islogin) => { state.islogin = islogin },
    updateAuthority: (state, value) => { state.authority = value },
    updateOpt: (state, opt) => { state.opt = opt },
    updateEditID: (state, id) => { state.editOpt.editID = id },
    updateViewID: (state, id) => { state.viewOpt.viewID = id },
    updateHomeTableBuff: (state, newBuff) => { state.homeTableBuff = newBuff },
    updateHomeConditionsBuff: (state, conditions) => {
      state.homeConditionsBuff.searchID = conditions.searchID
      state.homeConditionsBuff.dValue = conditions.dValue
      state.homeConditionsBuff.cValue = conditions.cValue
      state.homeConditionsBuff.yValue = conditions.yValue
      state.homeConditionsBuff.doubleClick = conditions.doubleClick
    },
    updateUserInfo: (state, payload) => {
      state.userInfo.username = payload.username
      state.userInfo.id = payload.id
      state.userInfo.authority = payload.authority
    }
  }
})
