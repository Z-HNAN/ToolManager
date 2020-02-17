import request from '@/utils/request'
import { EditProductionlineType } from '@/pages/storekeeper/productionline'

/**
 *  拉取夹具信息
 */
export type fetchProductionlineParamsType = {
  startIndex: number
  pageSize: number
  name: string | null
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
