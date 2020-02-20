/**
 * 夹具详情
 */

import React from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import { Dispatch, AnyAction } from 'redux'
import { IConnectState } from '@/models/connect'
import { Button, Spin, Empty, Modal } from 'antd'
import { EditToolUnitType } from '@/models/storekeeper'
import { WhiteSpace } from '@/components'
import HeaderComponent from './components/Header'
import BaseInfo from './components/BaseInfo'
import ToolUnitTable from './components/ToolUnitTable'
import ToolUnitModal from './components/ToolUnitModal'

import {
  DestoryUnitSelectType,
  destoryUnitSelector,
  hiddenDestoryUnitSelector,
  hiddenEditModalSelector,
} from './selector'

import styles from './index.less'

export interface ToolinfoProps {
  dispatch: Dispatch<AnyAction>
  destoryUnits: DestoryUnitSelectType[]
  fetchDestoryUnitLoading: boolean
  hiddenDestoryUnit: boolean
  hiddenEditModal: boolean
}

const mapStateToProps = (state: IConnectState) => {
  return {
    destoryUnits: destoryUnitSelector(state),
    fetchDestoryUnitLoading: state.loading.effects['storekeeper/fetchDestoryOrderMapUnit'] as boolean,
    hiddenDestoryUnit: hiddenDestoryUnitSelector(state),
    hiddenEditModal: hiddenEditModalSelector(state),
  }
}

const Toolinfo: React.FC<ToolinfoProps> = props => {
  const {
    dispatch,
    destoryUnits,
    fetchDestoryUnitLoading,
    hiddenDestoryUnit,
    hiddenEditModal,
  } = props

  // 处理页面回退
  const handleBack = () => {
    // 页面回退
    router.replace('/storekeeper/destory')
    // 清除toolInfoId
    dispatch({ type: 'storekeeper/changeDestoryOrderInfoId', payload: null })
  }

  // 处理新增报废夹具实体
  const handleCreateUnit = () => {
    dispatch({ type: 'storekeeper/changeEditDestoryUnit', payload: null })
  }
  // 处理编辑夹具实体
  const handleEditToolUnit = (id: string) => {
    dispatch({ type: 'storekeeper/changeEditDestoryUnit', payload: id })
  }
  // 确认编辑
  const handleConfirmEdit = (editToolUnit: any) => {
    dispatch({ type: 'storekeeper/updateDestoryUnit', payload: { toolId: editToolUnit.code.key, code: editToolUnit.code.label, remark: editToolUnit.remark } })
  }
  // 取消编辑
  const handleCancelEdit = () => {
    dispatch({ type: 'storekeeper/clearEditDestoryUnit' })
  }
  // 处理删除夹具实体
  const handleRemoveToolUnit = (id: string) => {
    dispatch({ type: 'storekeeper/removeDestoryFromOrder', payload: id })
  }
  // 处理提交报表
  const handleSubmitOrder = () => {
    Modal.confirm({
      title: '确定要提交该报废单吗？',
      onOk() {
        dispatch({ type: 'storekeeper/submitDestoryOrder' })
      },
    })
  }

  let unitDOM = (
    <Spin spinning={fetchDestoryUnitLoading === true}>
      <Empty description="暂未获取到夹具实体信息" />
    </Spin >
  )
  if (hiddenDestoryUnit === false) {
    unitDOM = (
      <ToolUnitTable
        loading={fetchDestoryUnitLoading}
        destoryUnits={destoryUnits}
        onEdit={handleEditToolUnit}
        onRemove={handleRemoveToolUnit}
      />
    )
  }

  return (
    <div>
      <HeaderComponent onBack={handleBack} />
      {unitDOM}
      <div className={styles.actions}>
        <Button className={styles.submitButton} type="primary" icon="plus" onClick={handleSubmitOrder}>提交报废单</Button>
        <Button className={styles.createButton} type="primary" icon="plus" onClick={handleCreateUnit}>新增报废项</Button>
      </div>
      {hiddenEditModal === false && (
        <ToolUnitModal
          onConfirm={handleConfirmEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(Toolinfo)
