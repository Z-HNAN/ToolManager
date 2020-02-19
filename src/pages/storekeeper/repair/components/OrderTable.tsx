import React from 'react'
import { Modal, Table, Divider } from 'antd'
import { RepairOrderSelectType } from '../selector'

interface OrderTableProps {
  // 是否正在加载中
  loading: boolean
  repairOrders: RepairOrderSelectType[]
  onOrderInfo: (id: string) => void
  onRemove: (id: string) => void
  onEdit: (id: string) => void
}

const OrderTable: React.FC<OrderTableProps> = props => {
  const {
    loading,
    repairOrders,
    onOrderInfo,
    onRemove,
    onEdit,
  } = props

  // 处理删除二次确认
  const handleRemove = (record: RepairOrderSelectType) => {
    Modal.confirm({
      title: `确认要删除报表${record.name}吗？`,
      content: '其中报表项将会被重新打散，等待再次分配',
      onOk() { onRemove(record.id) },
    })
  }

  const columns = [
    {
      title: '报表名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '报表备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '报表详情',
      key: 'info',
      render: (record: RepairOrderSelectType) => (
        <span>
          <a onClick={() => { onOrderInfo(record.id) }}>点击查看</a>
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: RepairOrderSelectType) => (
        <span>
          <a onClick={() => { handleRemove(record) }}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => { onEdit(record.id) }}>修改</a>
        </span>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={repairOrders}
      loading={loading}
      pagination={false}
    />
  )
}

export default OrderTable
