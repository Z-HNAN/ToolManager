import React from 'react'
import { Popconfirm, Divider, Table } from 'antd'
import { PaginationConfig } from 'antd/es/pagination'
import { userResultListSelectType, userSelectType } from '../../selector'

interface UserTableProps {
  // 是否正在加载中
  loading: boolean
  userResult: userResultListSelectType
  onEdit: (id: string) => void
  onRemove: (id: string) => void
  onChangePage: (currentPage: number) => void
}

const UserTable: React.FC<UserTableProps> = props => {
  const {
    loading,
    userResult,
    onEdit,
    onRemove,
    onChangePage,
  } = props

  const columns = [
    {
      title: '员工工号',
      dataIndex: 'workerId',
      key: 'workerId',
    },
    {
      title: '姓名',
      dataIndex: 'authName',
      key: 'authName',
    },
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '权限',
      dataIndex: 'authority',
      key: 'authority',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: userSelectType) => (
        <span>
          <Popconfirm
            title={`确定删除${record.authName}`}
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
    total: userResult.total,
    onChange: onChangePage,
  }

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={userResult.list}
      loading={loading}
      pagination={pagination}
    />
  )
}

export default UserTable
