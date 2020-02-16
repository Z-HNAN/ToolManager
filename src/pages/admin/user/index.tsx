/**
 * 人员管理
 */

import React from 'react'
import { Dispatch, AnyAction } from 'redux'
import { connect } from 'dva'
import { Button, Empty, Spin } from 'antd'
import { AdvancedSearch, WhiteSpace } from '@/components'
import { UserSearch } from '@/models/admin'
import { IConnectState } from '@/models/connect'
import { BasicPagation } from '@/models/global'
import { undefinedToNull } from '@/utils'
import UserTable from './components/UserTable'
import UserModal from './components/UserModal'
import {
  hiddenSearchResultSelector,
  showEditUserModalSelector,
  userResultListSelectType,
  userResultListSelector,
  pagationStatusSelector,
  workcellFormSelectType,
  workcellFormSelector,
  authorityFormSelectType,
  authorityFormSelector,
} from './selector'

import styles from './index.less'

export type EditUserType = {
  id: string | null
  workcellId: string
  workerId: string
  authName: string
  username: string
  password: string
  phone: string
  authorityId: string
}

export const EMPTY_EDIT_USER: EditUserType = {
  id: null,
  workcellId: '-1',
  workerId: '',
  authName: '',
  username: '',
  password: '',
  phone: '',
  authorityId: '',
}


interface UserProps {
  dispatch: Dispatch<AnyAction>
  hiddenSearchResult: boolean
  showEditUserModal: boolean
  userResultList: userResultListSelectType
  searchLoading: boolean
  pagationStatus: BasicPagation
  workcells: workcellFormSelectType[]
  authorities: authorityFormSelectType[]
}

const mapStateToProps = (state: IConnectState) => {
  return {
    hiddenSearchResult: hiddenSearchResultSelector(state),
    showEditUserModal: showEditUserModalSelector(state),
    userResultList: userResultListSelector(state),
    pagationStatus: pagationStatusSelector(state),
    workcells: workcellFormSelector(state),
    authorities: authorityFormSelector(state),
    searchLoading: (state.loading.effects['admin/searchUserResult']) as boolean,
  }
}

const User: React.FC<UserProps> = props => {
  const {
    dispatch,
    hiddenSearchResult,
    showEditUserModal,
    userResultList,
    pagationStatus,
    searchLoading,
    workcells,
    authorities,
  } = props

  // 新增员工
  const handleCreateUser = () => {
    dispatch({ type: 'admin/changeEditUser', payload: null })
  }
  // 编辑员工
  const handleEditUser = (id: string) => {
    dispatch({ type: 'admin/changeEditUser', payload: id })
  }
  // 取消编辑
  const handleCancelEdit = () => {
    dispatch({ type: 'admin/clearEditUser' })
  }
  // 完成编辑
  const handleConfirm = (edit: EditUserType) => {
    dispatch({ type: 'admin/updateUser', payload: edit })
  }
  // 删除员工
  const handleRemoveUser = (id: string) => {
    dispatch({ type: 'admin/removeUser', payload: id })
  }

  // 处理提交查询结果
  const handleSearch = (serach: UserSearch) => {
    dispatch({ type: 'admin/changeUserAdvancedSearchContent', payload: undefinedToNull(serach) })
    // 清空之前查询条件
    dispatch({ type: 'admin/clearUserResultList' })
    // 查询
    dispatch({ type: 'admin/searchUserResult' })
  }
  // 处理清除结果
  const handleClear = () => {
    dispatch({ type: 'admin/changeUserAdvancedSearchContent', payload: null })
    // 清空之前查询条件
    dispatch({ type: 'admin/clearUserResultList' })
  }
  // 处理改变当前页
  const handleChangePage = (nextPage: number) => {
    const { page } = pagationStatus
    const step = nextPage - page > 0 ? nextPage - page : 0
    // 可能存在跳页的状况，所以要依次去选择
    for (let i = 1; i <= step; i += 1) {
      // 查询
      dispatch({ type: 'admin/searchUserResult', payload: (page + i) })
    }
  }
  let resultListDOM = (
    <Spin spinning={searchLoading === true}>
      <Empty description="点击搜索按钮进行筛选" />
    </Spin>
  )

  if (hiddenSearchResult === false) {
    resultListDOM = (
      <UserTable
        userResult={userResultList}
        loading={searchLoading}
        onEdit={handleEditUser}
        onRemove={handleRemoveUser}
        onChangePage={handleChangePage}
      />
    )
  }

  return (
    <div>
      <Button className={styles.createButton} type="primary" icon="plus" onClick={handleCreateUser}>新增员工</Button>
      <AdvancedSearch
        search={[
          ['WorkCell', 'workcellId', 'select', workcells.map(({ id, name }) => [name, id]), 'require'],
          ['工号', 'workerId', 'text'],
          ['姓名', 'workerName', 'text'],
          ['权限', 'authorityId', 'select', [['--全部--', '-1'], ...authorities.map(({ id, name }) => [name, id])]],
        ]}
        onClear={handleClear}
        onSearch={handleSearch}
      />
      <WhiteSpace />
      {resultListDOM}
      {showEditUserModal === true && (
        <UserModal
          onCancel={handleCancelEdit}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(User)
