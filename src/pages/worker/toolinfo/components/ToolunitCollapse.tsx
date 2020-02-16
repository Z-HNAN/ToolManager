/**
 * 夹具实体信息
 */
import React from 'react'
import { Collapse, Tag, Button, Descriptions, Empty, Spin } from 'antd'
import { isNil } from 'lodash'
import { ToolInfoUnitSelectType, ToolInfoUnitBorrowType } from '../selector'

import styles from '../index.less'

interface ToolunitCollapseProps {
  className?: string
  toolInfoUnits: ToolInfoUnitSelectType[]
  toolInfoUnitsLoading: boolean
  onRepaire: (id: string) => void
  onBorrow: (id: string) => void
}

// 夹具实体状态对应的标签颜色
const mapStatusToTagColor: {
  [props: string]: string
} = {
  normal: 'blue',
  borrow: 'orange',
  repaire: 'magenta',
}

const ToolunitCollapse: React.FC<ToolunitCollapseProps> = props => {
  const {
    className: classNameProps,
    toolInfoUnits,
    toolInfoUnitsLoading,
    onRepaire,
    onBorrow,
  } = props

  if (toolInfoUnits.length === 0) {
    return (
      <Spin spinning={toolInfoUnitsLoading === true}>
        <Empty description="暂未有夹具实体信息" />
      </Spin>
    )
  }

  const handleRepaire = (event: React.MouseEvent, id: string) => {
    // 停止冒泡
    event.stopPropagation()
    // 提交事件
    onRepaire(id)
  }

  const handleBorrow = (event: React.MouseEvent, id: string) => {
    // 停止冒泡
    event.stopPropagation()
    // 提交事件
    onBorrow(id)
  }

  // 获取夹具展示header
  const getToolUnitHeader = (toolUnit: ToolInfoUnitSelectType) => (
    <div className={styles.toolUnitHeader}>
      <div className={styles.toolUnitHeaderTitle}>
        <span style={{ paddingRight: 10 }}>{toolUnit.code}</span>
        <Tag color={mapStatusToTagColor[toolUnit.status]}>{toolUnit.displayStatus}</Tag>
      </div>
      <div className={styles.toolUnitHeaderAction}>
        <Button
          type="primary"
          size="small"
          disabled={toolUnit.status !== 'normal'}
          onClick={e => handleRepaire(e, toolUnit.id)}
        >报修</Button>
        <Button
          style={{ marginLeft: 20 }}
          type="primary"
          size="small"
          disabled={toolUnit.status !== 'normal'}
          onClick={e => handleBorrow(e, toolUnit.id)}
        >借出</Button>
      </div>
    </div>
  )

  // 获取夹具展示body
  const getToolUnitBody = (toolUnit: ToolInfoUnitSelectType) => {
    // 处理借出DOM
    let toolUnitBorrow = null
    if (isNil(toolUnit.toolBorrowInfo) === false) {
      const {
        workerId,
        workerName,
        restoreTime,
        productionline,
      } = (toolUnit.toolBorrowInfo) as ToolInfoUnitBorrowType

      toolUnitBorrow = (
        <React.Fragment>
          <Descriptions.Item label="借用人">{workerId}{workerName}</Descriptions.Item>
          <Descriptions.Item label="归还时间">{restoreTime}</Descriptions.Item>
          <Descriptions.Item label="所在生产线">{productionline}</Descriptions.Item>
        </React.Fragment>
      )
    }

    return (
      <Descriptions>
        <Descriptions.Item label="使用次数">{toolUnit.useCount}</Descriptions.Item>
        <Descriptions.Item label="检测次数">{toolUnit.checkCount}</Descriptions.Item>
        <Descriptions.Item label="维修次数">{toolUnit.repairCount}</Descriptions.Item>
        <Descriptions.Item label="入库订单">{toolUnit.billNo}</Descriptions.Item>
        <Descriptions.Item label="记录时间">{toolUnit.createTime}</Descriptions.Item>
        <Descriptions.Item label="上次借用时间">{toolUnit.lastUseTime}</Descriptions.Item>
        {toolUnitBorrow}
        {/* 使用两个空位，布局顶过去 */}
        <Descriptions.Item label=""> </Descriptions.Item>
        <Descriptions.Item label=""> </Descriptions.Item>
        <Descriptions.Item label="所在库位">{toolUnit.location}</Descriptions.Item>
      </Descriptions>
    )
  }

  return (
    <div className={classNameProps}>
      <Spin spinning={toolInfoUnitsLoading === true}>
        <Collapse>
          {toolInfoUnits.map(toolUnit => (
            <Collapse.Panel
              header={getToolUnitHeader(toolUnit)}
              key={toolUnit.id}
            >
              {getToolUnitBody(toolUnit)}
            </Collapse.Panel>
          ))}
        </Collapse>
      </Spin>
    </div>
  )
}

export default ToolunitCollapse
