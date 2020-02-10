/**
 * 添加一个空行的css组件
 */

import React from 'react'
import styles from './index.less'

interface WhiteSpaceProps {
  height?: number
}


const WhiteSpace: React.FC<WhiteSpaceProps> = props => {
  const {
    height = 24,
  } = props

  return (
    <div>
      <div className={styles.side} />
      <div className={styles.whiteSpace} style={{ height }}/>
      <div className={styles.side} />
    </div>
  )
}

export default WhiteSpace
