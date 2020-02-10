/**
 * 表单项
 */

import React from 'react'
import { Form, Col, Input } from 'antd'
import { WrappedFormUtils } from 'antd/es/form/Form'

import { AdvancedSearchItem } from '../../index'

interface FieldItemProps {
  label: AdvancedSearchItem[0]
  name: AdvancedSearchItem[1]
  type: AdvancedSearchItem[2]
  getFieldDecorator: WrappedFormUtils['getFieldDecorator']
}

const FieldItem: React.FC<FieldItemProps> = props => {
  const {
    label,
    name,
    type,
    getFieldDecorator,
  } = props

  return (
    <Col span={8}>
      <Form.Item label={label} style={{ display: 'flex' }}>
        {getFieldDecorator(name, {
          rules: [],
        })(<Input type={type} />)}
      </Form.Item>
    </Col>
  )
}

export default FieldItem
