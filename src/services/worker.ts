import request, { OperationResultType } from '@/utils/request'
import { ToolType } from '@/models/worker'
import { BorrowModalFormParams } from '@/pages/worker/toolinfo/components/BorrowModal'
import { RepairModalFormParams } from '@/pages/worker/toolinfo/components/RepairModal'

// 夹具的状态map
const mapToolStatus: {
  [props: string]: string
} = {
  1: 'normal', // 正常（可借）
  2: 'borrow', // 借出
  3: 'repaire', // 检修中
}


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
  { startIndex, pageSize, familyId, modelId, partId, code, name }: fetchToolParamsType,
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
      useFor: tool.useFor,
      UPL: tool.UPL,
      PMPeriod: tool.PMPeriod,
      img: tool.img,
      nowCount: tool.nowCount,
      totalCount: tool.totalCount,
    })),
  }
}

/**
 * 拉取夹具实体信息
 */
export async function fetchToolUnit(
  { toolId }: { toolId: string },
) {
  const response = await request('toolUnit', {
    params: { id: toolId },
  })

  // 过滤数据
  return response.map((unit: any) => {
    const status = mapToolStatus[(unit.status) as (string)]

    return {
      id: unit.id,
      code: unit.code,
      status,
      useCount: unit.useCount,
      checkCount: unit.checkCount,
      repairCount: unit.repairCount,
      billNo: unit.billNo,
      createTime: unit.createTime,
      lastUseTime: unit.lastUseTime,
      location: unit.location,
    }
  })
}

 /**
  * 拉取夹具借用信息
  */
export async function fetchToolBorrow(
  { toolId }: { toolId: string },
) {
  const response = await request('toolUnitBorrow', {
    params: { id: toolId },
  })

  // 过滤数据
  const {
    id,
    userId,
    workerId,
    workerName,
    restoreTime,
    productionline,
  } = response

  return {
    id,
    userId,
    workerId,
    workerName,
    restoreTime,
    productionline,
  }
}

/**
 * 借用夹具
 */
export async function toolUnitBorrow(
  { id, restoreTime, productionLineId }: BorrowModalFormParams,
) {
  return request('toolUnitBorrow', {
    method: 'POST',
    data: {
      id,
      restoreTime,
      borrowTime: Date.now(),
      productionLineId,
    },
  })
}

/**
 * 维修夹具
 */
export async function toolUnitRepair(
  { id, remark }: RepairModalFormParams,
) {
  return request('toolUnitRepair', {
    method: 'POST',
    data: {
      id,
      remark,
      createTime: Date.now(),
    },
  })
}
