/**
 * 权限管理
 */

import React from 'react'
import { connect } from 'dva'
import { Dispatch, AnyAction } from 'redux'
import { isNil } from 'lodash'
import { Collapse, Icon, Modal, Input } from 'antd'
import { IConnectState } from '@/models/connect'
import { AuthorityType } from '@/models/admin'

interface AuthorityProps {
  dispatch: Dispatch<AnyAction>
  authorities: AuthorityType[]
  updateAuthorityLoading: boolean
}

const mapStateToProps = (state: IConnectState) => {
  const { authorities } = state.admin
  const updateAuthorityLoading = (state.loading.effects['admin/updateAuthority']) as boolean
  return {
    authorities,
    updateAuthorityLoading,
  }
}

const Authority: React.FC<AuthorityProps> = props => {
  const {
    authorities,
    updateAuthorityLoading,
    dispatch,
  } = props

  // 修改的权限
  const [editAuthority, setEditAuthority] = React.useState<AuthorityType | null>(null)

  // 得到collapse的设置按钮
  const genExtra = (authority: AuthorityType) => (
    <Icon
      type="edit"
      onClick={event => {
        event.stopPropagation()
        setEditAuthority(authority)
      }}
    />
  )

  // 处理更新
  const handleUpdate = () => {
    const { id, remark } = (editAuthority) as AuthorityType
    dispatch({ type: 'admin/updateAuthority', payload: { id, remark } })
  }
  // // 更新完毕，关闭modal
  React.useEffect(() => {
    if (updateAuthorityLoading === false) {
      setEditAuthority(null)
    }
  }, [setEditAuthority, updateAuthorityLoading])

  return (
    <div>
      <Collapse defaultActiveKey={authorities.map(({ id }) => id)} >
        {authorities.map(authority => (
          <Collapse.Panel
            key={authority.id}
            header={authority.name}
            extra={genExtra(authority)}
          >
            <p>{authority.remark}</p>
          </Collapse.Panel>
        ))}
      </Collapse>
      {
        isNil(editAuthority) === false && (
          <Modal
            title={`修改 ${editAuthority?.name} 权限备注`}
            visible
            onOk={handleUpdate}
            confirmLoading={updateAuthorityLoading}
            onCancel={() => setEditAuthority(null) }
          >
            <Input.TextArea
              value={editAuthority?.remark}
              autoSize={{ minRows: 5 }}
              onChange={({ target: { value: remark } }) => setEditAuthority({ ...(editAuthority as AuthorityType), remark })}
            />
          </Modal>
        )
      }
    </div>
  )
}

export default connect(mapStateToProps)(Authority)
