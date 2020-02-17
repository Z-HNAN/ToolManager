import React from 'react'
import { Popconfirm, Divider, Table } from 'antd'
import { PaginationConfig } from 'antd/es/pagination'
import { ProductionlineResultSelectType, ProductionlineSelectType } from '../selector'

interface UserTableProps {
  // 是否正在加载中
  loading: boolean
  productionlineResult: ProductionlineResultSelectType
  onEdit: (id: string) => void
  onRemove: (id: string) => void
  onChangePage: (currentPage: number) => void
}

const UserTable: React.FC<UserTableProps> = props => {
  const {
    loading,
    productionlineResult,
    onEdit,
    onRemove,
    onChangePage,
  } = props

  const columns = [
    {
      title: '生产线名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '生产线备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ProductionlineSelectType) => (
        <span>
          <Popconfirm
            title={`确定删除${record.name}`}
            onConfirm={() => { onRemove(record.id) }}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => { onEdit(record.id) }}>修改</a>
        </span>
      ),
    },
  ]

  const pagination: PaginationConfig = {
    total: productionlineResult.total,
    onChange: onChangePage,
  }

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={productionlineResult.list}
      loading={loading}
      pagination={pagination}
    />
  )
}

export default UserTable
