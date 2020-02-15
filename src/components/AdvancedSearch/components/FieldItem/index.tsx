/**
 * 表单项
 */

import React from 'react'
import { Form, Col, Input, Select } from 'antd'
import { WrappedFormUtils } from 'antd/es/form/Form'

import { AdvancedSearchItem } from '../../index'

interface FieldItemProps {
  className?: string
  interval: number
  advancedSearchItem: AdvancedSearchItem
  getFieldDecorator: WrappedFormUtils['getFieldDecorator']
}

const FieldItem: React.FC<FieldItemProps> = props => {
  const {
    className: classNameProps,
    interval,
    advancedSearchItem,
    getFieldDecorator,
  } = props

  const [label, name, type, other, require] = advancedSearchItem

  let inputDOM = (<Input type={type} />)

  // TODO 判断 TextArea 需要判断长度来使用，暂时放一下
  // const InputDOM = type === 'textArea'
  //   ? (<Input.TextArea />)
  //   : (<Input type={type} />)


  // Select 类型对的表单
  if (type === 'select') {
    // other = [ ['女','female'], ['男', 'male'] ]
    inputDOM = (
      <Select>
        {other.map(([optionLable, optionValue]: [string, string]) => (
          <Select.Option key={optionValue} value={optionValue}>{optionLable}</Select.Option>
        ))}
      </Select>
    )
  }

  // 规则项
  const rules = []
  // 必填项
  if (require === 'require') {
    rules.push({ required: true, message: `请填写${label}项` })
  }

  return (
    <Col span={interval} className={classNameProps}>
      <Form.Item label={label} style={{ display: 'flex', marginBottom: 4 }}>
        {getFieldDecorator(name, {
          rules,
        })(inputDOM)}
      </Form.Item>
    </Col>
  )
}

export default FieldItem
