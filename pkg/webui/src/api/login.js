import request from '@/utils/request'
import qs from 'qs'

export function loginByUsername(data) {
  return request({
    url: '/v1/users/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function logout() {
  return request({
    url: 'login/logout',
    method: 'post'
  })
}

export function getUserPrem(token) {
  return request({
    url: '/v1/account/permissions',
    method: 'get'
  })
}

export function getUserDomain(token) {
  return request({
    url: '/v1/account/domains',
    method: 'get'
  })
}

export function getUserCaptcha(token) {
  return request({
    url: 'captcha/request',
    method: 'get',
    params: {
      token
    }
  })
}
