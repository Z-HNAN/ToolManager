import React from 'react'
import { connect } from 'dva'
import { Dispatch, AnyAction } from 'redux'
import { Table, Modal, Popconfirm } from 'antd'
import { IConnectState } from '@/models/connect'
import {
  RepairOrderSelectType,
  RepairUnitSelectType,
  repairUnitSelector,
  repairOrderInfoSelector,
} from '../selector'

import styles from '../index.less'

interface OrderModalProps {
  dispatch: Dispatch<AnyAction>
  fetchRepairUnitLoading: boolean
  repairUnits: RepairUnitSelectType[]
  orderInfo: RepairOrderSelectType
  onRemove: (id: string) => void
  onSubmit: (id: string) => void
}

const mapStateToProps = (state: IConnectState) => {
  const orderId = state.storekeeper.repairOrderInfoId
  return {
    repairUnits: repairUnitSelector(state)(orderId as string),
    fetchRepairUnitLoading: state.loading.effects['storekeeper/fetchRepairOrderMapUnit'] as boolean,
    orderInfo: repairOrderInfoSelector(state),
  }
}

const OrderModal: React.FC<OrderModalProps> = props => {
  const {
    dispatch,
    fetchRepairUnitLoading,
    repairUnits,
    orderInfo,
    onRemove,
    onSubmit,
  } = props

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '提交日期',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '提交人',
      dataIndex: 'workerName',
      key: 'workerName',
    },
    {
      title: '报修备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RepairUnitSelectType) => (
        <Popconfirm
          title={`确定移除${record.code}`}
          onConfirm={() => { onRemove(record.id) }}
          okText="确认"
          cancelText="取消"
        >
          <a>移除</a>
        </Popconfirm>
      ),
    },
  ]

  const handleSubmit = () => {
    onSubmit(orderInfo.id)
  }

  const handleCancel = () => {
    dispatch({ type: 'storekeeper/changeRepairOrderInfoId', payload: null })
  }


  return (
    <Modal
      className={styles.orderModal}
      title={`${orderInfo.name} 详情`}
      visible
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="提交报表"
      cancelText="关闭"
    >
      <Table
        columns={columns}
        rowKey="id"
        dataSource={repairUnits}
        loading={fetchRepairUnitLoading}
      />
    </Modal>
  )
}

export default connect(mapStateToProps)(OrderModal)
