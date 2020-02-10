import request, { OperationResultType } from '@/utils/request'

/**
 * 拉取权限信息
 */
export async function fetchAuthorities() {
  return request('authorities');
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
