import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import { CurrentUserType } from '@/models/global'
import moment from 'moment'
import { isNil } from 'lodash'
import { BorrowToolType } from '@/models/worker'

export type BorrowToolSelectType = {
  id: string
  code: string
  borrowTime: string
  restoreTime: string
  location: string
  remainTime: string
}

/**
 * 展示用户已经借出的borrowTool
 */
export const borrowToolSelector = createSelector(
  [
    (state: IConnectState) => state.worker.borrowTools,
  ],
  (borrowTools): BorrowToolSelectType[] => {
    const today = moment()
    const todayTimestamp = Date.now()

    return borrowTools.map(borrowTool => {
      // 两天的时间间隔,暂时换算为天
      const timeDiff = moment(borrowTool.restoreTime).diff(today, 'day')
      // 增加 延期/超时字眼
      const remainTime = todayTimestamp >= borrowTool.restoreTime ? `延期${timeDiff}天` : `剩余${timeDiff}天`

      return {
        id: borrowTool.id,
        code: borrowTool.code,
        borrowTime: moment(borrowTool.borrowTime).format('YYYY-MM-DD HH:mm'),
        restoreTime: moment(borrowTool.restoreTime).format('YYYY-MM-DD HH:mm'),
        location: borrowTool.location,
        remainTime,
      }
    })
  },
)

/**
 * 是否隐藏续借modal
 */
export const borrowToolBorrowModalVisibleSelector = createSelector(
  [
    (state: IConnectState) => state.worker.borrowToolBorrowId,
  ],
  (borrowToolBorrowId): boolean => isNil(borrowToolBorrowId) === false,
)

/**
 * 续借modal中所需的数据
 */
export const toolBorrowUnitInfoSelector = createSelector(
  [
    borrowToolBorrowModalVisibleSelector,
    (state: IConnectState) => (state.worker.borrowToolBorrowId) as string,
    (state: IConnectState) => state.worker.borrowTools,
    (state: IConnectState) => (state.global.currentUser) as CurrentUserType,
  ],
  (show, toolId, tools, currentUser) => {
    if (show === false) {
      return { id: '', code: '', name: '' }
    }
    const tool = tools.find(({ id }) => id === toolId) as BorrowToolType
    return { id: toolId, code: tool.code, name: currentUser.username }
  },
)

/**
 * 是否隐藏报修modal
 */
export const borrowToolRepairModalVisibleSelector = createSelector(
  [
    (state: IConnectState) => state.worker.borrowToolRepairId,
  ],
  (borrowToolRepairId): boolean => isNil(borrowToolRepairId) === false,
)

/**
 * 报修modal中所需的数据
 */
export const toolRepairUnitInfoSelector = createSelector(
  [
    borrowToolRepairModalVisibleSelector,
    (state: IConnectState) => (state.worker.borrowToolRepairId) as string,
    (state: IConnectState) => state.worker.borrowTools,
    (state: IConnectState) => (state.global.currentUser) as CurrentUserType,
  ],
  (show, toolId, tools, currentUser) => {
    if (show === false) {
      return { id: '', code: '', name: '' }
    }
    const tool = tools.find(({ id }) => id === toolId) as BorrowToolType
    return { id: toolId, code: tool.code, name: currentUser.username }
  },
)

/**
 * 是否隐藏续借modal
 */
export const borrowToolRestoreModalVisibleSelector = createSelector(
  [
    (state: IConnectState) => state.worker.borrowToolRestoreId,
  ],
  (borrowToolRestoreId): boolean => isNil(borrowToolRestoreId) === false,
)

/**
 * 续借modal中所需的数据
 */
export const toolRestoreUnitInfoSelector = createSelector(
  [
    borrowToolRestoreModalVisibleSelector,
    (state: IConnectState) => (state.worker.borrowToolRestoreId) as string,
    (state: IConnectState) => state.worker.borrowTools,
    (state: IConnectState) => (state.global.currentUser) as CurrentUserType,
  ],
  (show, toolId, tools, currentUser) => {
    if (show === false) {
      return { id: '', code: '', name: '', location: '' }
    }
    const tool = tools.find(({ id }) => id === toolId) as BorrowToolType
    return { id: toolId, code: tool.code, name: currentUser.username, location: tool.location }
  },
)
