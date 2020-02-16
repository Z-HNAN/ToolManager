/**
 * 主要夹具信息
 */

import React from 'react'
import { Descriptions } from 'antd'

import { ToolInfoSelectType } from '../selector'

interface BaseInfoProps {
  className?: string
  toolInfo: ToolInfoSelectType,

}

const BaseInfo: React.FC<BaseInfoProps> = props => {
  const {
    className: classNameProps,
    toolInfo,
  } = props

  const {
    code,
    name,
    familyId,
    modelId,
    partId,
    useFor,
    UPL,
    PMPeriod,
  } = toolInfo

  return (
    <Descriptions className={classNameProps} bordered>
      <Descriptions.Item label="Code" >{code}</Descriptions.Item>
      <Descriptions.Item label="Name" span={2}>{name}</Descriptions.Item>
      <Descriptions.Item label="UPL">{UPL}（个）</Descriptions.Item>
      <Descriptions.Item label="FamilyNo">{familyId}</Descriptions.Item>
      <Descriptions.Item label="PartNo">{partId}</Descriptions.Item>
      <Descriptions.Item label="PMPeriod">{PMPeriod}（天）</Descriptions.Item>
      <Descriptions.Item label="ModalNo" span={2}>{modelId}</Descriptions.Item>
      <Descriptions.Item label="useFor" span={3}>{useFor}</Descriptions.Item>
    </Descriptions>
  )
}

export default BaseInfo
