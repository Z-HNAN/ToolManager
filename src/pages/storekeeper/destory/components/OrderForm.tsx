import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Form, Input } from 'antd'
import { connect } from 'dva'
import { EditDestoryOrderType } from '@/models/storekeeper'
import { IConnectState } from '@/models/connect'


interface WorkCellFormProps {
  form: FormComponentProps['form']
  edit: EditDestoryOrderType
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

const mapStateToProps = (state: IConnectState) => {
  const { editDestoryOrder } = state.storekeeper
  return {
    edit: editDestoryOrder as EditDestoryOrderType,
  }
}

const WorkCellForm: React.FC<WorkCellFormProps> = props => {
  const {
    form,
    edit,
  } = props
  const { getFieldDecorator } = form

  React.useEffect(() => {
    form.setFieldsValue({
      name: edit.name,
      remark: edit.remark,
    })
  }, [edit])

  return (
    <Form {...formItemLayout}>
      <Form.Item label="报表名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入报表名称' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="报表备注">
        {getFieldDecorator('remark', {
          rules: [{ required: true, message: '请输入报表备注' }],
        })(
          <Input />,
        )}
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps)(WorkCellForm)
