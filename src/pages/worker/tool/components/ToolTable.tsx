import React from 'react'
import { Popover, Table } from 'antd'
import { PaginationConfig } from 'antd/es/pagination'
import { toolSearchResultSelectType, toolSelectType } from '../selector'

interface UserTableProps {
  // 是否正在加载中
  loading: boolean
  toolResult: toolSearchResultSelectType
  onToolInfo: (id: string) => void
  onChangePage: (currentPage: number) => void
}

const UserTable: React.FC<UserTableProps> = props => {
  const {
    loading,
    toolResult,
    onToolInfo,
    onChangePage,
  } = props

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'F&M&P',
      key: 'F&M&P',
      render: (record: toolSelectType) => (
        <Popover content={(
          <div>
            <p>FamilyNo: {record.familyId}</p>
            <p>ModelNo: {record.modelId}</p>
            <p>PartNo: {record.partId}</p>
          </div>
        )}>
          <a type="primary">查看</a>
        </Popover>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '库存',
      key: 'count',
      render: (record: toolSelectType) => (
        <span>{`${record.nowCount} / ${record.totalCount}`}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: toolSelectType) => (
        <span>
          <a onClick={() => { onToolInfo(record.id) }}>查看详情</a>
        </span>
      ),
    },
  ]

  const pagination: PaginationConfig = {
    total: toolResult.total,
    onChange: onChangePage,
  }

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={toolResult.list}
      loading={loading}
      pagination={pagination}
    />
  )
}

export default UserTable
