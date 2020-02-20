import { createSelector } from 'reselect'
import moment from 'moment'
import { IConnectState } from '@/models/connect.d'
import { BasicPagation } from '@/models/global'
import { RepairOrderType, ToolAdvancedSearch, ToolResultType, ToolType } from '@/models/storekeeper'
import { isNil, memoize } from 'lodash'

export type DestoryOrderSelectType = {
  id: string
  name: string
  createTime: string
  remark: string
}


export const destoryOrderSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.destoryOrders,
  ],
  (destoryOrders): DestoryOrderSelectType[] => destoryOrders.map(order => ({
    id: order.id,
    name: order.name,
    createTime: moment(order.createTime).format('YYYY-MM-DD HH:mm '),
    remark: order.remark,
  })),
)

// /**
//  * 获取订单中的repairUnits,返回一个函数
//  * repairUnitFilter = repairUnitSelector(state),
//  * repairUnits = repairUnitFilter(orderId)
//  */
// export const repairUnitSelector = createSelector(
//   [
//     (state: IConnectState) => state.storekeeper.repairOrderMapUnit,
//   ],
//   repairOrderMapUnit => memoize(
//     (orderId: string) => {
//       const repairUnits = repairOrderMapUnit[orderId] || []
//       return repairUnits.map(unit => ({
//         id: unit.id,
//         code: unit.code,
//         createTime: moment(unit.createTime).format('YYYY-MM-DD HH:mm'),
//         location: unit.location,
//         remark: unit.remark,
//         workerName: unit.workerName,
//       }))
//     },
//   ),
// )

// export const showRepairOrderModalSelector = createSelector(
//   [
//     (state: IConnectState) => state.storekeeper.repairOrderInfoId,
//   ],
//   repairOrderInfoId => isNil(repairOrderInfoId) === false,
// )

// /**
//  * 报修单名称信息
//  */
// export const repairOrderInfoSelector = createSelector(
//   [
//     (state: IConnectState) => state.storekeeper.repairOrderInfoId,
//     (state: IConnectState) => state.storekeeper.repairOrders,
//   ],
//   (repairOrderInfoId, repairOrders): RepairOrderSelectType => {
//     if (isNil(repairOrderInfoId)) {
//       return { id: '', name: '', remark: '', createTime: '' }
//     }
//     const currentOrder = repairOrders.find(({ id }) => id === repairOrderInfoId) as RepairOrderType
//     return {
//       id: currentOrder.id,
//       name: currentOrder.name,
//       remark: currentOrder.remark,
//       createTime: moment(currentOrder.createTime).format('YYYY-MM-DD HH:mm'),
//     }
//   },
// )

// /**
//  * 待关联的报修项,orderId=-1
//  */
// export const noOrderRepairUnitSelector = createSelector(
//   [
//     (state: IConnectState) => state.storekeeper.repairOrderMapUnit,
//   ],
//   (repairOrderMapUnit): RepairUnitSelectType[] => {
//     const repairUnits = repairOrderMapUnit['-1'] || []
//     return repairUnits.map(unit => ({
//       id: unit.id,
//       code: unit.code,
//       createTime: moment(unit.createTime).format('YYYY-MM-DD HH:mm'),
//       location: unit.location,
//       remark: unit.remark,
//       workerName: unit.workerName,
//     }))
//   },
// )

/**
 * 是否展示OrderModal
 */
export const showOrderModalSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.editDestoryOrder,
  ],
  editDestoryOrder => isNil(editDestoryOrder) === false,
)
