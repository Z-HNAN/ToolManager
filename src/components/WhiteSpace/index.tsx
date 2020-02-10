/**
 * 添加一个空行的css组件
 */

import React from 'react'

interface WhiteSpaceProps {
  height?: number
}

const WhiteSpace: React.FC<WhiteSpaceProps> = props => {
  const {
    height = 30,
  } = props

  // 总体BasicLayout有24px的padding
  const styles = {
    height,
    width: 'calc(100% + 48px)',
    marginLeft: '-24px',
    backgroundColor: '#f0f2f5',
  }

  return (<div style={styles} />)
}

export default WhiteSpace
