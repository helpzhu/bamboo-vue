<template>
	<div class="login-container">
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

			<div class="title-container">
				<h3 class="title">Login Form</h3>
			</div>

			<el-form-item prop="username">
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text" tabindex="1"
				 auto-complete="on" />
			</el-form-item>

			<el-form-item prop="password">
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Password"
				 name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
				<span class="show-pwd" @click="showPwd">
					<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>

			<el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>
		</el-form>
	</div>
</template>

<script>
	import { login, logout, getCurUserInfo } from "@/api/user";
	import { getTree } from '@/api/menu.js'
	import cache from '@/utils/cache.js'
	export default {
		name: 'Login',
		data() {
			return {
				loginForm: {
					username: 'admin',
					password: 'admin'
				},
				loginRules: {
					username: [{
						required: true,
						trigger: 'blur',
						validator: ''
					}],
					password: [{
						required: true,
						trigger: 'blur',
						validator: ''
					}]
				},
				passwordType: 'password',
				redirect: undefined
			}
    },
    computed: {
      curUserInfo() {
        return this.$store.state.curUserInfo;
      }
    },
		watch: {

		},
		methods: {
			showPwd() {
				if (this.passwordType === 'password') {
					this.passwordType = ''
				} else {
					this.passwordType = 'password'
				}
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						login({
							username: this.loginForm.username,
							password: this.loginForm.password
						}).then((res) => {
							if (res.result == 'success') {
								this.getCurrentUserInfo();
								this.getCurMenuTree();
								this.$router.push({
									path: '/'
								})
							} else {
								this.$notify({
									type: 'error',
									message: res.message
								})
							}
						})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			/* 获取当前登陆用户信息 */
			getCurrentUserInfo() {
				getCurUserInfo().then(res => {
					console.log('获取当前登陆用户信息，', res)
					if (res.result == 'success') {
						this.$store.commit('CUR_USER_INFO', res.data)
            cache.setSession('curUserInfo', JSON.stringify(res.data));
            console.log('state中的用户信息：', this.curUserInfo)
					}
				})
			},
			/* 获取当前拥有的菜单权限 */
			getCurMenuTree() {
				getTree().then(res => {
					console.log('获取当前拥有的菜单权限：', res);
					cache.setLocal('menuTree', JSON.stringify(res.data));
				})
			},
		}
	}
</script>

<style lang="scss">
	$bg:#283443;
	$light_gray:#fff;
	$cursor: #fff;

	@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
		.login-container .el-input input {
			color: $cursor;
		}
	}

	/* reset element-ui css */
	.login-container {
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;

			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $light_gray;
				height: 47px;
				caret-color: $cursor;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: $cursor !important;
				}
			}
		}

		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
	}
</style>

<style lang="scss" scoped>
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;

	.login-container {
		min-height: 100%;
		width: 100%;
		background-color: $bg;
		overflow: hidden;

		.login-form {
			position: relative;
			width: 520px;
			max-width: 100%;
			padding: 160px 35px 0;
			margin: 0 auto;
			overflow: hidden;
		}

		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}

		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
		}

		.title-container {
			position: relative;

			.title {
				font-size: 26px;
				color: $light_gray;
				margin: 0px auto 40px auto;
				text-align: center;
				font-weight: bold;
			}
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}
	}
</style>
