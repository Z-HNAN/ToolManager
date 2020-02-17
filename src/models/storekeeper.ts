import { Reducer } from 'redux'
import { Subscription, Effect } from 'dva'
import { isNil } from 'lodash'
import { IConnectState } from './connect.d'
import * as storekeeperService from '@/services/storekeeper'
import { EditProductionlineType, EMPTY_EDIT_PRODUCTIONLINE } from '@/pages/storekeeper/productionline/index'
import { BasicAdvancedSerch } from './global'
import { OperationResultType } from '@/utils/request'
import { EMPTY_EDIT_USER } from '@/pages/admin/user'

/**
 * 生产新搜索类型
 */
export type ProductionlineSearch = {
  name?: string
}

export type ProductionlineAdvancedSearch = BasicAdvancedSerch<ProductionlineSearch>

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

export interface IStorekeeperModelState {
  editProductionline: EditProductionlineType | null
  productionlineAdvancedSearch: ProductionlineAdvancedSearch
  productionlineResult: ProductionlineResultType | null
}

export interface IStorekeeperModelType {
  namespace: 'storekeeper'
  state: IStorekeeperModelState,
  reducers : {
    /* 改变正在编辑的productionline内容 */
    changeEditProductionline: Reducer<any>,
    /* 改变productionline高级搜索内容 */
    changeProductionlineAdvancedSearchContent: Reducer<any>,
    /* 改变productionline高级搜索限制 */
    changeProductionlineAdvancedSearchLimit: Reducer<any>,
    /* 改变productionlineReslt查询结果 */
    changeProductionlineSearchResult: Reducer<any>,
    /* 清除正在编辑的生产线 */
    clearEditProductionline: Reducer<any>,
    /* 清除productionlineResult查询结果 */
    clearProductionlineSearchResult: Reducer<any>,
  },
  effects: {
    /* 查询生产线列表 */
    searchProductionlineResult: Effect,
    /* 根据现有搜索条件刷新生产线 */
    refreshProductionline: Effect,
    /* 删除生产线 */
    removeProductionline: Effect,
    /* 更新生产线 */
    updateEditProductionline: Effect,
  },
  subscriptions: {},
}

const StorekeeperModel: IStorekeeperModelType = {
  namespace: 'storekeeper',
  state: {
    editProductionline: null,
    productionlineAdvancedSearch: { page: 0, size: 10, content: null },
    productionlineResult: null,
  },
  reducers: {
    changeEditProductionline(state: IStorekeeperModelState, { payload: id }) {
      // id为null,则为新增生产线
      if (isNil(id) === true) {
        return { ...state, editProductionline: { ...EMPTY_EDIT_USER } }
      }
      // 替换productionline中的内容，进行替换
      const selectProductionline = (state.productionlineResult as ProductionlineResultType)
        .list.find(productionline => id === productionline.id) as ProductionlineType
      return { ...state, editProductionline: selectProductionline }
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
    clearEditProductionline(state: IStorekeeperModelState) {
      return { ...state, editProductionline: null }
    },
    clearProductionlineSearchResult(state: IStorekeeperModelState) {
      return { ...state, productionlineResult: null }
    },
  },
  effects: {
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
    *updateEditProductionline({ payload: editProductionline }, { call, put, select}) {
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
  },
  subscriptions: {},
}

export default StorekeeperModel
