import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Modal, Form } from 'antd'
import { EditRepairOrderType } from '@/models/storekeeper'
import OrderForm from './OrderForm'

interface OrderModalProps {
  form: FormComponentProps['form']
  // 确认更新
  onConfirm: (value: any) => void
  // 关闭确认框
  onCancel: () => void
}

const OrderModal: React.FC<OrderModalProps> = props => {
  const {
    form,
    onConfirm,
    onCancel,
  } = props

  const handleUpdate = () => {
    // 表单无误进行提交
    form.validateFields((err, newValues) => {
      if (!err) {
        onConfirm(newValues as EditRepairOrderType)
      }
    })
  }

  return (
    <Modal
      title="报表信息"
      visible
      onOk={handleUpdate}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <OrderForm form={form} />
    </Modal>
  )

}

export default Form.create<OrderModalProps>()(OrderModal)
