import request, { OperationResultType } from '@/utils/request'
import { ToolType } from '@/models/worker'


export type fetchToolParamsType = {
  startIndex: number
  pageSize: number
  familyId: string | null
  modelId: string | null
  partId: string | null
  code: string | null
  name: string | null
}
/**
 *  拉取夹具信息
 */
export async function fetchTool(
  { startIndex, pageSize, familyId, modelId, partId, code, name }: FetchToolParamsType,
) {
  const response = await request('tool', {
    method: 'GET',
    params: {
      familyId,
      modelId,
      partId,
      code,
      name,
      startIndex,
      pageSize,
    },
  })
  const { total, list } = response

  return {
    total,
    list: list.map((tool: any) => ({
      id: tool.id,
      code: tool.code,
      name: tool.name,
      familyId: tool.familyId,
      modelId: tool.modelId,
      partId: tool.partId,
      userFor: tool.userFor,
      UPL: tool.UPL,
      PMPeriod: tool.PMPeriod,
      img: tool.img,
      nowCount: tool.nowCount,
      totalCount: tool.totalCount,
    })),
  }
}
