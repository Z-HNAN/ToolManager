import React, { ReactElement } from 'react'

import BasicAuthorityRouter from './BasicAuthorityRouter'

interface WorkerRouterProps {
  children: ReactElement
}

const WorkerRouter: React.FC <WorkerRouterProps> = props => (
  <BasicAuthorityRouter auth="worker">
    {props.children}
  </BasicAuthorityRouter>
)

export default WorkerRouter
