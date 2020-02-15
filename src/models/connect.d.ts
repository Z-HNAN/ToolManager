import { IUsersModelState } from './users'
import { IAdminModelState } from './admin'
import { IWorkerModelState } from './worker'
import { GlobalModelStateType } from './global'

export {
  IUsersModelState,
  GlobalModelStateType,
  IAdminModelState,
  IWorkerModelState,
}

export interface LoadingType {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    post?: boolean;
    postInfo?: boolean;
    schedule?: boolean;
  };
}

export interface IConnectState {
  loading: LoadingType
  users: IUsersModelState
  global: GlobalModelStateType
  admin: IAdminModelState
  worker: IWorkerModelState
}

// export interface Route  {
//   routes?: Route[];
// }

// export interface IConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
//   dispatch?<K = any>(action: AnyAction): K;
// }
