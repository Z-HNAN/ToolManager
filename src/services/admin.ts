import request, { OperationResultType } from '@/utils/request'

/**
 * 拉取权限信息
 */
export async function fetchAuthorities() {
  return request('authorities');
}

/**
 * 拉取workcell信息
 */
export async function fetchWorkcells() {
  return request('workcell');
}

/**
 * 拉取manager信息
 */
export async function fetchManagers() {
  return request('manager');
}

export async function updateAuthority(
  { id, remark }: { id: string, remark: string }
): Promise<OperationResultType> {
  return request(`authority/${id}`, {
    method: 'POST',
    data: {
      remark,
    },
  })
}

export async function updateWorkCell(
  { id, name, managerId }: { id: string | null, name: string, managerId: string | null }
): Promise<OperationResultType> {
  return request('workcell', {
    method: 'POST',
    data: {
      id,
      name,
      managerId,
    },
  })
}


// export async function create(values: IUser) {
//   const { email, name, website } = values
//   return request('users', {
//     method: 'POST',
//     data: {
//       email,
//       name,
//       website,
//     },
//   })
// }
