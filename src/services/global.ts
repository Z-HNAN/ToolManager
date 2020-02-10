import request, { OperationResultType } from '@/utils/request'

import { CurrentUserType } from '@/models/global'

/**
 * 用户登录
 */
export async function login (
  { username, password }: { username: string, password: string },
): Promise<CurrentUserType> {
  // const response = await request('login', {
  //   method: 'POST',
  //   data: { username, password },
  // })

  // 过滤数据

  return {
    id: '123456',
    username: '赵大锤',
    authority: ['worker', 'storekeeper', 'supervisor', 'repairer', 'manager', 'admin'],
  }
}


/**
 * 用户退出
 */
export async function logout(): Promise<OperationResultType> {
  // 退出请求
  // const response = await request('logout')

  return {
    success: true,
    msg: '',
  }
}
