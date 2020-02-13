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

const emptyManager = {
  id: '-1',
  name: '-',
  phone: '-',
}

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

    // 默认为空
    let showManager = emptyManager
    // 不为空，寻找信息填充
    if (isNil(managerId) === false) {
      showManager = managers.find(manager => manager.id === managerId) || emptyManager
    }

    return {
      id,
      name,
      managerName: showManager.name,
      managerPhone: showManager.phone,
    }
  }),
)
