/**
 * 生产线管理
 */

import React from 'react'
import { router } from 'umi'
import { Dispatch, AnyAction } from 'redux'
import { connect } from 'dva'
import { Spin, Empty } from 'antd'
import { AdvancedSearch, WhiteSpace } from '@/components'
import { IConnectState } from '@/models/connect'
import { ToolSearch } from '@/models/storekeeper'
import { undefinedToNull } from '@/utils'
import { BasicPagation } from '@/models/global'
import ToolTable from './components/ToolTable'
import {
  hiddenSearchResultSelector,
  ToolResultSelectType,
  toolResultSelector,
  pagationStatusSelector,
} from './selector'

interface ToolProps {
  dispatch: Dispatch<AnyAction>
  hiddenResult: boolean
  hiddenEditModal: boolean
  searchLoading: boolean
  toolResult: ToolResultSelectType
  pagationStatus: BasicPagation
}


const mapStateToProps = (state: IConnectState) => {
  return {
    hiddenResult: hiddenSearchResultSelector(state),
    searchLoading: state.loading.effects['storekeeper/searchToolResult'],
    toolResult: toolResultSelector(state),
    pagationStatus: pagationStatusSelector(state),
  }
}

const Tool: React.FC<ToolProps> = props => {
  const {
    dispatch,
    hiddenResult,
    searchLoading,
    toolResult,
    pagationStatus,
  } = props


  // 确认搜索
  const handleSearch = (toolSearch: ToolSearch) => {
    dispatch({ type: 'storekeeper/changeToolAdvancedSearchContent', payload: undefinedToNull(toolSearch) })
    dispatch({ type: 'storekeeper/clearToolSearchResult' })
    dispatch({ type: 'storekeeper/searchToolResult' })
  }
  // 取消搜索
  const handleCancel = () => {
    dispatch({ type: 'storekeeper/changeToolAdvancedSearchContent', payload: null })
    dispatch({ type: 'storekeeper/clearToolSearchResult' })
  }


  // 查看toolInfo
  const handleToolInfo = (id: string) => {
    dispatch({ type: 'storekeeper/changeToolInfoId', payload: id })
    router.push('/storekeeper/toolInfo')
  }


  // 更换页数
  const handleChangePage = (targetPage: number) => {
    // 可能存在跳页的情况
    const { page } = pagationStatus
    const step = targetPage - page > 0 ? targetPage - page : 0
    for (let i = 1; i <= step; i += 1) {
      dispatch({ type: 'storekeeper/searchToolResult', payload: (page + i) })
    }
  }


  let resultDOM = (
    <Spin spinning={searchLoading === true}>
      <Empty description="点击搜索按钮进行筛选" />
    </Spin >
  )
  if (hiddenResult === false) {
    resultDOM = (
      <ToolTable
        loading={searchLoading}
        toolResult={toolResult}
        onToolInfo={handleToolInfo}
        onChangePage={handleChangePage}
      />
    )
  }

  return (
    <div>
      <AdvancedSearch
        search={[
          ['FamilyNo', 'familyId', 'text'],
          ['ModelNo', 'modelId', 'text'],
          ['PartNo', 'partId', 'text'],
          ['夹具Code', 'code', 'text'],
          ['夹具名称', 'name', 'text'],
        ]}
        onSearch={handleSearch}
        onClear={handleCancel}
      />
      <WhiteSpace />
      { resultDOM }
    </div>
  )
}

export default connect(mapStateToProps)(Tool)
