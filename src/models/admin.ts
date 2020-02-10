import { Reducer } from 'redux'
import { Subscription, Effect } from 'dva'
import { IConnectState } from './connect.d'
import { OperationResultType } from '@/utils/request'
import { EditWorkcellType, EMPTY_WORKCELL_PARAMS } from '@/pages/admin/department'
import * as adminService from '@/services/admin'

// 权限类型
export type AuthorityType = {
  id: string
  name: string
  remark: string
}

// manager经理类型
export type ManagerType = {
  id: string
  name: string
  phone: string
}

// workcell类型
export type WorkCellType = {
  id: string
  name: string
  managerId: string | null
}

export interface IAdminModelState {
  authorities: AuthorityType[]
  workcells: WorkCellType[]
  managers: ManagerType[]
  editWorkCell: EditWorkcellType | null
}

export interface IAdminModelType {
  namespace: 'admin'
  state: IAdminModelState
  reducers: {
    /* 改变editWorkCell */
    changeEditWorkCell: Reducer<any>,
    /* 清除editWorkCell */
    clearEditWorkCell: Reducer<any>,
    /* 存入权限 */
    saveAuthority: Reducer<any>,
    /* 存入workcells */
    saveWorkcells: Reducer<any>,
    /* 存入managers */
    saveManagers: Reducer<any>,
  }
  effects: {
    /* 拉取权限 */
    fetchAuthority: Effect,
    /* 拉取workcell */
    fetchWorkcells: Effect,
    /* 拉取managers */
    fetchManagers: Effect,
    /* 初始化权限列表 */
    initAuthority: Effect,
    /* 初始化workcell列表 */
    initWorkcellsAndManagers: Effect,
    /* 更新某一个权限 */
    updateAuthority: Effect,
    /* 更新workcell */
    updateWorkCell: Effect,
  }
  subscriptions: {
    /* 初始化权限列表 */
    initAuthority: Subscription,
    /* 初始化workcell,manager */
    initWorkcellsAndManagers: Subscription,
  }
}

const UsersModel: IAdminModelType = {
  namespace: 'admin',
  state: {
    authorities: [],
    workcells: [],
    managers: [],
    editWorkCell: null,
  },
  reducers: {
    changeEditWorkCell(state: IAdminModelState, { payload: id }) {
      if (id === null) {
        return { ...state, editWorkCell: { ...EMPTY_WORKCELL_PARAMS } }
      }
      const editWorkCell = (state.workcells.find(workCell => workCell.id === id)) as EditWorkcellType
      return { ...state, editWorkCell }
    },
    clearEditWorkCell(state) {
      return { ...state, editWorkCell: null }
    },
    saveAuthority(state, { payload: authorities }) {
      return { ...state, authorities }
    },
    saveWorkcells(state, { payload: workcells }) {
      return { ...state, workcells }
    },
    saveManagers(state, { payload: managers }) {
      return { ...state, managers }
    },
  },
  effects: {
    *fetchAuthority(_, { call, put }) {
      const authorities = yield call(adminService.fetchAuthorities)
      yield put({ type: 'saveAuthority', payload: authorities })
    },
    *fetchWorkcells(_, { call, put }) {
      const workcells = yield call(adminService.fetchWorkcells)
      yield put({ type: 'saveWorkcells', payload: workcells })
    },
    *fetchManagers(_, { call, put }) {
      const managers = yield call(adminService.fetchManagers)
      yield put({ type: 'saveManagers', payload: managers })
    },
    *initAuthority(_, { put, select }) {
      const authorities = yield select((state: IConnectState) => state.admin.authorities)
      // 只有权限列表为空才会去拉取一次权限
      if (authorities.length === 0) {
        yield put({ type: 'fetchAuthority' })
      }
    },
    *initWorkcellsAndManagers(_, { put, select }) {
      const workcells = yield select((state: IConnectState) => state.admin.workcells)
      // 只有workcells列表为空才会去拉取一次workcells
      if (workcells.length === 0) {
        yield put({ type: 'fetchWorkcells' })
        yield put({ type: 'fetchManagers' })
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
    *updateWorkCell({ payload: editWorkCell }, { call, select, put }) {
      const id = yield select(
        (state: IConnectState) => ((state.admin.editWorkCell) as EditWorkcellType).id,
      )
      // api中id为null则新增，否则为修改
      const result: OperationResultType = yield call(adminService.updateWorkCell, { ...editWorkCell, id })
      if (result.success === true) {
        yield put({ type: 'clearEditWorkCell' })
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
    initWorkcellsAndManagers({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/admin/department') {
          dispatch({ type: 'initWorkcellsAndManagers' })
        }
      })
    },
  },
}

export default UsersModel
