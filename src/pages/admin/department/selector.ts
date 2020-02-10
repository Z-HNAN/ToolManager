import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import { isNil } from 'lodash'
import { ManagerType } from '@/models/admin'

export type WorkcellSelectType = {
  id: string
  name: string
  managerName: string
  managerPhone: string
}

/**
 * 隐藏modal
 */
export const hidenModalSelector = createSelector(
  [
    (state: IConnectState) => state.admin.editWorkCell,
  ],
  (editWorkCell): boolean => isNil(editWorkCell),
)

/**
 * 返回user展示的信息
 */
export const workcellSelector = createSelector(
  [
    (state: IConnectState) => state.admin.workcells,
    (state: IConnectState) => state.admin.managers,
  ],
  (workcells, managers): WorkcellSelectType[] => workcells.map(workcell => {
    const {
      id,
      name,
      managerId,
    } = workcell

    let showManager
    if (isNil(managerId)) {
      // 为空，填充-
      showManager = {
        id: '-1',
        name: '-',
        phone: '-',
      }
    } else {
      // 不为空，寻找信息填充
      showManager = (managers.find(manager => manager.id === managerId)) as ManagerType
    }

    return {
      id,
      name,
      managerName: showManager.name,
      managerPhone: showManager.phone,
    }
  }),
)
