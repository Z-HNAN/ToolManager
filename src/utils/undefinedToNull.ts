/**
 * 将对象自己属性的undefined转换为null
 */
import { isUndefined, cloneDeep } from 'lodash'

const undefinedToNull = (origin: { [props: string]: any }) => {
  const target = cloneDeep(origin)

  Object.keys(target).forEach(key => {
    if (isUndefined(target[key])) {
      target[key] = null
    }
  })

  return target
}

export default undefinedToNull
