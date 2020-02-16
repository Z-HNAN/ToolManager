/**
 * 申请借出modal
 */
import React from 'react'
import { connect } from 'dva'
import { Moment } from 'moment'
import { Form, Modal, Input, Select, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { IConnectState } from '@/models/connect'
import {
  toolUnitBorrowModalVisibleSelector,
  toolBorrowUnitInfoSelector,
} from '../selector'

export type BorrowModalFormParams = {
  id: string
  restoreTime: number
  productionLineId: string
}

interface BorrowModalProps {
  visible?: boolean
  toolInfo: { id: string, code: string, name: string }
  form: FormComponentProps['form']
  // 确认更新
  onBorrow: ({ restoreTime, productionLineId }: BorrowModalFormParams) => void
  // 关闭确认框
  onCancel: () => void
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14, offset: 2 },
}

const mapStateToProps = (state: IConnectState) => {
  return {
    visible: toolUnitBorrowModalVisibleSelector(state),
    toolInfo: toolBorrowUnitInfoSelector(state),
  }
}

const BorrowModal: React.FC<BorrowModalProps> = props => {
  const {
    visible,
    toolInfo,
    form,
    onBorrow,
    onCancel,
  } = props

  const { getFieldDecorator } = form

  // 借出夹具
  const handleOk = () => {
    form.validateFields((err, values) => {
      if (!err) {
        // 提交表单
        onBorrow({
          id: toolInfo.id,
          productionLineId: values.productionLineId,
          // 时间是一个moment对象
          restoreTime: Number((values.restoreTime as Moment).format('x')),
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
      title="申请借用"
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
        <Form.Item label="生产线">
          {getFieldDecorator('productionLineId', {
            rules: [{ required: true, message: '请选择生产线' }],
          })(
            <Select>
              <Select.Option value="-1">--暂不选择--</Select.Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="预计归还时间">
          {getFieldDecorator('restoreTime', {
            rules: [{ required: true, message: '请选择预计归还时间' }],
          })(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create<BorrowModalProps>()(connect(mapStateToProps)(BorrowModal))
