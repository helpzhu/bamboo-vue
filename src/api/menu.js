import { request } from "@/utils/request"

export function getTree() {
	return request('get', '/menu/getMenuTree');
}

export function getAllMenuList(params) {
	return request('post', '/menu/getMenuPaging', params);
}

export function insertMenu(params) {
	return request('post', '/menu/insertMenu', params);
}

export function updateMenu(params) {
	return request('post', '/menu/updateMenu', params);
}

export function deleteMenu(params) {
	return request('get', '/menu/deleteMenu', params);
}