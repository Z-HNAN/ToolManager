/**
 * 高级搜索区域
 */

import React from 'react'
import { Form, Row, Col, Button } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import FieldItem from './components/FieldItem'

 /**
  * 高级搜索项，使用约定数组的形式，[label, name, type]
  * ['姓名', 'name', 'text'] = <input lable="姓名" name="name" type="text" />
  */
export type AdvancedSearchItem = [string, string, 'text' | 'number' | 'date' | 'textArea']

interface AdvancedSearchProps {
  search: AdvancedSearchItem[]
  onSearch: (values: any) => void
  form: FormComponentProps['form']
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = props => {
  const {
    form,
    onSearch,
    search,
  } = props

  // 高级搜索区域
  const fields = search.map(([label, name, type]) => (
    <FieldItem
      key={name}
      label={label}
      name={name}
      type={type}
      getFieldDecorator={form.getFieldDecorator}
    />
  ))

  // 处理搜索
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      onSearch(values)
    })
  }

  // 处理清除内容
  const handleReset = () => {
    form.resetFields()
  }

  return (
    <Form onSubmit={handleSubmit} >
      <Row gutter={24}>{fields}</Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleReset}>
            清除
          </Button>
        </Col>
      </Row>
    </Form>
  );
 }

export default Form.create<AdvancedSearchProps>()(AdvancedSearch)
