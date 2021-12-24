import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: "tnsg",
    userID: 1,
    userName: "Tamer Negm",
    GroupNo: 1,
    GroupName: "Group 1",
    SchoolNo: 1,
    SchoolName: "School 1",     
  },
  mutations: {
    SET_USER(state, USER) {
      state.user = USER.User;
      state.userID = USER.UserID;
      state.userName = USER.UserName;
      state.GroupNo = USER.GroupNo;
      state.GroupName = USER.GroupName;
      state.SchoolNo = USER.SchoolNo;
      state.SchoolName = USER.SchoolName;
    },    
  },
  actions: {
    LoadUser({ commit }, payload) {
      commit("SET_USER", payload);
    },        
  },
  modules: {

  }
})
