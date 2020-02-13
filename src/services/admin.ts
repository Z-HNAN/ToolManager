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

/**
 *  拉取用户信息
 */
export async function fetchUser(
  { startIndex, pageSize, workcellId, workerId, workerName, authorityId }
  /* eslint-disable-next-line max-len */
    : { startIndex: number, pageSize: number, workcellId: string, workerId: string | null, workerName: string | null, authorityId: string | null },
) {
  const response = await request('user', {
    method: 'GET',
    params: {
      workcellId,
      workerId,
      workerName,
      authorityId,
      startIndex,
      pageSize,
    },
  })
  const { total, list } = response

  return {
    total,
    list: list.map((user: any) => ({
      id: user.id,
      workcellId: user.workcellId,
      username: user.username,
      authName: user.authName,
      phone: user.phone,
      workerId: user.workerId,
      authorityId: user.authorityId,
    })),
  }
}

/**
 * 删除workcell信息
 */
export async function removeWorkCell(
  { id }: { id: string },
): Promise<OperationResultType> {
  return request('workcell', {
    method: 'DELETE',
    data: {
      id,
    },
  })
}

export async function updateAuthority(
  { id, remark }: { id: string, remark: string }
): Promise<OperationResultType> {
  return request('authority', {
    method: 'POST',
    data: {
      id,
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
