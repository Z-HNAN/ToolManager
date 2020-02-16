import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import { CurrentUserType } from '@/models/global'
import moment from 'moment'
import { ToolSearchResultType, ToolBorrowInfoType, ToolType, ToolInfoUnitType } from '@/models/worker'
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

export type ToolInfoUnitBorrowType = {
  id: string // 借用id
  workerId: string // 借用员工工号
  workerName: string // 借用员工姓名
  restoreTime: string // 归还时间
  productionline: string // 所在生产线
}

/**
 * toolUnit类型
 */
export type ToolInfoUnitSelectType = {
  id: string
  code: string
  status: ToolInfoUnitType['status'],
  displayStatus: string
  useCount: number
  checkCount: number
  repairCount: number
  billNo: string
  createTime: string
  lastUseTime: string
  location: string
  toolBorrowInfo: ToolInfoUnitBorrowType | null
}

/**
 * 是否隐藏当前页
 */
export const hiddenToolInfoSelector = createSelector(
  [
    (state: IConnectState) => state.worker.toolInfoId,
    (state: IConnectState) => state.worker.toolSearchResult,
  ],
  (toolInfoId, toolSearchResult) => isNil(toolInfoId) || isNil(toolSearchResult),
)

export const toolInfoSelector = createSelector(
  [
    hiddenToolInfoSelector,
    (state: IConnectState) => state.worker.toolInfoId,
    (state: IConnectState) => (state.worker.toolSearchResult as ToolSearchResultType).list,
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

const mapStatusDisplay: {
  [props: string]: string
} = {
  normal: '在库',
  borrow: '借出',
  repaire: '检修中',
}

/**
 * toolInfo中夹具实体选择
 */
export const toolInfoUnitSelector = createSelector(
  [
    hiddenToolInfoSelector,
    (state: IConnectState) => state.worker.toolInfoUnitList,
  ],
  (hidden, toolInfoUnitList): ToolInfoUnitSelectType[] => {
    if (hidden) {
      return []
    }

    // 过滤数据
    return toolInfoUnitList.map(toolInfoUnit => {
      // 转换显示状态
      const displayStatus = mapStatusDisplay[(toolInfoUnit.status) as string]

      // 填充借用信息
      let toolBorrowInfo: ToolInfoUnitBorrowType | null = null
      // 不为null，进行填充
      if (isNil(toolInfoUnit.toolBorrowInfo) === false) {
        const {
          id,
          workerId,
          workerName,
          restoreTime,
          productionline,
        } = (toolInfoUnit.toolBorrowInfo) as ToolBorrowInfoType

        toolBorrowInfo = {
          id,
          workerId,
          workerName,
          restoreTime: moment(restoreTime).format('YYYY-MM-DD HH:mm'),
          productionline,
         }
      }

      return {
        id: toolInfoUnit.id,
        code: toolInfoUnit.code,
        status: toolInfoUnit.status,
        displayStatus,
        useCount: toolInfoUnit.useCount,
        checkCount: toolInfoUnit.checkCount,
        repairCount: toolInfoUnit.repairCount,
        billNo: toolInfoUnit.billNo,
        createTime: moment(toolInfoUnit.createTime).format('YYYY-MM-DD HH:mm'),
        lastUseTime: moment(toolInfoUnit.lastUseTime).format('YYYY-MM-DD HH:mm'),
        location: toolInfoUnit.location,
        toolBorrowInfo,
      }
    })
  },
)

/**
 * 借用modal框是否显示
 * 存在borrowId才显示
 */
export const toolUnitBorrowModalVisibleSelector = createSelector(
  [
    (state: IConnectState) => state.worker.toolUnitBorrowId,
  ],
  (toolUnitBorrowId): boolean => isNil(toolUnitBorrowId) === false,
)
/**
 * 借用modal框tool信息
 */
export const toolBorrowUnitInfoSelector = createSelector(
  [
    toolUnitBorrowModalVisibleSelector,
    (state: IConnectState) => (state.worker.toolUnitBorrowId) as string,
    (state: IConnectState) => state.worker.toolInfoUnitList,
    (state: IConnectState) => (state.global.currentUser) as CurrentUserType,
  ],
  (show, toolId, toolUnitList, currentUser) => {
    if (show === false) {
      return { id: '', code: '', name: '' }
    }
    const tool = toolUnitList.find(({ id }) => id === toolId) as ToolInfoUnitType
    return { id: toolId, code: tool.code, name: currentUser.username }
  },
)

/**
 * 报修modal框是否显示
 * 存在repairId才显示
 */
export const toolUnitRepairModalVisibleSelector = createSelector(
  [
    (state: IConnectState) => state.worker.toolUnitRepairId,
  ],
  (toolUnitRepairId): boolean => isNil(toolUnitRepairId) === false,
)
/**
 * 报修modal框tool信息
 */
export const toolRepairUnitInfoSelector = createSelector(
  [
    toolUnitRepairModalVisibleSelector,
    (state: IConnectState) => (state.worker.toolUnitRepairId) as string,
    (state: IConnectState) => state.worker.toolInfoUnitList,
    (state: IConnectState) => (state.global.currentUser) as CurrentUserType,
  ],
  (show, toolId, toolUnitList, currentUser) => {
    if (show === false) {
      return { id: '', code: '', name: '' }
    }
    const tool = toolUnitList.find(({ id }) => id === toolId) as ToolInfoUnitType
    return { id: toolId, code: tool.code, name: currentUser.username }
  },
)