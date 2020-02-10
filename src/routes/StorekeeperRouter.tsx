import React, { ReactElement } from 'react'

import BasicAuthorityRouter from './BasicAuthorityRouter'

interface StorekeeperRouterProps {
  children: ReactElement
}

const StorekeeperRouter: React.FC <StorekeeperRouterProps> = props => (
  <BasicAuthorityRouter auth="storekeeper">
    {props.children}
  </BasicAuthorityRouter>
)

export default StorekeeperRouter
