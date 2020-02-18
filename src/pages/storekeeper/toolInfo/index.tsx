/**
 * 夹具详情
 */

import React from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import { Dispatch, AnyAction } from 'redux'
import { IConnectState } from '@/models/connect'
import { Button, Spin, Empty } from 'antd'
import { undefinedToNull } from '@/utils'
import { EditToolUnitType } from '@/models/storekeeper'
import { WhiteSpace } from '@/components'
import HeaderComponent from './components/Header'
import BaseInfo from './components/BaseInfo'
import ToolUnitTable from './components/ToolUnitTable'
import ToolUnitModal from './components/ToolUnitModal'

import {
  ToolInfoSelectType,
  toolInfoSelector,
  hiddenToolInfoUnitSelector,
  ToolInfoUnitSelectType,
  toolInfoUnitSelector,
  hiddenEditToolUnitModalSelector,
} from './selector'

import styles from './index.less'

export interface ToolinfoProps {
  dispatch: Dispatch<AnyAction>
  toolInfo: ToolInfoSelectType
  hiddenToolUnit: boolean
  toolUnits: ToolInfoUnitSelectType[]
  fetchToolUnitLoading: boolean
  hiddenModal: boolean
}

const mapStateToProps = (state: IConnectState) => {
  return {
    toolInfo: toolInfoSelector(state),
    hiddenToolUnit: hiddenToolInfoUnitSelector(state),
    toolUnits: toolInfoUnitSelector(state),
    fetchToolUnitLoading: state.loading.effects['storekeeper/fetchToolInfoUnit'] as boolean,
    hiddenModal: hiddenEditToolUnitModalSelector(state),
  }
}

const Toolinfo: React.FC<ToolinfoProps> = props => {
  const {
    dispatch,
    toolInfo,
    hiddenToolUnit,
    fetchToolUnitLoading,
    toolUnits,
    hiddenModal,
  } = props

  const { img: toolImg } = toolInfo

  // 处理页面回退
  const handleBack = () => {
    // 页面回退
    router.replace('/storekeeper/tool')
    // 清除toolInfoId
    dispatch({ type: 'storekeeper/changeToolInfoId', payload: null })
  }

  // 处理新增夹具实体
  const handleCreateToolUnit = () => {
    dispatch({ type: 'storekeeper/changeEditToolUnit', payload: null })
  }
  // 处理编辑夹具实体
  const handleEditToolUnit = (id: string) => {
    dispatch({ type: 'storekeeper/changeEditToolUnit', payload: id })
  }
  // 确认编辑
  const handleConfirmEdit = (editToolUnit: EditToolUnitType) => {
    dispatch({ type: 'storekeeper/updateToolUnit', payload: undefinedToNull(editToolUnit) })
  }
  // 取消编辑
  const handleCancelEdit = () => {
    dispatch({ type: 'storekeeper/clearEditToolUnit' })
  }
  // 处理删除夹具实体
  const handleRemoveToolUnit = (id: string) => {
    dispatch({ type: 'storekeeper/removeToolUnit', payload: id })
  }

  let unitDOM = (
    <Spin spinning={fetchToolUnitLoading === true}>
      <Empty description="暂未获取到夹具实体信息" />
    </Spin >
  )
  if (hiddenToolUnit === false) {
    unitDOM = (
      <ToolUnitTable
        loading={fetchToolUnitLoading}
        toolUnits={toolUnits}
        onEdit={handleEditToolUnit}
        onRemove={handleRemoveToolUnit}
      />
    )
  }

  return (
    <div>
      <HeaderComponent onBack={handleBack} />
      <div className={styles.info}>
        <BaseInfo className={styles.description} toolInfo={toolInfo} />
        <div className={styles.img}>
          <img style={{ width: '100%', height: '100%' }} src={toolImg} alt="夹具图片" />
        </div>
      </div>
      <WhiteSpace height={15} />
      <Button className={styles.createButton} type="primary" icon="plus" onClick={handleCreateToolUnit}>新增夹具实体</Button>
      {unitDOM}
      {hiddenModal === false && (
        <ToolUnitModal
          onConfirm={handleConfirmEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(Toolinfo)
