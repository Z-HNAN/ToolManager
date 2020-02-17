import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Form, Input } from 'antd'
import { connect } from 'dva'
import { EditProductionlineType } from '../index'
import { IConnectState } from '@/models/connect'


interface WorkCellFormProps {
  form: FormComponentProps['form']
  edit: EditProductionlineType
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
  const { editProductionline } = state.storekeeper
  return {
    edit: editProductionline as EditProductionlineType,
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
      <Form.Item label="生产线名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入生产线名称' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="生产线备注">
        {getFieldDecorator('remark', {
          rules: [{ required: true, message: '请输入生产线备注' }],
        })(
          <Input />,
        )}
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps)(WorkCellForm)
