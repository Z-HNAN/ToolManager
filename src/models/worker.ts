import { Reducer } from 'redux'
import { router } from 'umi'
import { Subscription, Effect } from 'dva'
import { isNil } from 'lodash'
import * as wokerService from '@/services/worker'
import { BorrowModalFormParams } from '@/pages/worker/toolinfo/components/BorrowModal'
import { RepairModalFormParams } from '@/pages/worker/toolinfo/components/RepairModal'
import { BasicAdvancedSerch } from './global'
import { IConnectState } from './connect.d'
import { OperationResultType } from '@/utils/request'

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
  useFor: string
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

/**
 * 夹具借出信息
 */
export type ToolBorrowInfoType = {
  id: string // 借用id
  userId: string // 借用员工id
  workerId: string // 借用员工工号
  workerName: string // 借用员工姓名
  restoreTime: number // 归还时间
  productionline: string // 所在生产线
}

/**
 * 夹具对应的实体，每一个小单元存在的夹具
 */
export type ToolInfoUnitType = {
  id: string
  code: string
  status: 'normal' | 'borrow' | 'repair', // 正常（可借）， 借出， 检修中
  useCount: number
  checkCount: number
  repairCount: number
  billNo: string
  createTime: number
  lastUseTime: number
  location: string
  toolBorrowInfo: ToolBorrowInfoType | null
}

export interface IWorkerModelState {
  toolAdvancedSearch: ToolAdvancedSearch
  toolSearchResult: ToolSearchResultType | null
  toolInfoId: string | null,
  toolInfoUnitList: ToolInfoUnitType[]
  toolUnitBorrowId: null | string
  toolUnitRepairId: null | string
}

export interface IWorkerModelType {
  namespace: 'worker'
  state: IWorkerModelState
  reducers: {
    /* 改变toolSearch查询内容 */
    changeToolAdvancedSearchContent: Reducer<any>,
    /* 改变toolSearch查询分页 */
    changeToolAdvancedSearchLimit: Reducer<any>,
    /* 改变查看tool详情的info */
    changeToolInfoId: Reducer<any>,
    /* 改变toolInfoUnit实体结果 */
    changeToolInfoUnit: Reducer<any>,
    /* 更改toolSearch查询结果 */
    changeToolSearchResult: Reducer<any>,
    /* 更改tool实体借用id */
    changeToolUnitBorrowId: Reducer<any>,
    /* 更改tool实体报修id */
    changeToolUnitRepairId: Reducer<any>,
    /* 清除toolSearch查询结果 */
    clearToolSearchResult: Reducer<any>,
  }
  effects: {
    /* 获取夹具详情的实体 */
    fetchToolInfoUnit: Effect,
    /* 检查toolInfoId是否存在 */
    checkToolInfoId: Effect,
    /* 查询toolSearch结果 */
    searchToolResult: Effect,
    /* 夹具借用 */
    toolUnitBorrow: Effect,
    /* 夹具报修 */
    toolUnitRepair: Effect,
  },
  subscriptions: {
    /* 初始化toolInfo, 1.检查toolInfoId是否存在 2.拉取夹具实体 */
    initToolInfo: Subscription,
  }
}

const WorkerModel: IWorkerModelType = {
  namespace: 'worker',
  state: {
    toolAdvancedSearch: { page: 0, size: 10, content: null },
    toolSearchResult: null,
    toolInfoId: null,
    toolInfoUnitList: [],
    toolUnitBorrowId: null,
    toolUnitRepairId: null,
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
    changeToolInfoId(state: IWorkerModelState, { payload: id }) {
      // toolInfoId 可能为null
      return { ...state, toolInfoId: id }
    },
    changeToolInfoUnit(state: IWorkerModelState, { payload: units }) {
      // units 可能为空数组
      return { ...state, toolInfoUnitList: units }
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
    changeToolUnitBorrowId(state: IWorkerModelState, { payload: id }) {
      // id可能为null
      return { ...state, toolUnitBorrowId: id }
    },
    changeToolUnitRepairId(state: IWorkerModelState, { payload: id }) {
      // id可能为null
      return { ...state, toolUnitRepairId: id }
    },
    clearToolSearchResult(state: IWorkerModelState) {
      return { ...state, toolSearchResult: null }
    },
  },
  effects: {
    *fetchToolInfoUnit(_, { call, put, select }) {
      const toolInfoId = yield select((state: IConnectState) => state.worker.toolInfoId)
      // 处理toolInfoId 为null的异常情况
      if (isNil(toolInfoId)) {
        return
      }

      // 获取tool实体
      const response = yield call(wokerService.fetchToolUnit, {
        toolId: toolInfoId,
      })

      // 过滤数据
      const units: ToolInfoUnitType[] = response.map((unit: any) => ({
        id: unit.id,
        code: unit.code,
        status: unit.status,
        useCount: unit.useCount,
        checkCount: unit.checkCount,
        repairCount: unit.repairCount,
        billNo: unit.billNo,
        createTime: unit.createTime,
        lastUseTime: unit.lastUseTime,
        location: unit.location,
        toolBorrowInfo: null,
      }))

      // 依次检查,获取tool中借出的详情
      const toolBorrowPromise = []
      for (let i = 0; i < units.length; i += 1) {
        if (units[i].status === 'borrow') {
          toolBorrowPromise.push(
            call(wokerService.fetchToolBorrow, {
              toolId: toolInfoId,
            }),
          )
        }
      }
      // 依次检查,解析tool中借出的详情
      for (let i = 0; i < units.length; i += 1) {
        if (units[i].status === 'borrow') {
          const toolBorrowResponse: ToolBorrowInfoType = yield toolBorrowPromise.shift()
          units[i] = {
            ...units[i],
            toolBorrowInfo: toolBorrowResponse,
          }
        }
      }

      // 存储toolInfoUnit
      yield put({ type: 'changeToolInfoUnit', payload: units })
    },
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
      const { size, content } = toolAdvancedSearch

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
    *checkToolInfoId(_, { select }) {
      const id = yield select(
        (state: IConnectState) => state.worker.toolInfoId,
      )
      // id不存在则进行跳转
      if (isNil(id)) {
        router.replace('/worker/tool')
      }
    },
    *toolUnitBorrow({ payload }, { call, put }) {
      const { id, restoreTime, productionLineId } = payload as BorrowModalFormParams
      const result: OperationResultType = yield call(wokerService.toolUnitBorrow, { id, restoreTime, productionLineId })
      if (result.success === false) {
        // 借用失败提示用户
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
      }
      // 取消toolId
      yield put({ type: 'changeToolUnitBorrowId', payload: null })
      // 刷新列表
      yield put({ type: 'fetchToolInfoUnit' })
    },
    *toolUnitRepair({ payload }, { call, put }) {
      const { id, remark } = payload as RepairModalFormParams
      const result: OperationResultType = yield call(wokerService.toolUnitRepair, { id, remark })
      if (result.success === false) {
        // 借用失败提示用户
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
      }
      // 维护成功，取消toolId
      yield put({ type: 'changeToolUnitRepairId', payload: null })
      // 刷新列表
      yield put({ type: 'fetchToolInfoUnit' })
    },
  },
  subscriptions: {
    initToolInfo({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/worker/toolinfo') {
          // toolinfo页面, 强绑定了数据toolInfoId，如果没有则退出
          dispatch({ type: 'checkToolInfoId' })
          // 获取夹具实体信息
          dispatch({ type: 'fetchToolInfoUnit' })
        }
      })
    },
  },
}

export default WorkerModel
