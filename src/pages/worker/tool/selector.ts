import { createSelector } from 'reselect'
import { IConnectState } from '@/models/connect.d'
import { ToolSearchResultType, ToolAdvancedSearch } from '@/models/worker'
import { BasicPagation } from '@/models/global'
import { isNil } from 'lodash'

export type toolSelectType = {
  id: string
  code: string
  familyId: string
  modelId: string
  partId: string
  name: string
  nowCount: number
  totalCount: number
}

export type toolSearchResultSelectType = {
  total: number,
  list: toolSelectType[]
}

/**
 * 是否隐藏查询结果
 */
export const hiddenSearchResultSelector = createSelector(
  [
    (state: IConnectState) => state.worker.toolSearchResult,
  ],
  (toolSearchResult): boolean => isNil(toolSearchResult),
)

/**
 * 是否展示modal
 */
// export const showEditToolModalSelector = createSelector(
//   [
//     (state: IConnectState) => state.admin.editUser,
//   ],
//   (editUser): boolean => isNil(editUser) === false,
// )

/**
 * 符合条件的查询信息
 */
export const toolSearchResultSelector = createSelector(
  [
    hiddenSearchResultSelector,
    (state: IConnectState) => state.worker.toolSearchResult,
  ],
  (hiddenSearchResult, toolSearchResult) => {
    if (hiddenSearchResult === true) {
      return { total: 0, list: [] }
    }

    // 过滤数据
    return {
      total: (toolSearchResult as ToolSearchResultType).total,
      list: (toolSearchResult as ToolSearchResultType).list.map(tool => ({
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
    (state: IConnectState) => state.worker.toolAdvancedSearch,
  ],
  (toolAdvancedSearch: ToolAdvancedSearch): BasicPagation => {
    const { page, size } = toolAdvancedSearch
    return { page, size }
  },
)
