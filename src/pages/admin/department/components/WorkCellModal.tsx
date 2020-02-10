import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { Modal, Form } from 'antd'
import WorkCellForm from './WorkCellForm'
import { EditWorkcellType } from '../index'

interface WorkCellModalProps {
  form: FormComponentProps['form']
  // 确认更新
  onConfirm: (value: any) => void
  // 关闭确认框
  onCancel: () => void
}

const WorkCellModal: React.FC<WorkCellModalProps> = props => {
  const {
    form,
    onConfirm,
    onCancel,
  } = props

  const handleUpdate = () => {
    // 表单无误进行提交
    form.validateFields((err, newValues) => {
      if (!err) {
        onConfirm(newValues as EditWorkcellType)
      }
    })
  }

  return (
    <Modal
      title="WorkCell信息"
      visible
      onOk={handleUpdate}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
    >
      <WorkCellForm form={form} />
    </Modal>
  )

}

export default Form.create<WorkCellModalProps>()(WorkCellModal)
