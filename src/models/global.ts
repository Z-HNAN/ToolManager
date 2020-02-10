import { Reducer } from 'redux'
import { Effect } from 'dva'
import { router } from 'umi'
import { OperationResultType } from '@/utils/request'
import * as globalService from '@/services/global'

// 权限枚举类型
export type AuthorityType = 'admin' // Admin-管理员
  | 'worker' // OⅠ-产线员工
  | 'storekeeper' // OⅡ-仓库管理员
  | 'repairer' // Repairer-检修员
  | 'manager' // Manager-WorkCell管理
  | 'supervisor' // Supervisor-监管员
  | 'user' // demo演示权限

// 登录权限与页面对应表
const authMapRoute: {
  [key in AuthorityType]: string
} = {
  admin: '/admin',
  worker: '/worker',
  storekeeper: '/storekeeper',
  repairer: '/repairer',
  manager: '/manager',
  supervisor: '/supervisor',
  user: '/user',
}

export interface CurrentUserType {
  id: string
  username: string
  authority: AuthorityType[]
}

export interface GlobalModelStateType {
  currentUser: null | CurrentUserType
}

export interface GlobalModelType {
  namespace: 'global'
  state: GlobalModelStateType
  effects: {
    // 登录
    login: Effect
    // 登出
    logout: Effect
  }
  reducers: {
    // 改变当前登录用户的状态
    changeCurrentUser: Reducer<any>
    // 清除当前登录用户的状态
    clearCurrentUser: Reducer<any>
  }
  subscriptions: {}
}

const INIT_STATE: GlobalModelStateType = {
  // currentUser: null,
  currentUser: {
    id: '123456',
    username: '赵大锤',
    authority: ['worker', 'storekeeper', 'supervisor', 'repairer', 'manager', 'admin'],
  },
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: INIT_STATE,
  effects: {
    *login({ payload }, { call, put }) {
      const { username, password } = payload
      const currentUser: CurrentUserType = yield call(globalService.login, { username, password })

      // 1.根据currentUser权限跳转去不同的界面,取第一个主权限
      const [auth] = currentUser.authority
      router.push(authMapRoute[auth])

      // 2.将currentUser的内容保存到state中
      yield put({ type: 'changeCurrentUser', payload: currentUser })
    },
    *logout(_, { call, put }) {
      const result: OperationResultType = yield call(globalService.logout)
      if (result.success === true) {
        // 退出成功
        yield put({ type: 'clearCurrentUser' })
      }
    },
  },
  reducers: {
    changeCurrentUser(state: GlobalModelStateType, action) {
      const {
        id,
        username,
        authority,
      } = action.payload

      // 将payload中传递的user信息保存起来
      const currentUser = {
        id,
        username,
        authority,
      }

      return {
        ...state,
        currentUser,
      }
    },
    clearCurrentUser(state: GlobalModelStateType) {
      return {
        ...state,
        currentUser: null,
      }
    },
  },
  subscriptions: {},
}

export default GlobalModel
