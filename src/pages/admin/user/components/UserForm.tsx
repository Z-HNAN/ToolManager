import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Form, Input, Select } from 'antd'
import { connect } from 'dva'
import { EditUserType } from '../index'
import { IConnectState } from '@/models/connect'


interface WorkCellFormProps {
  form: FormComponentProps['form']
  edit: EditUserType
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
  const { editUser } = state.admin
  return { edit: (editUser as EditUserType) }
}

const WorkCellForm: React.FC<WorkCellFormProps> = props => {
  const {
    form,
    edit,
  } = props
  const { getFieldDecorator } = form

  React.useEffect(() => {
    form.setFieldsValue({
      workcellId: edit.workcellId,
      workerId: edit.workerId,
      authName: edit.authName,
      username: edit.username,
      password: edit.password,
      phone: edit.phone,
      authorityId: edit.authorityId,
    })
  }, [edit])

  return (
    <Form {...formItemLayout}>
      <Form.Item label="工作部门">
        {getFieldDecorator('workcellId', {
          rules: [{ required: true, message: '请选择部门名称' }],
        })(
          <Select>
            <Select.Option value="-1">--暂不选择--</Select.Option>
            <Select.Option value="1">下沙一公司</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="工号">
        {getFieldDecorator('workerId', {
          rules: [{ required: true, message: '请输入员工工号' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="姓名">
        {getFieldDecorator('authName', {
          rules: [{ required: true, message: '请输入员工姓名' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="账号">
        {getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入员工账号' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="密码">
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入员工密码' }],
        })(
          <Input />,
        )}
      </Form.Item>

      <Form.Item label="联系方式">
        {getFieldDecorator('phone', {
          rules: [{ required: true, message: '请输入员工手机号' }],
        })(
          <Input />,
        )}
      </Form.Item>
      <Form.Item label="选择权限">
        {getFieldDecorator('authorityId', {
          rules: [{ required: true, message: '请选择所属权限' }],
        })(
          <Select>
            <Select.Option value="1">赵大锤</Select.Option>
            <Select.Option value="2">赵大锤</Select.Option>
          </Select>,
        )}
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps)(WorkCellForm)
