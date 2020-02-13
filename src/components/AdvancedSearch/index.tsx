/**
 * 高级搜索区域
 */

import React from 'react'
import { Form, Row, Col, Button } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import FieldItem from './components/FieldItem'

 /**
  * 高级搜索项，使用约定数组的形式，[label, name, type, other, require?]
  * ['姓名', 'name', 'text', 'require'] = <input lable="姓名" name="name" type="text" />
  * ['性别', 'gender', 'select', [ ['女','female'], ['男', 'male'] ] ] = <select />
  */
export type AdvancedSearchItem = [
  string, // label名称
  string, // name名称
  'text' | 'number' | 'date' | 'textArea' | 'select', // input 的type类型
  any?, // 其他约定项
  'require'? // 是否必须
]

interface AdvancedSearchProps {
  search: AdvancedSearchItem[]
  onSearch: (values: any) => void
  onClear?: () => void
  form: FormComponentProps['form']
}

// 表单布局
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = props => {
  const {
    form,
    onClear = () => {},
    onSearch,
    search,
  } = props

  // 高级搜索区域
  const fields = search.map(advancedSearchItem => (
    <FieldItem
      key={advancedSearchItem[1]}
      advancedSearchItem={advancedSearchItem}
      getFieldDecorator={form.getFieldDecorator}
    />
  ))

  // 处理搜索
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.validateFields((err, values) => {
      // 验证无误才提交
      if (!err) onSearch(values)
    })
  }

  // 处理清除内容
  const handleReset = () => {
    onClear()
    form.resetFields()
  }

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit} >
      <Row gutter={[24, 0]}>{fields}</Row>
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
