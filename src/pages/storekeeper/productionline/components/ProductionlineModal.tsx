import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Modal, Form } from 'antd'
import ProductionlineForm from './ProductionlineForm'
import { EditProductionlineType } from '../index'

interface UserModalProps {
  form: FormComponentProps['form']
  // 确认更新
  onConfirm: (value: any) => void
  // 关闭确认框
  onCancel: () => void
}

const UserModal: React.FC<UserModalProps> = props => {
  const {
    form,
    onConfirm,
    onCancel,
  } = props

  const handleUpdate = () => {
    // 表单无误进行提交
    form.validateFields((err, newValues) => {
      if (!err) {
        onConfirm(newValues as EditProductionlineType)
      }
    })
  }

  return (
    <Modal
      title="生产线信息"
      visible
      onOk={handleUpdate}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <ProductionlineForm form={form} />
    </Modal>
  )

}

export default Form.create<UserModalProps>()(UserModal)
