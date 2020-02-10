import React, { ReactElement } from 'react'

import BasicAuthorityRouter from './BasicAuthorityRouter'

interface RepairerRouterProps {
  children: ReactElement
}

const RepairerRouter: React.FC <RepairerRouterProps> = props => (
  <BasicAuthorityRouter auth="repairer">
    {props.children}
  </BasicAuthorityRouter>
)

export default RepairerRouter
