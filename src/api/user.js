import { request } from '@/utils/request'

export function login(params) {
  return request('post', '/bamboo/login', params, true);
}

export function logout() {
  return request('post', '/bamboo/logout', {});
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
