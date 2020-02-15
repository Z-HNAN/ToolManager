import { Reducer } from 'redux'
import { Subscription, Effect } from 'dva'
import { isNil } from 'lodash'
import * as wokerService from '@/services/worker'
import { BasicAdvancedSerch } from './global'
import { IConnectState } from './connect.d'

/**
 * 夹具搜索类型
 */
export type ToolSearch = {
  familyId?: string
  modelId?: string
  partId?: string
  code?: string
  name?: string
}

export type ToolAdvancedSearch = BasicAdvancedSerch<ToolSearch>

/**
 * 夹具类 类型
 */
export type ToolType = {
  id: string
  code: string
  name: string
  familyId: string
  modelId: string
  partId: string
  userFor: string
  UPL: number
  PMPeriod: number
  img: string
  nowCount: number
  totalCount: number
}

export type ToolSearchResultType = {
  total: number
  list: ToolType[]
}

export interface IWorkerModelState {
  toolAdvancedSearch: ToolAdvancedSearch
  toolSearchResult: ToolSearchResultType | null
}

export interface IWorkerModelType {
  namespace: 'worker'
  state: IWorkerModelState
  reducers: {
    /* 改变toolSearch查询内容 */
    changeToolAdvancedSearchContent: Reducer<any>,
    /* 改变toolSearch查询分页 */
    changeToolAdvancedSearchLimit: Reducer<any>,
    /* 更改toolSearch查询结果 */
    changeToolSearchResult: Reducer<any>,
    /* 清除toolSearch查询结果 */
    clearToolSearchResult: Reducer<any>,
  }
  effects: {
    /* 查询toolSearch结果 */
    searchToolResult: Effect,
  },
  subscriptions: {}
}

const WorkerModel: IWorkerModelType = {
  namespace: 'worker',
  state: {
    toolAdvancedSearch: { page: 0, size: 10, content: null },
    toolSearchResult: null,
  },
  reducers: {
    changeToolAdvancedSearchContent(state: IWorkerModelState, { payload: toolSearch }) {
      // 重置查询结果
      const toolAdvancedSearch: ToolAdvancedSearch = {
        page: 0, size: 10, content: toolSearch,
      }
      return { ...state, toolAdvancedSearch }
    },
    changeToolAdvancedSearchLimit(state: IWorkerModelState, { payload }) {
      const { page, size } = payload
      // 更改查询条件
      const toolAdvancedSearch: ToolAdvancedSearch = {
        page, size, content: state.toolAdvancedSearch.content,
      }
      return { ...state, toolAdvancedSearch }
    },
    changeToolSearchResult(state: IWorkerModelState, { payload: { list, total, append = false } }) {
      let { toolSearchResult } = state

      // 第一次填充
      if (isNil(toolSearchResult)) {
        toolSearchResult = { total, list }
        return { ...state, toolSearchResult }
      }
      // 替换数据
      if (append === false) {
        toolSearchResult = { total, list }
        return { ...state, toolSearchResult }
      }

      // 追加数据
      toolSearchResult = {
        total,
        list: [
          ...toolSearchResult.list,
          ...list,
        ],
      }
      return { ...state, toolSearchResult }
    },
    clearToolSearchResult(state: IWorkerModelState) {
      return { ...state, toolSearchResult: null }
    },
  },
  effects: {
    *searchToolResult({ payload: nextPage }, { call, put, select }) {
      // nextPage此业务中保证递增增长，如果在pagation中跳跃，则会自动发送中间的页数
      const [
        toolAdvancedSearch,
        toolSearchResult,
      ]: [ToolAdvancedSearch, ToolSearchResultType | null] = yield select(
        (state: IConnectState) => [
          state.worker.toolAdvancedSearch,
          state.worker.toolSearchResult,
        ],
      )
      const { page, size, content } = toolAdvancedSearch

      // 没有查询条件，退出
      if (isNil(content)) {
        return
      }
      
      // 第一次查询，查询第一页
      if (isNil(toolSearchResult)) {
        const response = yield call(wokerService.fetchTool, {
          ...content,
          startIndex: 1,
          pageSize: size,
        })
        // 存储toolSearchResult
        yield put({ type: 'changeToolSearchResult', payload: { total: response.total, list: response.list, append: false } })
        // 更改高级查询约束
        yield put({ type: 'changeToolAdvancedSearchLimit', payload: { page: 1, size } })
        return
      }

      // 追加查询，计算startIndx
      const { total, list } = toolSearchResult
      const startIndex = (nextPage - 1) * size

      // 已经查询完所有
      if (list.length >= total) {
        return
      }

      // 继续向后查询
      const response = yield call(wokerService.fetchTool, {
        ...content,
        startIndex,
        pageSize: size,
      })
      // 存储toolSearchResult
      yield put({ type: 'changeToolSearchResult', payload: { total: response.total, list: response.list, append: true } })
      // 更改高级查询约束
      yield put({ type: 'changeToolAdvancedSearchLimit', payload: { page: nextPage, size } })
    },
  },
  subscriptions: {},
}

export default WorkerModel
