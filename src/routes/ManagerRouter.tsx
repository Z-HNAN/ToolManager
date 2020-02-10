import React, { ReactElement } from 'react'

import BasicAuthorityRouter from './BasicAuthorityRouter'

interface ManagerRouterProps {
  children: ReactElement
}

const ManagerRouter: React.FC <ManagerRouterProps> = props => (
  <BasicAuthorityRouter auth="admin">
    {props.children}
  </BasicAuthorityRouter>
)

export default ManagerRouter
