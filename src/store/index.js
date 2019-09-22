import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'

import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const state = {
	curUserInfo: {}, // 当前登陆用户信息
}

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  state,
  mutations
})

export default store
