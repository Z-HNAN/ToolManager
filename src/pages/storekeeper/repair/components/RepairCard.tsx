/**
 * 未关联维修单的维修卡片
 */
import React from 'react'
import { Card, Select, Button } from 'antd'
import { RepairUnitSelectType, RepairOrderSelectType } from '../selector'

import styles from '../index.less'

interface RepairCardProps {
  repairUnit: RepairUnitSelectType
  repairOrders: RepairOrderSelectType[]
  onLink: (repairUnitId: string, orderId: string) => void
}

const RepairCard: React.FC<RepairCardProps> = props => {
  const {
    repairUnit,
    repairOrders,
    onLink,
  } = props

  const [orderId, setOrderId] = React.useState('-1')

  const handleChangeOrder = (id: string) => {
    setOrderId(id)
  }

  /**
   * 确认关联
   */
  const handleLink = () => {
    // 如果id为-1,则为待选择状态,不发出事件
    if (orderId !== '-1') {
      onLink(repairUnit.id, orderId)
    }
  }

  const title = (
    <div className={styles.repairCardTitle}>
      <span>{repairUnit.code}</span>
      <span>{repairUnit.location}</span>
    </div>
  )

  const actions = [
    <Select value={orderId} onChange={handleChangeOrder} >
      <Select.Option value="-1">--待选择--</Select.Option>
      {repairOrders.map(order => (
        <Select.Option value={order.id}>{order.name}</Select.Option>
      ))}
    </Select>,
    <Button icon="check" onClick={handleLink}>确认关联</Button>,
  ]

  return (
    <Card title={title} actions={actions}>
      <p>{repairUnit.remark}</p>
      <p>{repairUnit.createTime} {repairUnit.workerName}</p>
    </Card>
  )
}

export default RepairCard
