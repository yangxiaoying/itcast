import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
    username: ''
}
const mutations = {
    getUserName(state){
        state.username = localStorage.getItem('username');
    }
}
const actions = {}
const getters = {}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
