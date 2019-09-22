import {request} from "../utils/request";

// 查询角色信息
export function getAllRoleList(params) {
    return request('post', '/role/getRolePaging', params);
}

// 添加角色信息
export function insertRole(params) {
    return request('post', '/role/insertRole', params);
}

// 编辑角色信息
export function updateRole(params) {
    return request('post', '/role/updateRole', params);
}

// 删除角色信息
export function deleteRole(params) {
    return request('get', '/role/deleteRole', params);
}