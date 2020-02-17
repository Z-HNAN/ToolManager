/**
 * 申请借出modal
 */
import React from 'react'
import { connect } from 'dva'
import { Form, Modal, Input } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { IConnectState } from '@/models/connect'
import {
  borrowToolRestoreModalVisibleSelector,
  toolRestoreUnitInfoSelector,
} from '../selector'


export type RestoreModalFormParams = {
  id: string
}

interface BorrowModalProps {
  visible: boolean
  toolInfo: { id: string, code: string, name: string, location: string }
  form: FormComponentProps['form']
  // 确认更新
  onRestore: (restoreModalFormParams: RestoreModalFormParams) => void
  // 关闭确认框
  onCancel: () => void
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14, offset: 2 },
}

const mapStateToProps = (state: IConnectState) => {
  return {
    visible: borrowToolRestoreModalVisibleSelector(state),
    toolInfo: toolRestoreUnitInfoSelector(state),
  }
}

const BorrowModal: React.FC<BorrowModalProps> = props => {
  const {
    visible,
    toolInfo,
    onRestore,
    onCancel,
  } = props

  // 借出夹具
  const handleOk = () => {
    // 提交表单
    onRestore({
      id: toolInfo.id,
    })
  }

  // 取消按钮
  const handleCancel = () => {
    // 关闭表单
    onCancel()
  }

  return (
    <Modal
      title="确认归还"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form {...formItemLayout}>
        <Form.Item label="归还夹具">
          <Input readOnly value={toolInfo.code} />
        </Form.Item>
        <Form.Item label="归还人">
          <Input readOnly value={toolInfo.name} />
        </Form.Item>
        <Form.Item label="归还库位">
          <Input readOnly value={toolInfo.location} />
        </Form.Item>
      </Form>
      <p>确认归还后，请尽快放置于相应的库位，感谢您的配合。</p>
    </Modal>
  )
}

export default connect(mapStateToProps)(BorrowModal)
