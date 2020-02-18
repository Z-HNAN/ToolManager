import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import { BasicPagation } from '@/models/global'
import { ProductionlineResultType, ProductionlineAdvancedSearch } from '@/models/storekeeper'
import { isNil } from 'lodash'
import { EditProductionlineType } from './index'

export type ProductionlineSelectType = {
  id: string
  name: string
  remark: string
}

export type ProductionlineResultSelectType = {
  total: number
  list: ProductionlineSelectType[]
}

/**
 * 是否隐藏查询结果
 */
export const hiddenSearchResultSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.productionlineResult,
  ],
  (productionlineResult): boolean => isNil(productionlineResult) === true,
)


export const productionlineSelector = createSelector(
  [
    hiddenSearchResultSelector,
    (state: IConnectState) => state.storekeeper.productionlineResult as ProductionlineResultType,
  ],
  (hidden, productionlineResult): ProductionlineResultSelectType => {
    if (hidden) {
      return { total: 0, list: [] }
    }

    return {
      total: productionlineResult.total,
      list: productionlineResult.list.map((prodline: any) => ({
        id: prodline.id,
        name: prodline.name,
        remark: prodline.remark,
      })),
    }
  },
)

/**
 * 返回当前分页状态
 */
export const pagationStatusSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.productionlineAdvancedSearch,
  ],
  (productionlineAdvancedSearch: ProductionlineAdvancedSearch): BasicPagation => {
    const { page, size } = productionlineAdvancedSearch
    return { page, size }
  },
)

/**
 * 是否隐藏生产线编辑modal
 */
export const hiddenEditProductionlineModalSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.editProductionline as EditProductionlineType,
  ],
  (editProductionline: EditProductionlineType): boolean => isNil(editProductionline) === true,
)
