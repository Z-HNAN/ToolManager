import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import moment from 'moment'
import { ToolResultType, ToolType, ToolUnitType } from '@/models/storekeeper'
import { isNil } from 'lodash'

export type ToolInfoSelectType = {
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
}

export type ToolInfoUnitSelectType = {
  id: string
  code: string
  status: ToolUnitType['status']
  displayStatus: string
  location: string
  createTime: string
  billId: string
}

/**
 * 是否隐藏夹具详情
 * tool页面分开展示，为夹具列表，和夹具详情，二选一展示
 */
export const hiddenToolInfoSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.toolInfoId,
  ],
  (toolInfoId): boolean => isNil(toolInfoId) === true,
)

/**
 * 展示夹具详情信息
 */
export const toolInfoSelector = createSelector(
  [
    hiddenToolInfoSelector,
    (state: IConnectState) => state.storekeeper.toolInfoId,
    (state: IConnectState) => (state.storekeeper.toolResult as ToolResultType).list,
  ],
  (hidden, toolId, toolList): ToolInfoSelectType => {
    if (hidden) {
      return {
        id: '',
        code: '',
        name: '',
        familyId: '',
        modelId: '',
        partId: '',
        useFor: '',
        UPL: 0,
        PMPeriod: 0,
        img: '',
      }
    }
    // 当前工具
    const tool = toolList.find(({ id }) => id === toolId) as ToolType

    return {
      id: tool.id,
      code: tool.code,
      name: tool.name,
      familyId: tool.familyId,
      modelId: tool.modelId,
      partId: tool.partId,
      useFor: tool.useFor,
      UPL: tool.UPL,
      PMPeriod: tool.PMPeriod,
      img: tool.img,
    }
  },
)

/**
 * 夹具实体是否隐藏
 */
export const hiddenToolInfoUnitSelector = createSelector(
  [
    hiddenToolInfoSelector,
    (state: IConnectState) => state.storekeeper.toolInfoUnits,
  ],
  (hidden, units): boolean => hidden || isNil(units)
)

/**
 * 夹具status对应显示
 */
const mapStatusToDisplay = {
  normal: '在库',
  borrow: '借出',
  repair: '报修',
}

/**
 * 夹具详情的实体选择列表
 */
export const toolInfoUnitSelector = createSelector(
  [
    hiddenToolInfoUnitSelector,
    (state: IConnectState) => state.storekeeper.toolInfoUnits as ToolUnitType[],
  ],
  (hidden, units): ToolInfoUnitSelectType[] => {
    if (hidden) {
      return []
    }

    // 过滤数据
    return units.map(unit => {
      const displayStatus = mapStatusToDisplay[unit.status]
      const createTime = moment(unit.createTime).format('YYYY-MM-DDD HH:mm')

      return {
        id: unit.id,
        code: unit.code,
        status: unit.status,
        displayStatus,
        location: unit.location,
        createTime,
        billId: unit.billId,
      }
    })
  },
)


/**
 * 展示编辑modal
 */
export const hiddenEditToolUnitModalSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.editToolUnit,
  ],
  (editToolUnit): boolean => isNil(editToolUnit) === true,
)

/**
 * 当前tool的Code，不带序号
 */
export const toolInfoCodeSelector = createSelector(
  [
    hiddenEditToolUnitModalSelector,
    (state: IConnectState) => state.storekeeper.toolInfoId as string,
    (state: IConnectState) => (state.storekeeper.toolResult as ToolResultType).list,
  ],
  (hidden, toolInfoId, tools): string => {
    if (hidden) {
      return ''
    }

    const currentUnit = tools.find(tool => tool.id === toolInfoId) as ToolUnitType
    return currentUnit.code
  },
)
