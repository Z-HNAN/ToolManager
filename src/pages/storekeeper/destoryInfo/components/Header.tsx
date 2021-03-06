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
        <Icon type="left" />返回报废单列表
      </Button>
      <h4 className={styles.headerTitle}>报废单详情</h4>
    </div>
  )
}

export default Header
