import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Form, Input } from 'antd'
import { connect } from 'dva'
import { EditToolUnitType } from '@/models/storekeeper'
import { IConnectState } from '@/models/connect'
import {
  toolInfoCodeSelector,
} from '../selector'

interface WorkCellFormProps {
  form: FormComponentProps['form']
  code: string
  edit: EditToolUnitType
}

// 表单布局
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
}

const mapStateToProps = (state: IConnectState) => {
  const { editToolUnit } = state.storekeeper
  return {
    code: toolInfoCodeSelector(state),
    edit: (editToolUnit as EditToolUnitType),
  }
}

const WorkCellForm: React.FC<WorkCellFormProps> = props => {
  const {
    form,
    code,
    edit,
  } = props
  const { getFieldDecorator } = form

  React.useEffect(() => {
    form.setFieldsValue({
      sequence: edit.sequence,
      location: edit.location,
      billId: edit.billId,
    })
  }, [edit])

  return (
    <Form {...formItemLayout}>
      <Form.Item label="Code">
        {getFieldDecorator('sequence', {
          rules: [{ required: true, message: '请完善夹具Code' }],
        })(
          <Input addonBefore={`${code}-`} type="number" />,
        )}
      </Form.Item>
      <Form.Item label="库位">
        {getFieldDecorator('location', {
          rules: [{ required: true, message: '请输入库位信息' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="入库单">
        {getFieldDecorator('billId', {
          rules: [{ required: true, message: '请输入入库单号' }],
        })(
          <Input />,
        )}
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps)(WorkCellForm)
