/**
 * 夹具查询
 */
import React from 'react'
import { Dispatch, AnyAction } from 'redux'
import { router } from 'umi'
import { Button, Empty, Spin } from 'antd'
import { AdvancedSearch, WhiteSpace } from '@/components'
import { undefinedToNull } from '@/utils'
import { BasicPagation } from '@/models/global'
import { ToolSearch } from '@/models/worker'
import { IConnectState } from '@/models/connect'
import { connect } from 'dva'
import ToolTable from './components/ToolTable'
import {
  hiddenSearchResultSelector,
  pagationStatusSelector,
  toolSearchResultSelectType,
  toolSearchResultSelector,
} from './selector'


import styles from './index.less'

interface ToolProps {
  dispatch: Dispatch<AnyAction>
  hiddenSearchResult: boolean
  toolSearchResult: toolSearchResultSelectType
  pagationStatus: BasicPagation
  searchLoading: boolean
}

const mapStateToProps = (state: IConnectState) => {
  return {
    hiddenSearchResult: hiddenSearchResultSelector(state),
    pagationStatus: pagationStatusSelector(state),
    toolSearchResult: toolSearchResultSelector(state),
    searchLoading: (state.loading.effects['worker/searchToolResult']) as boolean,
  }
}

const Tool: React.FC<ToolProps> = props => {
  const {
    dispatch,
    hiddenSearchResult,
    pagationStatus,
    toolSearchResult,
    searchLoading,
  } = props

  // 归还夹具
  const handleRestore = () => {
    // 规划夹具页面
    router.push('/worker/restore')
  }

  // 清空表单数据
  const handleClear = () => {
    // 清空搜索数据
    dispatch({ type: 'worker/changeToolAdvancedSearchContent', payload: null })
    // 清空查询结果
    dispatch({ type: 'worker/clearToolSearchResult' })
  }
  // 搜索表单数据
  const handleSearch = (toolSearch: ToolSearch) => {
    // 更改查询条件
    dispatch({ type: 'worker/changeToolAdvancedSearchContent', payload: undefinedToNull(toolSearch) })
    // 清空查询结果
    dispatch({ type: 'worker/clearToolSearchResult' })
    // 查询
    dispatch({ type: 'worker/searchToolResult' })
  }

  // 处理翻页
  const handleChangePage = (nextPage: number) => {
    const { page } = pagationStatus
    const step = nextPage - page > 0 ? nextPage - page : 0
    // 可能存在跳页的状况，所以要依次去选择
    for (let i = 1; i <= step; i += 1) {
      // 查询
      dispatch({ type: 'worker/searchToolResult', payload: (page + i) })
    }
  }

  // 处理查看详情
  const handleToolInfo = (id: string) => {
    dispatch({ type: 'worker/changeToolInfoId', payload: id })
    router.push('/worker/toolinfo')
  }

  let resultListDOM = (
    <Spin spinning={searchLoading === true}>
      <Empty description="点击搜索按钮进行筛选" />
    </Spin>
  )
  if (hiddenSearchResult === false) {
    resultListDOM = (
      <ToolTable
        toolResult={toolSearchResult}
        loading={searchLoading}
        onToolInfo={handleToolInfo}
        onChangePage={handleChangePage}
      />
    )
  }

  return (
    <div>
      <Button className={styles.createButton} type="primary" icon="interaction" onClick={handleRestore}>归还夹具</Button>
      <AdvancedSearch
        interval={6}
        search={[
          ['FamilyNo', 'familyId', 'text'],
          ['ModelNo', 'modelId', 'text'],
          ['PartNo', 'partId', 'text'],
          ['Code', 'code', 'text'],
          ['Name', 'name', 'text'],
        ]}
        onClear={handleClear}
        onSearch={handleSearch}
      />
      <WhiteSpace />
      {resultListDOM}
    </div>
  )
}

export default connect(mapStateToProps)(Tool)
