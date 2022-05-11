import request from '@/utils/request'

export async function test(data) {
  return request({
    url: '/test/pageList',
    method: 'post',
    data
  })
}
