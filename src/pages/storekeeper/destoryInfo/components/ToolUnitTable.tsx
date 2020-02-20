/**
 * 夹具实体列表
 */

import React from 'react'
import { Table, Popconfirm, Divider } from 'antd'
import { DestoryUnitSelectType } from '../selector'

interface ToolUnitProps {
  // 是否正在加载中
  loading: boolean
  destoryUnits: DestoryUnitSelectType[]
  onEdit: (id: string) => void
  onRemove: (id: string) => void
}

const ToolUnit: React.FC<ToolUnitProps> = props => {
  const {
    loading,
    destoryUnits,
    onEdit,
    onRemove,
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
      title: '报废备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (record: DestoryUnitSelectType) => (
        <span>
          <Popconfirm
            title={`确定移除${record.code}`}
            onConfirm={() => { onRemove(record.id) }}
            okText="确认"
            cancelText="取消"
          >
            <a>移除</a>
          </Popconfirm>
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
      dataSource={destoryUnits}
      loading={loading}
      pagination={false}
    />
  )
}

export default ToolUnit
