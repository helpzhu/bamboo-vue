import { resetRouter } from '@/router'

const state = {
	token: '',
	name: '',
	avatar: ''
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	}
}

const actions = {

}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
