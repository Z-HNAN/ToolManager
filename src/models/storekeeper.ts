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

export type RepairOrderType = {
  id: string
  name: string
  createTime: number
  remark: string
}

export type EditRepairOrderType = {
  id: string | null
  name: string
  remark: string
}

export const EMPTY_EDIT_REPAIRORDER: EditRepairOrderType = {
  id: null,
  name: '',
  remark: '',
}

export type ToolUnitRepairType = {
  id: string
  code: string
  location: string
  remark: string
  createTime: number
  workerName: string
  repairOrderId: string | null
}

export type RepairOrderMapUnitType = {
  // -1代表未进行关联的维修项
  [orderId: string]: ToolUnitRepairType[]
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
  repairOrders: RepairOrderType[]
  editRepairOrder: EditRepairOrderType | null
  repairOrderMapUnit: RepairOrderMapUnitType
  repairOrderInfoId: string | null
}

export interface IStorekeeperModelType {
  namespace: 'storekeeper'
  state: IStorekeeperModelState,
  reducers : {
    /* 改变正在编辑的productionline内容 */
    changeEditProductionline: Reducer<any>,
    /* 改变正在编辑的repairOrder */
    changeEditRepairOrder: Reducer<any>,
    /* 改变正在编辑的ToolUnitId */
    changeEditToolUnit: Reducer<any>,
    /* 改变productionline高级搜索内容 */
    changeProductionlineAdvancedSearchContent: Reducer<any>,
    /* 改变productionline高级搜索限制 */
    changeProductionlineAdvancedSearchLimit: Reducer<any>,
    /* 改变productionlineReslt查询结果 */
    changeProductionlineSearchResult: Reducer<any>,
    /* 改变repairOrder报修单 */
    changeRepairOrder: Reducer<any>,
    /* 改变repairOrder打开详情 */
    changeRepairOrderInfoId: Reducer<any>,
    /* 改变repairOrderMapUnit报修项集合 */
    changeRepairOrderMapUnit: Reducer<any>,
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
    /* 清除正在编辑的报修单 */
    clearEditRepairOrder: Reducer<any>,
    /* 清除正在编辑的夹具实体 */
    clearEditToolUnit: Reducer<any>,
    /* 清除productionlineResult查询结果 */
    clearProductionlineSearchResult: Reducer<any>,
    /* 清除repairOrderMapUnit报修项集合 */
    clearRepairOrderMapUnit: Reducer<any>,
    /* 清除toolResult查询结果 */
    clearToolSearchResult: Reducer<any>,
  },
  effects: {
    /* 将报修项增加倒报修单中 */
    addRepairToOrder: Effect,
    /* 检查toolInfo页面中id是否存在，否则跳转界面 */
    checkToolInfoId: Effect,
    /* 拉取repairOrder保修单 */
    fetchRepairOrder: Effect,
    /* 拉取保修项集合 */
    fetchRepairOrderMapUnit: Effect,
    /* 拉取夹具详情实体信息 */
    fetchToolInfoUnit: Effect,
    /* 初始化保修单 */
    initRepairOrder: Effect,
    /* 初始化repairOrder保修单 */
    initRepairOrderMapUnit: Effect,
    /* 查询生产线列表 */
    searchProductionlineResult: Effect,
    /* 查询夹具列表 */
    searchToolResult: Effect,
    /* 提交报修单 */
    submitRepairOrder: Effect,
    /* 根据现有搜索条件刷新生产线 */
    refreshProductionline: Effect,
    /* 刷新repair */
    refreshRepair: Effect,
    /* 删除生产线 */
    removeProductionline: Effect,
    /* 从保修单中移除 */
    removeRepairFromOrder: Effect,
    /* 删除报修单 */
    removeRepairOrder: Effect,
    /* 删除夹具 */
    removeToolUnit: Effect,
    /* 更新生产线 */
    updateEditProductionline: Effect,
    /* 更新repairOrder */
    updateRepairOrder: Effect,
    /* 更新夹具实体 */
    updateToolUnit: Effect,
  },
  subscriptions: {
    /* 初始化ToolInfo */
    initToolInfo: Subscription
    /* 初始化repairOrder */
    initRepairOrder: Subscription
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
    repairOrders: [],
    editRepairOrder: null,
    repairOrderMapUnit: {},
    repairOrderInfoId: null,
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
    changeEditRepairOrder(state: IStorekeeperModelState, { payload: id }) {
      // id为null,则为新增保修单
      if (isNil(id) === true) {
        return { ...state, editRepairOrder: { ...EMPTY_EDIT_REPAIRORDER } }
      }
      // 替换repairOrder中的内容，进行替换
      const currentRepairOrder = state.repairOrders
        .find(order => id === order.id) as RepairOrderType
      return { ...state, editRepairOrder: currentRepairOrder }
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
    /* eslint-disable-next-line max-len */
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
    /* eslint-disable-next-line max-len */
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
    changeRepairOrder(state: IStorekeeperModelState, { payload: repairOrders }) {
      return { ...state, repairOrders }
    },
    changeRepairOrderInfoId(state: IStorekeeperModelState, { payload: id }) {
      // id 可能为null
      return { ...state, repairOrderInfoId: id }
    },
    changeRepairOrderMapUnit(state: IStorekeeperModelState, { payload: { orderId, repairUnits } }) {
      // orderId如果为null,则是为关联报修单的报修项,此处替换为1
      if (isNil(orderId)) {
        return {
          ...state,
          repairOrderMapUnit: {
            ...state.repairOrderMapUnit,
            [-1]: repairUnits,
          },
        }
      }
      // orderId为对应保修单的id
      return {
        ...state,
        repairOrderMapUnit: {
          ...state.repairOrderMapUnit,
          [orderId]: repairUnits,
        },
      }
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
    /* eslint-disable-next-line max-len */
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
    clearEditRepairOrder(state: IStorekeeperModelState) {
      return { ...state, editRepairOrder: null }
    },
    clearEditToolUnit(state: IStorekeeperModelState) {
      return { ...state, editToolUnit: null }
    },
    clearProductionlineSearchResult(state: IStorekeeperModelState) {
      return { ...state, productionlineResult: null }
    },
    clearRepairOrderMapUnit(state: IStorekeeperModelState) {
      return { ...state, repairOrderMapUnit: {} }
    },
    clearToolSearchResult(state: IStorekeeperModelState) {
      return { ...state, toolResult: null }
    },
  },
  effects: {
    *addRepairToOrder({ payload: { repairUnitId, orderId } }, { call, put }) {
      // 1.移除维修项
      /* eslint-disable-next-line max-len */
      const result: OperationResultType = yield call(storekeeperService.addRepairToOrder, { repairUnitId, orderInfoId: orderId })
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 2.清空报修项
      yield put({ type: 'clearRepairOrderMapUnit' })
      // 3.重新拉取该repairUnit
      yield put({ type: 'fetchRepairOrderMapUnit', payload: orderId })
      // 4.重新拉取未关联的报修项
      yield put({ type: 'fetchRepairOrderMapUnit', payload: null })
    },
    *checkToolInfoId(_, { select }) {
      const id = yield select(
        (state: IConnectState) => state.storekeeper.toolInfoId,
      )
      // id不存在则进行跳转
      if (isNil(id)) {
        router.replace('/storekeeper/tool')
      }
    },
    *fetchRepairOrder(_, { call, put }) {
      const response = yield call(storekeeperService.fetchRepairOrder)
      // 过滤数据存储
      const orders: RepairOrderType[] = response.map((order: any) => ({
        id: order.id,
        name: order.name,
        createTime: order.createTime,
        remark: order.remark,
      }))
      // 存储
      yield put({ type: 'changeRepairOrder', payload: orders })
    },
    *fetchRepairOrderMapUnit({ payload: orderId }, { call, put }) {
      // orderId为null,则获取未关联报修单的报修项
      if (isNil(orderId)) {
        // 未关联保修单
        const response = yield call(storekeeperService.fetchRepairOrderMapUnit, { orderId })
        // 过滤数据并存储
        const repairUnits: ToolUnitRepairType[] = response.map((unit: any) => ({
          id: unit.id,
          code: unit.code,
          location: unit.location,
          remark: unit.remark,
          createTime: unit.createTime,
          workerName: unit.workerName,
          repairOrderId: null,
        }))
        // 存储
        yield put({ type: 'changeRepairOrderMapUnit', payload: { orderId, repairUnits } })
      } else {
        // 已关联保修单
        const response = yield call(storekeeperService.fetchRepairOrderMapUnit, { orderId })
        // 过滤数据并存储
        const repairUnits: ToolUnitRepairType[] = response.map((unit: any) => ({
          id: unit.id,
          code: unit.code,
          location: unit.location,
          remark: unit.remark,
          createTime: unit.createTime,
          workerName: unit.workerName,
          repairOrderId: orderId,
        }))
        // 存储
        yield put({ type: 'changeRepairOrderMapUnit', payload: { orderId, repairUnits } })
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
    *initRepairOrder(_, { put, select }) {
      const orders = yield select(
        (state: IConnectState) => state.storekeeper.repairOrders,
      )
      // 当前账单数为0，则去拉取一次
      if (orders.length === 0) {
        yield put({ type: 'fetchRepairOrder' })
      }
    },
    *initRepairOrderMapUnit({ payload: orderId }, { put, select }) {
      const repairUnits = yield select(
        (state: IConnectState) => state.storekeeper.repairOrderMapUnit[orderId],
      )
      // 如果该不存在，则需重新拉取
      if (isNil(repairUnits)) {
        yield put({ type: 'fetchRepairOrderMapUnit', payload: orderId })
      }
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
    *searchToolResult({ payload: nextPage }, { call, put, select }) {
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
    *submitRepairOrder({ payload: orderId }, { call, put }) {
      const result: OperationResultType = yield call(storekeeperService.submitOrder, { orderId })
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 删除表单
      yield put({ type: 'changeRepairOrderInfoId', payload: null })
      // 刷新该页
      yield put({ type: 'refreshRepair' })
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
    *refreshRepair(_, { put }) {
      // 清除repairUnitMap集合
      yield put({ type: 'clearRepairOrderMapUnit' })
      // 重新获取报修单
      yield put({ type: 'fetchRepairOrder' })
      // 重新拉取未关联的报修项
      yield put({ type: 'fetchRepairOrderMapUnit', payload: null })
    },
    *removeRepairFromOrder({ payload: id }, { call, put, select }) {
      // 0.获取当前的orderInfoId
      const orderInfoId = yield select(
        (state: IConnectState) => state.storekeeper.repairOrderInfoId as string,
      )
      // 1.移除维修项
      /* eslint-disable-next-line max-len */
      const result: OperationResultType = yield call(storekeeperService.removeRepairFromOrder, { repairUnitId: id, orderInfoId })
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 2.清空报修项
      yield put({ type: 'clearRepairOrderMapUnit' })
      // 3.重新拉取该repairUnit
      yield put({ type: 'fetchRepairOrderMapUnit', payload: orderInfoId })
      // 4.重新拉取未关联的报修项
      yield put({ type: 'fetchRepairOrderMapUnit', payload: null })
    },
    *removeProductionline({ payload: id }, { call, put }) {
      /* eslint-disable-next-line max-len */
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
    *removeRepairOrder({ payload: id }, { call, put, select }) {
      // 获取当前的editRepairOrderId
      const repairOrderId = yield select(
        (state: IConnectState) => state.storekeeper.editRepairOrder as EditRepairOrderType,
      )
      const result: OperationResultType = yield call(storekeeperService.removeRepairOrder, { id: repairOrderId })
      // 删除失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 刷新当前页
      yield put({ type: 'refreshRepair' })
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
        /* eslint-disable-next-line max-len */
        (state: IConnectState) => (state.storekeeper.editProductionline as EditProductionlineType).id,
      )
      /* eslint-disable-next-line max-len */
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
    *updateRepairOrder({ payload: editRepairOrder }, { call, put, select }) {
      const id = yield select(
        (state: IConnectState) => (state.storekeeper.editRepairOrder as EditRepairOrderType).id,
      )
      const result: OperationResultType = yield call(storekeeperService.updateRepairOrder, { ...editRepairOrder, id })
      // 更新失败
      if (result.success === false) {
        yield put({ type: 'global/changeDialog', payload: { type: 'warning', msg: result.msg } })
        return
      }
      // 关闭modal
      yield put({ type: 'clearEditRepairOrder' })
      // 刷新当前页
      yield put({ type: 'refreshRepair' })
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
    initRepairOrder({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/storekeeper/repair') {
          // 初始化repairOrder
          dispatch({ type: 'initRepairOrder' })
          // 初始化未关联保修单的报修项
          dispatch({ type: 'fetchRepairOrderMapUnit', payload: null })
        }
      })
    },
  },
}

export default StorekeeperModel
