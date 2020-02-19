import request from '@/utils/request'
import { EditProductionlineType } from '@/pages/storekeeper/productionline'
import { EditRepairOrderType } from '@/models/storekeeper'

/**
 *  拉取夹具信息
 */
export type fetchProductionlineParamsType = {
  startIndex: number
  pageSize: number
  name: string | null
}

// 夹具的状态map
const mapToolStatus: {
  [props: string]: string
} = {
  1: 'normal', // 正常（可借）
  2: 'borrow', // 借出
  3: 'repair', // 检修中
}

export async function fetchProductionline(
  { startIndex, pageSize, name }: fetchProductionlineParamsType,
) {
  const response = await request('productionline', {
    method: 'GET',
    params: {
      name,
      startIndex,
      pageSize,
    },
  })
  const { total, list } = response

  return {
    total,
    list: list.map((productionline: any) => ({
      id: productionline.id,
      name: productionline.name,
      remark: productionline.remark,
    })),
  }
}

export async function removeProductionline(
  { id }: { id: string },
) {
  return request('productionline', {
    method: 'DELETE',
    params: {
      id,
    },
  })
}

export async function updateProductionline(
  { id, name, remark }: EditProductionlineType,
) {
  return request('productionline', {
    method: 'POST',
    data: {
      id,
      name,
      remark,
    },
  })
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
      createTime: unit.createTime,
      location: unit.location,
      billId: unit.billNo,
    }
  })
}

/**
 * 删除ToolUnit
 */
export async function removeToolUnit(
  { id }: { id: string },
) {
  return request('toolUnit', {
    method: 'DELETE',
    params: {
      toolId: id,
    }
  })
}

type updateToolUnitParams = {
  id: string | null
  code: string
  sequence: number
  location: number
  billId: string
}

/**
 * 更新ToolUnit
 */
export async function updateToolUnit(
  { id, code, sequence, location, billId }: updateToolUnitParams,
) {
  return request('toolUnit', {
    method: 'POST',
    data: {
      id,
      code,
      sequence,
      location,
      billNo: billId,
      createTime: Date.now(),
    },
  })
}

/**
 * 获取报修单
 */
export async function fetchRepairOrder() {
  const response = await request('repairOrder')
  return response.map((order: any) => ({
    id: order.id,
    name: order.name,
    createTime: order.createTime,
    remark: order.remark,
  }))
}

/**
 * 获取报修项
 */
export async function fetchRepairOrderMapUnit(
  { orderId }: { orderId: string | null },
) {
  const response = await request('toolUnitRepair', {
    method: 'GET',
    params: { orderId }
  })
  return response.map((unit: any) => ({
    id: unit.id,
    code: unit.code,
    location: unit.location,
    remark: unit.remark,
    createTime: unit.createTime,
    workerName: unit.workerName,
  }))
}

/**
 * 将报修项增加到报修单中
 */
export async function addRepairToOrder(
  { repairUnitId, orderInfoId }: { repairUnitId: string, orderInfoId: string },
) {
  return request('addRepairToOrder', {
    method: 'POST',
    data: {
      repairUnitId,
      orderInfoId,
    },
  })
}

/**
 * 将报修项移除报修单
 */
export async function removeRepairFromOrder(
  { repairUnitId, orderInfoId }: { repairUnitId: string, orderInfoId: string },
) {
  return request('removeRepairFromOrder', {
    method: 'POST',
    data: {
      repairUnitId,
      orderInfoId,
    },
  })
}

/**
 * 提交报修单
 */
export async function submitOrder(
  { orderId }: { orderId: string },
) {
  return request('submitOrder', {
    method: 'POST',
    data: { orderId },
  })
}

/**
 * 删除报修单
 */
export async function removeRepairOrder(
  { id } : { id: string },
) {
  return request('repairOrder', {
    method: 'DELETE',
    params: { id },
  })
}

/**
 * 更新报修单
 */
export async function updateRepairOrder(
  { id, name, remark }: EditRepairOrderType,
) {
  return request('repairOrder', {
    method: 'POST',
    data: {
      id,
      name,
      remark,
      createTime: Date.now(),
    },
  })
}
