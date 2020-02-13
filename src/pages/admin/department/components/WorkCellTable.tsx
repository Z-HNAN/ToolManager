import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { WorkcellSelectType } from '../selector'

interface WorkCellTableProps {
  workcells: WorkcellSelectType[]
  loading: boolean
  // 编辑用户
  onEdit: (id: string) => void
  // 删除用户
  onRemove: (id: string) => void
}

const WorkCellTable: React.FC<WorkCellTableProps> = props => {
  const {
    workcells,
    loading,
    onEdit,
    onRemove,
  } = props

  const columns = [
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '经理名称',
      dataIndex: 'managerName',
      key: 'managerName',
    },
    {
      title: '联系方式',
      dataIndex: 'managerPhone',
      key: 'managerPhone',
    },
    {
      title: '变更日志',
      key: 'changeLog',
      render: (record: WorkcellSelectType) => (
        <a onClick={() => console.log(record.id)}>点击查看</a>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: WorkcellSelectType) => (
        <span>
          <a onClick={() => onEdit(record.id) }>修改</a>
          <Divider type="vertical" />
          <Popconfirm
            title={`确定删除${record.name}`}
            onConfirm={() => { onRemove(record.id) }}
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ]

  return (
    <Table columns={columns} rowKey="id" dataSource={workcells} loading={loading} />
  )
}

export default WorkCellTable
