/**
 * 归还夹具
 */

import React from 'react'
import { connect } from 'dva'
import { router } from 'umi'
import { Dispatch, AnyAction } from 'redux'

import { IConnectState } from '@/models/connect'
import BorrowModal, { BorrowModalFormParams } from './components/BorrowModal'
import RepairModal, { RepairModalFormParams } from './components/RepairModal'
import RestoreModal, { RestoreModalFormParams } from './components/RestoreModal'
import HeaderComponent from './components/Header'
import BorrowTable from './components/BorrowTable'

import {
  BorrowToolSelectType,
  borrowToolSelector,
} from './selector'

interface RestoreProps {
  dispatch: Dispatch<AnyAction>
  borrowTools: BorrowToolSelectType[]
  fetchBorrowToolLoading: boolean
}

const mapStateToProps = (state: IConnectState) => {
  return {
    borrowTools: borrowToolSelector(state),
    fetchBorrowToolLoading: (state.loading.effects['worker/fetchBorrowTools']) as boolean,
  }
}

const Restore: React.FC<RestoreProps> = props => {
  const {
    dispatch,
    borrowTools,
    fetchBorrowToolLoading,
  } = props

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
    dispatch({ type: 'worker/changeBorrowToolBorrowId', payload: id })
  }
  // 处理确认借用夹具
  const handleConfirmBorrow = ({ id, productionLineId, restoreTime }: BorrowModalFormParams) => {
    // 提交借用夹具，借用成功后，会删除BorrowId，关闭modal
    dispatch({ type: 'worker/borrowToolReBorrow', payload: { id, productionLineId, restoreTime } })
  }
  // 处理取消借用夹具
  const handleCancelBorrow = () => {
    dispatch({ type: 'worker/changeBorrowToolBorrowId', payload: null })
  }

  // 处理提交维护
  const handleRepair = (id: string) => {
    dispatch({ type: 'worker/changeBorrowToolRepairId', payload: id })
  }
  // 处理确认维护夹具
  const handleConfirmRepair = ({ id, remark }: RepairModalFormParams) => {
    // 提交维护夹具，维护成功后，会删除RepairId，关闭modal
    dispatch({ type: 'worker/borrowToolRepair', payload: { id, remark } })
  }
  // 处理取消借用夹具
  const handleCancelRepair = () => {
    dispatch({ type: 'worker/changeBorrowToolRepairId', payload: null })
  }

  // 处理归还
  const handleRestore = (id: string) => {
    dispatch({ type: 'worker/changeBorrowToolRestoreId', payload: id })
  }
  // 处理确认归还夹具
  const handleConfirmRestore = ({ id }: RestoreModalFormParams) => {
    // 提交归还夹具，归还成功后，会删除RestoreId，关闭modal
    dispatch({ type: 'worker/borrowToolRestore', payload: { id } })
  }
  // 处理取消归还夹具
  const handleCancelRestore = () => {
    dispatch({ type: 'worker/changeBorrowToolRestoreId', payload: null })
  }

  return (
    <div>
      <HeaderComponent onBack={handleBack} />
      <BorrowTable
        borrowTools={borrowTools}
        loading={fetchBorrowToolLoading === true}
        onBorrow={handleBorrow}
        onRepair={handleRepair}
        onRestore={handleRestore}
      />
      <BorrowModal
        onBorrow={handleConfirmBorrow}
        onCancel={handleCancelBorrow}
      />
      <RepairModal
        onRepair={handleConfirmRepair}
        onCancel={handleCancelRepair}
      />
      <RestoreModal
        onRestore={handleConfirmRestore}
        onCancel={handleCancelRestore}
      />
    </div>
  )
}

export default connect(mapStateToProps)(Restore)
