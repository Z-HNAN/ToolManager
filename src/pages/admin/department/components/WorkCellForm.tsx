import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Form, Input, Select } from 'antd'
import { connect } from 'dva'
import { EditWorkcellType } from '../index'
import { ManagerType } from '@/models/admin'
import { IConnectState } from '@/models/connect'
import { ManagerFormSelectType, managerFormSelector } from '../selector'


interface WorkCellFormProps {
  form: FormComponentProps['form']
  managers: ManagerFormSelectType[]
  edit: EditWorkcellType
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
  const { editWorkCell } = state.admin
  return {
    managers: managerFormSelector(state),
    edit: editWorkCell,
  }
}

const WorkCellForm: React.FC<WorkCellFormProps> = props => {
  const {
    form,
    managers,
    edit,
  } = props
  const { getFieldDecorator } = form

  React.useEffect(() => {
    form.setFieldsValue({
      name: edit.name,
      managerId: edit.managerId,
    })
  }, [edit])

  return (
    <Form {...formItemLayout}>
      <Form.Item label="部门名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入部门名称' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="部门经理">
        {getFieldDecorator('managerId', {
        })(
          <Select>
            <Select.Option value="-1">--暂不选择--</Select.Option>
            {managers.map(({ id, name }) => (
              <Select.Option key={id} value={id}>{name}</Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps)(WorkCellForm)
