/**
 * 申请维修modal
 */
import React from 'react'
import { connect } from 'dva'
import { Form, Modal, Input } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { IConnectState } from '@/models/connect'
import {
  toolUnitRepairModalVisibleSelector,
  toolRepairUnitInfoSelector,
} from '../selector'

export type RepairModalFormParams = {
  id: string
  remark: string
}

interface RepairModalProps {
  visible?: boolean
  toolInfo: { id: string, code: string, name: string }
  form: FormComponentProps['form']
  // 确认更新
  onRepair: ({ remark }: RepairModalFormParams) => void
  // 关闭确认框
  onCancel: () => void
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14, offset: 2 },
}

const mapStateToProps = (state: IConnectState) => {
  return {
    visible: toolUnitRepairModalVisibleSelector(state),
    toolInfo: toolRepairUnitInfoSelector(state),
  }
}

const RepairModal: React.FC<RepairModalProps> = props => {
  const {
    visible,
    toolInfo,
    form,
    onRepair,
    onCancel,
  } = props

  const { getFieldDecorator } = form

  // 借出夹具
  const handleOk = () => {
    form.validateFields((err, values) => {
      if (!err) {
        // 提交表单
        onRepair({
          remark: values.remark,
          id: toolInfo.id,
        })
        // 清空表单
        form.resetFields()
      }
    })
  }

  // 取消按钮
  const handleCancel = () => {
    // 关闭表单
    onCancel()
    // 清空表单数据
    form.resetFields()
  }

  return (
    <Modal
      title="申请报修"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form {...formItemLayout}>
        <Form.Item label="借用夹具">
          <Input readOnly value={toolInfo.code} />
        </Form.Item>
        <Form.Item label="借用人">
          <Input readOnly value={toolInfo.name} />
        </Form.Item>
        <Form.Item label="报修备注">
          {getFieldDecorator('remark', {
            rules: [{ required: true, message: '请输入报修备注' }],
          })(
            <Input.TextArea />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create<RepairModalProps>()(connect(mapStateToProps)(RepairModal))
