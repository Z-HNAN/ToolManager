import React from 'react'

import { Button, Icon } from 'antd'

import styles from '../index.less'

interface HeaderProps {
  onBack: () => void
}

const Header: React.FC<HeaderProps> = props => {
  const { onBack } = props

  return (
    <div className={styles.headerRoot}>
      <Button className={styles.headerBackButton} type="primary" onClick={onBack}>
        <Icon type="left" />返回
      </Button>
      <h4 className={styles.headerTitle}>夹具详情</h4>
    </div>
  )
}

export default Header
