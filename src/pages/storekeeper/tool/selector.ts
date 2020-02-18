import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import { BasicPagation } from '@/models/global'
import { ToolAdvancedSearch, ToolResultType, ToolType } from '@/models/storekeeper'
import { isNil } from 'lodash'

export type ToolSelectType = {
  id: string
  code: string
  familyId: string
  modelId: string
  partId: string
  name: string
  nowCount: number
  totalCount: number
}

export type ToolResultSelectType = {
  total: number
  list: ToolSelectType[]
}


/**
 * 是否隐藏查询结果
 */
export const hiddenSearchResultSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.toolResult,
  ],
  (toolResult): boolean => isNil(toolResult) === true,
)


export const toolResultSelector = createSelector(
  [
    hiddenSearchResultSelector,
    (state: IConnectState) => state.storekeeper.toolResult as ToolResultType,
  ],
  (hidden, toolResult): ToolResultSelectType => {
    if (hidden) {
      return { total: 0, list: [] }
    }

    return {
      total: toolResult.total,
      list: toolResult.list.map((tool: any) => ({
        id: tool.id,
        code: tool.code,
        familyId: tool.familyId,
        modelId: tool.modelId,
        partId: tool.partId,
        name: tool.name,
        nowCount: tool.nowCount,
        totalCount: tool.totalCount,
      })),
    }
  },
)

/**
 * 返回当前分页状态
 */
export const pagationStatusSelector = createSelector(
  [
    (state: IConnectState) => state.storekeeper.toolAdvancedSearch,
  ],
  (toolAdvancedSearch: ToolAdvancedSearch): BasicPagation => {
    const { page, size } = toolAdvancedSearch
    return { page, size }
  },
)
