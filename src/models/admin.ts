import { Reducer } from 'redux'
import { Subscription, Effect } from 'dva'
import { IConnectState } from './connect.d'
import { OperationResultType } from '@/utils/request'
import * as adminService from '@/services/admin'

export type AuthorityType = {
  id: string
  name: string
  remark: string
}

export interface IAdminModelState {
  authorities: AuthorityType[]
}

export interface IAdminModelType {
  namespace: 'admin'
  state: IAdminModelState
  reducers: {
    /* 存入权限 */
    saveAuthority: Reducer<any>,
  }
  effects: {
    /* 拉取权限 */
    fetchAuthority: Effect,
    /* 初始化权限列表 */
    initAuthority: Effect,
    /* 更新某一个权限 */
    updateAuthority: Effect,
  }
  subscriptions: {
    /* 初始化权限列表 */
    initAuthority: Subscription,
  }
}

const UsersModel: IAdminModelType = {
  namespace: 'admin',
  state: {
    authorities: [],
  },
  reducers: {
    saveAuthority(state, { payload: authorities }) {
      return { ...state, authorities }
    },
  },
  effects: {
    *fetchAuthority(_, { call, put }) {
      const authorities = yield call(adminService.fetchAuthorities)
      yield put({ type: 'saveAuthority', payload: authorities })
    },
    *initAuthority(_, { put, select }) {
      const authorities = yield select((state: IConnectState) => state.admin.authorities)
      // 只有权限列表为空才会去拉取一次权限
      if (authorities.length === 0) {
        yield put({ type: 'fetchAuthority' })
      }
    },
    *updateAuthority({ payload }, { call, put }) {
      const { id, remark } = payload
      const result: OperationResultType = yield call(adminService.updateAuthority, { id, remark })
      if (result.success === true) {
        // 修改成功
        yield put({ type: 'fetchAuthority' })
      }
    },
  },
  subscriptions: {
    initAuthority({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/admin/authority') {
          dispatch({ type: 'initAuthority' })
        }
      })
    },
  },
}

export default UsersModel
