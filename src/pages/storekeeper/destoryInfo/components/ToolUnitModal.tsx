import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Modal, Form } from 'antd'
import { EditDestoryUnitType } from '@/models/storekeeper'
import ToolUnitForm from './ToolUnitForm'

interface ToolUnitModalProps {
  form: FormComponentProps['form']
  // 确认更新
  onConfirm: (value: any) => void
  // 关闭确认框
  onCancel: () => void
}

const ToolUnitModal: React.FC<ToolUnitModalProps> = props => {
  const {
    form,
    onConfirm,
    onCancel,
  } = props

  const handleUpdate = () => {
    // 表单无误进行提交
    form.validateFields((err, newValues) => {
      if (!err) {
        onConfirm(newValues as EditDestoryUnitType)
      }
    })
  }

  return (
    <Modal
      title="报废夹具实体信息"
      visible
      onOk={handleUpdate}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <ToolUnitForm form={form} />
    </Modal>
  )

}

export default Form.create<ToolUnitModalProps>()(ToolUnitModal)
