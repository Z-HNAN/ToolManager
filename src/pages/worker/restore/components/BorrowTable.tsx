/**
 * 借用夹具列表
 */
import React from 'react'
import { Table } from 'antd'

import {
  BorrowToolSelectType,
} from '../selector'

interface BorrowTableProps {
  borrowTools: BorrowToolSelectType[]
  loading: boolean,
  onBorrow: (id: string) => void
  onRepair: (id: string) => void
  onRestore: (id: string) => void
}

const BorrowTable: React.FC<BorrowTableProps> = props => {
  const {
    borrowTools,
    loading,
    onBorrow,
    onRepair,
    onRestore,
  } = props

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '借出时间',
      dataIndex: 'borrowTime',
      key: 'borrowTime',
    },
    {
      title: '归还时间',
      dataIndex: 'restoreTime',
      key: 'restoreTime',
    },
    {
      title: '剩余时间',
      dataIndex: 'remainTime',
      key: 'remainTime',
    },
    {
      title: '归还库位',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '续借',
      key: 'borrow',
      render: (record: BorrowToolSelectType) => (
        <span>
          <a onClick={() => { onBorrow(record.id) }}>点击续借</a>
        </span>
      ),
    },
    {
      title: '报修',
      key: 'repair',
      render: (record: BorrowToolSelectType) => (
        <span>
          <a onClick={() => { onRepair(record.id) }}>点击报修</a>
        </span>
      ),
    },
    {
      title: '归还',
      key: 'restore',
      render: (record: BorrowToolSelectType) => (
        <span>
          <a onClick={() => { onRestore(record.id) }}>点击归还</a>
        </span>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={borrowTools}
      loading={loading}
      pagination={false}
    />
  )
}

export default BorrowTable
