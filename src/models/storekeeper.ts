import { Reducer } from 'redux'
import { Subscription, Effect } from 'dva'
import { router } from 'umi'
import { isNil } from 'lodash'
import { IConnectState } from './connect.d'
import * as storekeeperService from '@/services/storekeeper'
import { EditProductionlineType, EMPTY_EDIT_PRODUCTIONLINE } from '@/pages/storekeeper/productionline/index'
import { BasicAdvancedSerch } from './global'
import { OperationResultType } from '@/utils/request'

/**
 * 生产新搜索类型
 */
export type ProductionlineSearch = {
  name?: string
}

export type ProductionlineAdvancedSearch = BasicAdvancedSerch<ProductionlineSearch>

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

export type ToolResultType = {
  total: number
  list: ToolType[]
}

/**
 * 夹具实体类型
 */
export type ToolUnitType = {
  id: string
  code: string
  status: 'normal' | 'borrow' | 'repair'
  location: string
  createTime: number
  billId: string
}

/**
 * 生产线类型
 */
export type ProductionlineType = {
  id: string
  name: string
  remark: string
}

export type ProductionlineResultType = {
  total: number
  list: ProductionlineType[]
}

export type EditToolUnitType = {
  id: string | null
  sequence: number
  location: string
  billId: string
}

export const EMPTY_EDIT_TOOLUNIT: EditToolUnitType = {
  id: null,
  sequence: 1,
  location: '',
  billId: '',
}

export interface IStorekeeperModelState {
  editProductionline: EditProductionlineType | null
  productionlineAdvancedSearch: ProductionlineAdvancedSearch
  productionlineResult: ProductionlineResultType | null
  toolAdvancedSearch: ToolAdvancedSearch
  toolResult: ToolResultType | null
  toolInfoId: string | null
  toolInfoUnits: ToolUnitType[] | null
  editToolUnit: EditToolUnitType | null
}

export interface IStorekeeperModelType {
  namespace: 'storekeeper'
  state: IStorekeeperModelState,
  reducers : {
    /* 改变正在编辑的productionline内容 */
    changeEditProductionline: Reducer<any>,
    /* 改变正在编辑的ToolUnitId */
    changeEditToolUnit: Reducer<any>,
    /* 改变productionline高级搜索内容 */
    changeProductionlineAdvancedSearchContent: Reducer<any>,
    /* 改变productionline高级搜索限制 */
    changeProductionlineAdvancedSearchLimit: Reducer<any>,
    /* 改变productionlineReslt查询结果 */
    changeProductionlineSearchResult: Reducer<any>,
    /* 改变Tool高级搜索内容 */
    changeToolAdvancedSearchContent: Reducer<any>,
    /* 改变Tool高级搜索限制 */
    changeToolAdvancedSearchLimit: Reducer<any>,
    /* 改变Tool查询结果 */
    changeToolSearchResult: Reducer<any>,
    /* 改变查看详情的toolId */
    changeToolInfoId: Reducer<any>,
    /* 改变查看详情的tool实体 */
    changeToolInfoUnits: Reducer<any>,
    /* 清除正在编辑的生产线 */
    clearEditProductionline: Reducer<any>,
    /* 清除正在编辑的夹具实体 */
    clearEditToolUnit: Reducer<any>,
    /* 清除productionlineResult查询结果 */
    clearProductionlineSearchResult: Reducer<any>,
    /* 清除toolResult查询结果 */
    clearToolSearchResult: Reducer<any>,
  },
  effects: {
    /* 检查toolInfo页面中id是否存在，否则跳转界面 */
    checkToolInfoId: Effect,
    /* 拉取夹具详情实体信息 */
    fetchToolInfoUnit: Effect,
    /* 查询生产线列表 */
    searchProductionlineResult: Effect,
    /* 查询夹具列表 */
    searchToolResult: Effect,
    /* 根据现有搜索条件刷新生产线 */
    refreshProductionline: Effect,
    /* 删除生产线 */
    removeProductionline: Effect,
    /* 删除夹具 */
    removeToolUnit: Effect,
    /* 更新生产线 */
    updateEditProductionline: Effect,
    /* 更新夹具实体 */
    updateToolUnit: Effect,
  },
  subscriptions: {
    /* 初始化ToolInfo */
    initToolInfo: Subscription
  },
}

const StorekeeperModel: IStorekeeperModelType = {
  namespace: 'storekeeper',
  state: {
    editProductionline: null,
    productionlineAdvancedSearch: { page: 0, size: 10, content: null },
    productionlineResult: null,
    toolAdvancedSearch: { page: 0, size: 10, content: null },
    toolResult: null,
    toolInfoId: null,
    toolInfoUnits: null,
    editToolUnit: null,
  },
  reducers: {
    changeEditProductionline(state: IStorekeeperModelState, { payload: id }) {
      // id为null,则为新增生产线
      if (isNil(id) === true) {
        return { ...state, editProductionline: { ...EMPTY_EDIT_PRODUCTIONLINE } }
      }
      // 替换productionline中的内容，进行替换
      const selectProductionline = (state.productionlineResult as ProductionlineResultType)
        .list.find(productionline => id === productionline.id) as ProductionlineType
      return { ...state, editProductionline: selectProductionline }
    },
    changeEditToolUnit(state: IStorekeeperModelState, { payload: id }) {
      // id为null,则为新增夹具实体
      if (isNil(id) === true) {
        return { ...state, editToolUnit: { ...EMPTY_EDIT_TOOLUNIT } }
      }
      // 替换正在编辑的内容
      const selectToolUnit = (state.toolInfoUnits as ToolUnitType[])
        .find(unit => unit.id === id) as ToolUnitType
      // 正则匹配sequence, 捕获出code中最后序号 EF897-X-1, 捕获为1, 捕获失败给0
      const sequence = Number(selectToolUnit.code.split(/(?:-(\d+))$/g)[1] || '0')
      return {
        ...state,
        editToolUnit: {
          id: selectToolUnit.id,
          sequence,
          location: selectToolUnit.location,
          billId: selectToolUnit.billId,
        },
      }
    },
    changeProductionlineAdvancedSearchContent(state: IStorekeeperModelState, { payload: productionlineSearch }) {
      const productionlineAdvancedSearch: ProductionlineAdvancedSearch = {
        page: 0, size: 10, content: productionlineSearch,
      }
      return { ...state, productionlineAdvancedSearch }
    },
    changeProductionlineAdvancedSearchLimit(state: IStorekeeperModelState, { payload }) {
      const { page, size } = payload
      const productionlineAdvancedSearch: ProductionlineAdvancedSearch = {
        page, size, content: state.productionlineAdvancedSearch.content,
      }
      return { ...state, productionlineAdvancedSearch }
    },
    changeProductionlineSearchResult(state: IStorekeeperModelState, { payload: { total, list, append = false } }) {
      let { productionlineResult } = state

      // 第一次填充
      if (isNil(productionlineResult)) {
        productionlineResult = { total, list }
        return { ...state, productionlineResult }
      }

      // 替换数据
      if (append === false) {
        productionlineResult = { total, list }
        return { ...state, productionlineResult }
      }

      // 追加数据
      productionlineResult = {
        total,
        list: [
          ...productionlineResult.list,
          ...list,
        ],
      }
      return { ...state, productionlineResult }
    },
    changeToolAdvancedSearchContent(state: IStorekeeperModelState, { payload: toolSearch }) {
      const toolAdvancedSearch: ToolAdvancedSearch = {
        page: 0, size: 10, content: toolSearch,
      }
      return { ...state, toolAdvancedSearch }
    },
    changeToolAdvancedSearchLimit(state: IStorekeeperModelState, { payload }) {
      const { page, size } = payload
      const toolAdvancedSearch: ToolAdvancedSearch = {
        page, size, content: state.toolAdvancedSearch.content,
      }
      return { ...state, toolAdvancedSearch }
    },
    changeToolInfoId(state: IStorekeeperModelState, { payload: id }) {
      // id可能为null
      return { ...state, toolInfoId: id }
    },
    changeToolInfoUnits(state: IStorekeeperModelState, { payload: toolInfoUnits }) {
      // toolInfoUnits可能为null
      return { ...state, toolInfoUnits }
    },
    changeToolSearchResult(state: IStorekeeperModelState, { payload: { total, list, append = false } }) {
      let { toolResult } = state

      // 第一次查询
      if (isNil(toolResult)) {
        toolResult = { total, list }
        return { ...state, toolResult }
      }
      // 替换数据
      if (append === false) {
        toolResult = { total, list }
        return { ...state, toolResult }
      }
      // 追加数据
      toolResult = {
        total,
        list: [
          ...toolResult.list,
          ...list,
        ],
      }
      return { ...state, toolResult }
    },
    clearEditProductionline(state: IStorekeeperModelState) {
      return { ...state, editProductionline: null }
    },
    clearEditToolUnit(state: IStorekeeperModelState) {
      return { ...state, editToolUnit: null }
    },
    clearProductionlineSearchResult(state: IStorekeeperModelState) {
      return { ...state, productionlineResult: null }
    },
    clearToolSearchResult(state: IStorekeeperModelState) {
      return { ...state, toolResult: null }
    },
  },
  effects: {
    *checkToolInfoId(_, { select }) {
      const id = yield select(
        (state: IConnectState) => state.storekeeper.toolInfoId,
      )
      // id不存在则进行跳转
      if (isNil(id)) {
        router.replace('/storekeeper/tool')
      }
    },
    *fetchToolInfoUnit(_, { call, put, select }) {
      const toolInfoId = yield select(
        (state: IConnectState) => state.storekeeper.toolInfoId,
      )
      // toolInfoId判断
      if (isNil(toolInfoId)) {
        return
      }
      
      // 获取toolUnit
      const response = yield call(storekeeperService.fetchToolUnit, {
        toolId: toolInfoId,
      })

      // 过滤数据存储
      const units: ToolUnitType[] = response.map((unit: any) => ({
        id: unit.id,
        code: unit.code,
        status: unit.status,
        location: unit.location,
        createTime: unit.createTime,
        billId: unit.billId,
      }))

      // 存储数据
      yield put({ type: 'changeToolInfoUnits', payload: units })
    },
    *searchProductionlineResult({ payload: nextPage }, { call, put, select }) {
      const [
        productionlineAdvancedSearch,
        productionlineResult,
      ]: [ProductionlineAdvancedSearch, ProductionlineResultType | null] = yield select(
        (state: IConnectState) => [
          state.storekeeper.productionlineAdvancedSearch,
          state.storekeeper.productionlineResult,
        ],
      )
      const { size, content } = productionlineAdvancedSearch

      // 没有查询条件，退出
      if (isNil(content)) {
        return
      }

      // 第一次查询，默认第一页
      if (isNil(productionlineResult)) {
        const response = yield call(storekeeperService.fetchProductionline, {
          ...content,
          startIndex: 1,
          pageSize: size,
        })
        // 存储productionSearchResult
        yield put({ type: 'changeProductionlineSearchResult', payload: { total: response.total, list: response.list, append: false } })
        // 更改查询条件
        yield put({ type: 'changeProductionlineAdvancedSearchLimit', payload: { page: 1, size } })
      }

      // 追加查询，计算startIndex
      const { total, list } = productionlineResult as ProductionlineResultType
      const startIndex = (nextPage - 1) * size
      if (list.length >= total) {
        return
      }
      const response = yield call(storekeeperService.fetchProductionline, {
        ...content,
        startIndex,
        pageSize: size,
      })
      // 存储productionSearchResult
      yield put({ type: 'changeProductionlineSearchResult', payload: { total: response.total, list: response.list, append: true } })
      // 更改查询条件
      yield put({ type: 'changeProductionlineAdvancedSearchLimit', payload: { page: nextPage, size } })
    },
    *searchToolResult({ payload: nextPage }, { call, put, select } ) {
      const [
        toolAdvancedSearch,
        toolResult,
      ]: [ToolAdvancedSearch, ToolResultType | null] = yield select(
        (state: IConnectState) => [
          state.storekeeper.toolAdvancedSearch,
          state.storekeeper.toolResult,
        ],
      )
      const { size, content } = toolAdvancedSearch

      // 没有查询条件，退出
      if (isNil(content)) {
        return
      }

      // 第一次查询，默认第一页
      if (isNil(toolResult)) {
        const response = yield call(storekeeperService.fetchTool, {
          ...content,
          startIndex: 1,
          pageSize: size,
        })
        // 存储productionSearchResult
        yield put({ type: 'changeToolSearchResult', payload: { total: response.total, list: response.list, append: false } })
        // 更改查询条件
        yield put({ type: 'changeToolAdvancedSearchLimit', payload: { page: 1, size } })
      }

      // 追加查询，计算startIndex
      const { total, list } = toolResult as ToolResultType
      const startIndex = (nextPage - 1) * size
      if (list.length >= total) {
        return
      }
      const response = yield call(storekeeperService.fetchTool, {
        ...content,
        startIndex,
        pageSize: size,
      })
      // 存储productionSearchResult
      yield put({ type: 'changeToolSearchResult', payload: { total: response.total, list: response.list, append: true } })
      // 更改查询条件
      yield put({ type: 'changeToolAdvancedSearchLimit', payload: { page: nextPage, size } })
    },
    *refreshProductionline(_, { put, select }) {
      const advancedSarch = yield select(
        (state: IConnectState) => state.storekeeper.productionlineAdvancedSearch.content,
      )
      // 无条件则放弃刷新
      if (isNil(advancedSarch) === false) {
        // 1.重新填充条件
        yield put({ type: 'changeProductionlineAdvancedSearchContent', payload: advancedSarch })
        // 2.删除上一次搜索结果
        yield put({ type: 'clearProductionlineSearchResult' })
        // 3.搜索
        yield put({ type: 'searchProductionlineResult' })
      }
    },
    *removeProductionline({ payload: id }, { call, put }) {
      const result: OperationResultType = yield call(storekeeperService.removeProductionline, { id })
      // 删除失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 关闭modal
      yield put({ type: 'clearEditProductionline' })
      // 重新获取productionline
      yield put({ type: 'refreshProductionline' })
    },
    *removeToolUnit({ payload: id }, { call, put }) {
      const result: OperationResultType = yield call(storekeeperService.removeToolUnit, { id })
      // 删除失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 关闭modal
      yield put({ type: 'clearEditToolUnit' })
      // 重新获取toolUnit
      yield put({ type: 'fetchToolInfoUnit' })
    },
    *updateEditProductionline({ payload: editProductionline }, { call, put, select }) {
      const id = yield select(
        (state: IConnectState) => (state.storekeeper.editProductionline as EditProductionlineType).id,
      )
      const result: OperationResultType = yield call(storekeeperService.updateProductionline, { ...editProductionline, id })
      // 更新失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 关闭modal
      yield put({ type: 'clearEditProductionline' })
      // 重新获取productionline
      yield put({ type: 'refreshProductionline' })
    },
    *updateToolUnit({ payload: editToolUnit }, { call, put, select }) {
      const toolId = yield select(
        (state: IConnectState) => state.storekeeper.toolInfoId as string,
      )
      const currentTool = yield select(
        (state: IConnectState) => (state.storekeeper.toolResult as ToolResultType).list
          .find(({ id }) => id === toolId),
      )
      
      const result: OperationResultType = yield call(storekeeperService.updateToolUnit, {
        ...editToolUnit,
        id: toolId,
        code: currentTool.code,
      })
      // 更新失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 关闭modal
      yield put({ type: 'clearEditToolUnit' })
      // 重新获取toolUnit
      yield put({ type: 'fetchToolInfoUnit' })
    },
  },
  subscriptions: {
    initToolInfo({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/storekeeper/toolInfo') {
          // toolinfo页面, 强绑定了数据toolInfoId，如果没有则退出
          dispatch({ type: 'checkToolInfoId' })
          // 获取夹具实体信息
          dispatch({ type: 'fetchToolInfoUnit' })
        }
      })
    },
  },
}

export default StorekeeperModel
