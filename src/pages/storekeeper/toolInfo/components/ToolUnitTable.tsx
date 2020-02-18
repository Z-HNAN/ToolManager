/**
 * 夹具实体列表
 */

import React from 'react'
import { Table, Popconfirm, Divider } from 'antd'
import { ToolInfoUnitSelectType } from '../selector'

interface ToolUnitProps {
  // 是否正在加载中
  loading: boolean
  toolUnits: ToolInfoUnitSelectType[]
  onEdit: (id: string) => void
  onRemove: (id: string) => void
}

const ToolUnit: React.FC<ToolUnitProps> = props => {
  const {
    loading,
    toolUnits,
    onEdit,
    onRemove,
  } = props

  const columns = [
    {
      title: '夹具Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '目前状态',
      dataIndex: 'displayStatus',
      key: 'displayStatus',
    },
    {
      title: '所在柜号',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '入库单号',
      dataIndex: 'billId',
      key: 'billId',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ToolInfoUnitSelectType) => (
        <span>
          <Popconfirm
            title={`确定删除${record.code}`}
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

  return (
    <Table
      columns={columns}
      rowKey="id"
      dataSource={toolUnits}
      loading={loading}
      pagination={false}
    />
  )
}

export default ToolUnit
