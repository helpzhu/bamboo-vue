import { request } from '@/utils/request'

// 登陆
export function login(params) {
	return request('post', '/bamboo/login', params, true);
}

// 注销
export function logout() {
	return request('post', '/bamboo/logout', {});
}

// 获取当前登陆用户信息
export function getCurUserInfo() {
	return request('get', '/user/getCurrentUserInfo');
}

// 获取所有用户列表
export function getAllUserList(params) {
	return request('post', '/user/getUserPaging', params);
}

// 新增用户信息
export function insertUser(params) {
	return request('post', '/user/insertUser', params);
}

// 编辑用户信息
export function updateUser(params) {
	return request('post', '/user/updateUser', params);
}

// 删除用户信息
export function deleteUser(params) {
	return request('get', '/user/deleteUser', params);
}
