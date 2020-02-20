import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import moment from 'moment'
import { ToolCodeSearchType } from '@/models/storekeeper'
import { isNil } from 'lodash'

export type DestoryUnitSelectType = {
  id: string
  toolId: string
  code: string
  createTime: string
  location: string
  remark: string
}

export type ToolCodeSelectType = {
  key: string
  label: string
}

/**
 * 隐藏destoryOrder报废夹具实体
 */
export const hiddenDestoryUnitSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.destoryOrderInfoId,
    (state: IConnectState) => state.storekeeper.destoryOrderMapUnit,
  ],
  (orderId, destoryOrderMapUnit) => {
    if (isNil(orderId) === true) {
      return false
    }

    const destoryUnits = destoryOrderMapUnit[orderId as string]
    return isNil(destoryUnits) === true
  },
)

/**
 * 返回当前选中的destoryOrder的报废夹具实体
 */
export const destoryUnitSelector = createSelector(
  [
    hiddenDestoryUnitSelector,
    (state: IConnectState) => state.storekeeper.destoryOrderInfoId,
    (state: IConnectState) => state.storekeeper.destoryOrderMapUnit,
  ],
  (hidden, orderId, destoryOrderMapUnit): DestoryUnitSelectType[] => {
    if (isNil(orderId) === true || hidden === true) {
      return []
    }

    const destoryUnits = destoryOrderMapUnit[orderId as string] || []
    // 过滤数据
    return destoryUnits.map(unit => ({
      id: unit.id,
      toolId: unit.toolId,
      code: unit.code,
      createTime: moment(unit.createTime).format('YYYY-MM-DD HH:mm'),
      location: unit.location,
      remark: unit.remark,
    }))
  },
)

/**
 * 显示隐藏编辑modal
 */
export const hiddenEditModalSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.editDestoryUnit,
  ],
  editDestoryUnit => isNil(editDestoryUnit) === true,
)

/**
 * 夹具Code对应Id
 */
export const toolCodeSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.toolCodeSearch,
  ],
  (toolCodeSearch): ToolCodeSelectType[] => toolCodeSearch.map((tool: ToolCodeSearchType) => ({
    key: tool.id,
    label: tool.code,
  })),
)
