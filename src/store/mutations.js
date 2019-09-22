export default {
	// 当前登陆用户信息
	CUR_USER_INFO: function(state, payload) {
		state.curUserInfo = payload | {}
	}
}