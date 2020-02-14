import { Reducer } from 'redux'
import { Subscription, Effect } from 'dva'
import { isNil } from 'lodash'
import { IConnectState } from './connect.d'
import { OperationResultType } from '@/utils/request'
import { EditWorkcellType, EMPTY_WORKCELL_PARAMS } from '@/pages/admin/department'
import { EditUserType, EMPTY_EDIT_USER } from '@/pages/admin/user'
import * as adminService from '@/services/admin'
import { BasicAdvancedSerch } from './global'

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


// user管理，高级搜索
export type UserSearch = {
  workcellId: string // 工作部门Id
  workerId?: string // 员工Id
  workerName?: string // 员工姓名
  authorityId?: string // 查询权限
}
export type UserAdvancedSerch = BasicAdvancedSerch<UserSearch>

// user管理，搜索结果
export type UserType = {
  id: string // 用工id
  workcellId: string // 工作部门id
  username: string // 登录账号
  authName: string // 真实姓名
  phone: string // 联系电话
  workerId: string // 员工工号
  authorityId: string // 权限
}
export type UserResultType = {
  total: number
  list: UserType[]
}

export interface IAdminModelState {
  authorities: AuthorityType[]
  workcells: WorkCellType[]
  managers: ManagerType[]
  editUser: EditUserType | null
  editWorkCell: EditWorkcellType | null
  userAdvancedSearch: UserAdvancedSerch
  userResultList: UserResultType | null
}

export interface IAdminModelType {
  namespace: 'admin'
  state: IAdminModelState
  reducers: {
    /* 改变editUser */
    changeEditUser: Reducer<any>,
    /* 改变editWorkCell */
    changeEditWorkCell: Reducer<any>,
    /* 改变userAdvancedSearch内容 */
    changeUserAdvancedSearchContent: Reducer<any>,
    /* 改变userAdvancedSearch查询条件 */
    changeUserAdvancedSearchLimit: Reducer<any>,
    /* 改变userAdvancedResult查询结果 */
    changeUserResultList: Reducer<any>,
    /* 清除editUser */
    clearEditUser: Reducer<any>,
    /* 清除editWorkCell */
    clearEditWorkCell: Reducer<any>,
    /* 清除userAdvancedResult查询结果 */
    clearUserResultList: Reducer<any>,
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
    /* 初始化manager */
    initManager: Effect,
    /* 初始化workcell列表 */
    initWorkcell: Effect,
    /* 移除user */
    removeUser: Effect,
    /* 移除workcell */
    removeWorkCell: Effect,
    /* 刷新user */
    refreshUser: Effect,
    /* 根据高级查询信息，高级查询用户 */
    searchUserResult: Effect,
    /* 更新某一个权限 */
    updateAuthority: Effect,
    /* 更新user */
    updateUser: Effect,
    /* 更新workcell */
    updateWorkCell: Effect,
  }
  subscriptions: {
    /* 初始化authrity,workcell列表 */
    init: Subscription,
    /* 初始化manager */
    initManager: Subscription,
  }
}

const AdminModel: IAdminModelType = {
  namespace: 'admin',
  state: {
    authorities: [],
    workcells: [],
    managers: [],
    editUser: null,
    editWorkCell: null,
    userAdvancedSearch: { page: 0, size: 10, content: null },
    userResultList: null,
  },
  reducers: {
    changeEditUser(state: IAdminModelState, { payload: id }) {
      if (id === null) {
        return { ...state, editUser: { ...EMPTY_EDIT_USER } }
      }
      const editUser = (state.userResultList?.list.find(user => user.id === id)) as UserType
      return { ...state, editUser: { ...editUser, password: '' } }
    },
    changeEditWorkCell(state: IAdminModelState, { payload: id }) {
      if (id === null) {
        return { ...state, editWorkCell: { ...EMPTY_WORKCELL_PARAMS } }
      }
      /* eslint-disable-next-line max-len */
      const editWorkCell = (state.workcells.find(workCell => workCell.id === id)) as EditWorkcellType
      return { ...state, editWorkCell: { ...editWorkCell } }
    },
    changeUserAdvancedSearchContent(state: IAdminModelState, { payload: userSearch }) {
      // 重置查询条件结果
      const userAdvancedSearch: UserAdvancedSerch = {
        page: 0, size: 10, content: userSearch,
      }
      return { ...state, userAdvancedSearch }
    },
    changeUserAdvancedSearchLimit(state: IAdminModelState, { payload }) {
      const { page, size } = payload
      // 追加查询条件结果
      const userAdvancedSearch: UserAdvancedSerch = {
        page, size, content: state.userAdvancedSearch.content,
      }
      return { ...state, userAdvancedSearch }
    },
    changeUserResultList(state: IAdminModelState, { payload: { list, total, append = false } }) {
      let { userResultList } = state

      // 第一次填充数据
      if (isNil(userResultList)) {
        userResultList = { list, total }
        return { ...state, userResultList }
      }

      // 替换数据
      if (append === false) {
        userResultList = { list, total }
        return { ...state, userResultList }
      }

      // 追加数据
      userResultList = {
        total,
        list: [
          ...userResultList.list,
          ...list,
        ],
      }
      return { ...state, userResultList }
    },
    clearEditUser(state) {
      return { ...state, editUser: null }
    },
    clearEditWorkCell(state) {
      return { ...state, editWorkCell: null }
    },
    clearUserResultList(state) {
      return { ...state, userResultList: null }
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
    *initWorkcell(_, { put, select }) {
      const workcells = yield select((state: IConnectState) => state.admin.workcells)
      // 只有workcells列表为空才会去拉取一次workcells
      if (workcells.length === 0) {
        yield put({ type: 'fetchWorkcells' })
      }
    },
    *initManager(_, { put, select }) {
      const managers = yield select((state: IConnectState) => state.admin.managers)
      // 只有workcells列表为空才会去拉取一次workcells
      if (managers.length === 0) {
        yield put({ type: 'fetchManagers' })
      }
    },
    *removeUser({ payload: id }, { call, put }) {
      const result: OperationResultType = yield call(adminService.removeUser, { id })
      // 删除失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 刷新列表
      yield put({ type: 'refreshUser' })
    },
    *removeWorkCell({ payload: id }, { call, put }) {
      const result: OperationResultType = yield call(adminService.removeWorkCell, { id })
      // 删除失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 删除成功, 重新获取表格内容
      yield put({ type: 'fetchWorkcells' })
    },
    *refreshUser(_, { select, put }) {
      // 重新获取user列表
      const userSearch = yield select(
        (state: IConnectState) => state.admin.userAdvancedSearch.content,
      )
      // 如果没有搜索条件，则不去重新获取
      if (isNil(userSearch) === false) {
        yield put({ type: 'changeUserAdvancedSearchContent', payload: userSearch })
        yield put({ type: 'clearUserResultList' })
        yield put({ type: 'searchUserResult' })
      }
    },
    *searchUserResult({ payload: nextPage }, { call, put, select }) {
      // nextPage此业务中保证递增增长，如果在pagation中跳跃，则会自动发送中间的页数
      const [
        advancedSearch,
        userResultList,
      ]: [UserAdvancedSerch, UserResultType | null] = yield select(
        (state: IConnectState) => [
          state.admin.userAdvancedSearch,
          state.admin.userResultList,
        ],
      )
      const { page, size, content } = advancedSearch
      // 如果没有查询条件，直接返回
      if (isNil(content)) {
        return
      }

      // 如果是第一次查询，直接查询第一页
      if (isNil(userResultList)) {
        const response = yield call(adminService.fetchUser, {
          ...content,
          startIndex: 1,
          pageSize: size,
        })
        // 存储查询结果
        yield put({ type: 'changeUserResultList', payload: { total: response.total, list: response.list } })
        // 更改查询条件
        const currentPage = page + Math.ceil(response.list.length / size)
        yield put({ type: 'changeUserAdvancedSearchLimit', payload: { page: currentPage, size } })
        return
      }

      const { total, list } = userResultList

      // 拼接开始页数
      const startIndex = (nextPage - 1) * size
      // 已经查询完所有，则不再查询
      if (list.length >= total) {
        return
      }
      // 继续向后查询
      const response = yield call(adminService.fetchUser, {
        ...content,
        startIndex,
        pageSize: size,
      })
      // 存储查询结果
      yield put({ type: 'changeUserResultList', payload: { total: response.total, list: response.list, append: true } })
      // 更查询条件
      const currentPage = nextPage
      yield put({ type: 'changeUserAdvancedSearchLimit', payload: { page: currentPage, size } })
    },
    *updateAuthority({ payload }, { call, put }) {
      const { id, remark } = payload
      const result: OperationResultType = yield call(adminService.updateAuthority, { id, remark })
      if (result.success === true) {
        // 修改成功
        yield put({ type: 'fetchAuthority' })
      }
    },
    *updateUser({ payload: editUser }, { call, select, put }) {
      const id = yield select(
        (state: IConnectState) => ((state.admin.editUser) as EditUserType).id,
      )
      // api中id为null则新增，否则为修改
      const result: OperationResultType = yield call(adminService.updateUser, { ...editUser, id })
      if (result.success === true) {
        yield put({ type: 'clearEditUser' })
        // 刷新user
        yield put({ type: 'refreshUser' })
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
        // 刷新workcell
        yield put({ type: 'fetchWorkcells' })
      }
    },
  },
  subscriptions: {
    init({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // /admin/ 开头的字符串
        if (/^\/admin\/./g.test(pathname)) {
          // 初始化authority
          dispatch({ type: 'initAuthority' })
          // 初始化workcell
          dispatch({ type: 'initWorkcell' })
        }
      })
    },
    initManager({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/admin/department') {
          // 初始化manager
          dispatch({ type: 'initManager' })
        }
      })
    },
  },
}

export default AdminModel
