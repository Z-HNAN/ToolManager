import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import { UserResultType, UserAdvancedSerch } from '@/models/admin'
import { BasicPagation } from '@/models/global'
import { isNil } from 'lodash'

export type userSelectType = {
  id: string // 用工id
  username: string // 登录账号
  authName: string // 真实姓名
  phone: string // 联系电话
  workerId: string // 员工工号
  authority: string // 权限
}

/**
 * 编辑用户表单，工作部门联动类型
 */
export type workcellFormSelectType = {
  id: string,
  name: string,
}
/**
 * 编辑用户表单，权限联动类型
 */
export type authorityFormSelectType = {
  id: string,
  name: string,
}

export interface userResultListSelectType {
  total: number // 总条数
  list: userSelectType[]
}

/**
 * 是否隐藏查询结果
 */
export const hiddenSearchResultSelector = createSelector(
  [
    (state: IConnectState) => state.admin.userResultList,
  ],
  (userResultList): boolean => isNil(userResultList),
)

/**
 * 是否展示modal
 */
export const showEditUserModalSelector = createSelector(
  [
    (state: IConnectState) => state.admin.editUser,
  ],
  (editUser): boolean => isNil(editUser) === false,
)

/**
 * 符合条件的查询信息
 */
export const userResultListSelector = createSelector(
  [
    hiddenSearchResultSelector,
    (state: IConnectState) => state.admin.userResultList,
    (state: IConnectState) => state.admin.authorities,
  ],
  (hiddenSearchResult, userResultList, authorities) => {
    if (hiddenSearchResult === true) {
      return { total: 0, list: [] }
    }

    // 过滤数据
    return {
      total: (userResultList as UserResultType).total,
      list: (userResultList as UserResultType).list.map(user => ({
        id: user.id,
        username: user.username,
        authName: user.authName,
        phone: user.phone,
        workerId: user.workerId,
        authority: (authorities.find(({ id }) => id === user.authorityId) || { name: '' }).name,
      })),
    }
  },
)

/**
 * 返回当前分页状态
 */
export const pagationStatusSelector = createSelector(
  [
    (state: IConnectState) => state.admin.userAdvancedSearch,
  ],
  (userAdvancedSearch: UserAdvancedSerch): BasicPagation => {
    const { page, size } = userAdvancedSearch
    return { page, size }
  },
)

/**
 * 新增员工表单-部门数据
 */
export const workcellFormSelector = createSelector(
  [
    (state: IConnectState) => state.admin.workcells,
  ],
  workcells => workcells.map(workcell => ({
    id: workcell.id,
    name: workcell.name,
  })),
)

/**
 * 新增员工表单-权限数据
 */
export const authorityFormSelector = createSelector(
  [
    (state: IConnectState) => state.admin.authorities,
  ],
  authorities => authorities.map(authority => ({
    id: authority.id,
    name: authority.name,
  })),
)

