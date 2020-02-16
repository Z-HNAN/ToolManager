/**
 * 夹具详情
 */

import React from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import { Dispatch, AnyAction } from 'redux'
import { WhiteSpace } from '@/components'
import BaseInfo from './components/BaseInfo'
import HeaderComponent from './components/Header'
import ToolunitCollapse from './components/ToolunitCollapse'
import BorrowModal, { BorrowModalFormParams } from './components/BorrowModal'
import RepairModal, { RepairModalFormParams } from './components/RepairModal'
import {
  ToolInfoSelectType,
  toolInfoSelector,
  ToolInfoUnitSelectType,
  toolInfoUnitSelector,
} from './selector'
import { IConnectState } from '@/models/connect'

import styles from './index.less'

export interface ToolinfoProps {
  dispatch: Dispatch<AnyAction>
  toolInfo: ToolInfoSelectType,
  toolInfoUnits: ToolInfoUnitSelectType[],
  toolInfoUnitsLoading: boolean
}

const mapStateToProps = (state: IConnectState) => {
  return {
    toolInfo: toolInfoSelector(state),
    toolInfoUnits: toolInfoUnitSelector(state),
    toolInfoUnitsLoading: (state.loading.effects['worker/fetchToolInfoUnit']) as boolean,
  }
}

const Toolinfo: React.FC<ToolinfoProps> = props => {
  const {
    dispatch,
    toolInfo,
    toolInfoUnits,
    toolInfoUnitsLoading,
  } = props

  const { img: toolImg } = toolInfo

  // 处理页面回退
  const handleBack = () => {
    // 页面回退
    router.replace('/worker/tool')
    // 清除toolInfoId
    dispatch({ type: 'worker/changeToolInfoId', payload: null })
    // 清除toolUnit
    dispatch({ type: 'worker/changeToolInfoUnit', payload: [] })
  }

  // 处理借用夹具
  const handleBorrow = (id: string) => {
    dispatch({ type: 'worker/changeToolUnitBorrowId', payload: id })
  }
  // 处理确认借用夹具
  const handleConfirmBorrow = ({ id, productionLineId, restoreTime }: BorrowModalFormParams) => {
    // 提交借用夹具，借用成功后，会删除BorrowId，关闭modal
    dispatch({ type: 'worker/toolUnitBorrow', payload: { id, productionLineId, restoreTime } })
  }
  // 处理取消借用夹具
  const handleCancelBorrow = () => {
    dispatch({ type: 'worker/changeToolUnitBorrowId', payload: null })
  }

  // 处理提交维护
  const handleRepaire = (id: string) => {
    dispatch({ type: 'worker/changeToolUnitRepairId', payload: id })
  }
  // 处理确认维护夹具
  const handleConfirmRepair = ({ id, remark }: RepairModalFormParams) => {
    // 提交维护夹具，维护成功后，会删除RepairId，关闭modal
    dispatch({ type: 'worker/toolUnitRepair', payload: { id, remark } })
  }
  // 处理取消借用夹具
  const handleCancelRepair = () => {
    dispatch({ type: 'worker/changeToolUnitRepairId', payload: null })
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
      <ToolunitCollapse
        className={styles.toolUnit}
        toolInfoUnits={toolInfoUnits}
        toolInfoUnitsLoading={toolInfoUnitsLoading}
        onRepaire={handleRepaire}
        onBorrow={handleBorrow}
      />
      <BorrowModal
        onBorrow={handleConfirmBorrow}
        onCancel={handleCancelBorrow}
      />
      <RepairModal
        onRepair={handleConfirmRepair}
        onCancel={handleCancelRepair}
      />
    </div>
  )
}

export default connect(mapStateToProps)(Toolinfo)
