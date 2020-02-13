/**
 * 人员管理
 */

import React from 'react'
import { Dispatch, AnyAction } from 'redux'
import { connect } from 'dva'
import { Button, Empty } from 'antd'
import { AdvancedSearch, WhiteSpace } from '@/components'
import { UserSearch } from '@/models/admin'
import { IConnectState } from '@/models/connect'
import { BasicPagation } from '@/models/global'
import { undefinedToNull } from '@/utils'
import UserTable from './components/userTable'
import {
  hiddenSearchResultSelector,
  userResultListSelectType,
  userResultListSelector,
  pagationStatusSelector,
} from './selector'

import styles from './index.less'

interface UserProps {
  dispatch: Dispatch<AnyAction>
  hiddenSearchResult: boolean
  userResultList: userResultListSelectType
  searchLoading: boolean
  pagationStatus: BasicPagation
}

const mapStateToProps = (state: IConnectState) => {
  return {
    hiddenSearchResult: hiddenSearchResultSelector(state),
    userResultList: userResultListSelector(state),
    pagationStatus: pagationStatusSelector(state),
    searchLoading: (state.loading.effects['admin/searchUserResult']) as boolean,
  }
}

const User: React.FC<UserProps> = props => {
  const {
    dispatch,
    hiddenSearchResult,
    userResultList,
    pagationStatus,
    searchLoading,
  } = props

  // 新增员工
  const handleCreateUser = () => {
    console.log('create')
  }
  // 编辑员工
  const handleEditUser = (id: string) => {
    console.log(id)
  }
  // 删除员工
  const handleRemoveUser = (id: string) => {
    console.log(id)
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
  const handleChangePage = (currentPage: number) => {
    const { page } = pagationStatus
    const step = currentPage - page > 0 ? currentPage - page : 0
    // 可能存在跳页的状况，所以要依次去选择
    for (let i = 1; i <= step; i += 1) {
      // 查询
      dispatch({ type: 'admin/searchUserResult', payload: (page + i) })
    }
  }

  let resultListDOM = (
    <Empty description="点击搜索按钮进行筛选" />
  )

  if (hiddenSearchResult === false) {
    resultListDOM = (
      <UserTable
        userResult={userResultList}
        loading={searchLoading}
        onEdit={(id) => console.log(id)}
        onRemove={(id) => console.log(id)}
        onChangePage={handleChangePage}
      />
    )
  }


  return (
    <div>
      <Button className={styles.createButton} type="primary" icon="plus" onClick={handleCreateUser}>新增员工</Button>
      <AdvancedSearch
        search={[
          ['WorkCell', 'workcellId', 'select', [['下沙一区', '1'], ['下沙二区', '2']], 'require'],
          ['工号', 'workerId', 'text'],
          ['姓名', 'workerName', 'text'],
          ['权限', 'authorityId', 'select', [['--全部--', '-1'], ['Admin', '1']]],
        ]}
        onClear={handleClear}
        onSearch={handleSearch}
      />
      <WhiteSpace />
      {resultListDOM}
    </div>
  )
}

export default connect(mapStateToProps)(User)
