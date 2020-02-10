import React, { ReactElement } from 'react'

import BasicAuthorityRouter from './BasicAuthorityRouter'

interface SuperisorRouterProps {
  children: ReactElement
}

const SuperisorRouter: React.FC <SuperisorRouterProps> = props => (
  <BasicAuthorityRouter auth="admin">
    {props.children}
  </BasicAuthorityRouter>
)

export default SuperisorRouter
