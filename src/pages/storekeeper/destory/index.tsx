/**
 * 提交报废
 */

import React from 'react'
import { Button } from 'antd'
import { connect } from 'dva'
import { router } from 'umi'
import { Dispatch, AnyAction } from 'redux'
import { IConnectState } from '@/models/connect'
import { EditDestoryOrderType } from '@/models/storekeeper'
import OrderTable from './components/OrderTable'
import OrderModal from './components/OrderModal'
import {
  DestoryOrderSelectType,
  destoryOrderSelector,
  showOrderModalSelector,
} from './selector'

import styles from './index.less'

interface DestoryProps {
  dispatch: Dispatch<AnyAction>
  destoryOrders: DestoryOrderSelectType[]
  fetchDestoryOrderLoading: boolean
  showEditOrder: boolean
}

const mapStateToProps = (state: IConnectState) => {
  return {
    destoryOrders: destoryOrderSelector(state),
    fetchDestoryOrderLoading: state.loading.effects['storekeeper/fetchDestoryOrder'],
    showEditOrder: showOrderModalSelector(state),
  }
}

const Destory: React.FC<DestoryProps> = props => {
  const {
    dispatch,
    destoryOrders,
    fetchDestoryOrderLoading,
    showEditOrder,
  } = props

  // 新增报废单
  const handleCreateOrder = () => {
    dispatch({ type: 'storekeeper/changeEditDestoryOrder', payload: null })
  }
  // 编辑报废单
  const handleEditOrder = (id: string) => {
    dispatch({ type: 'storekeeper/changeEditDestoryOrder', payload: id })
  }
  // 确定编辑报废单
  const handleConfirmEditOrder = (editDestoryOrder: EditDestoryOrderType) => {
    dispatch({ type: 'storekeeper/updateDestoryOrder', payload: editDestoryOrder })
  }
  // 取消编辑报废单
  const handleCancelEditOrder = () => {
    dispatch({ type: 'storekeeper/clearEditDestoryOrder' })
  }
  // 删除报废单
  const handleRemoveOrder = (id: string) => {
    dispatch({ type: 'storekeeper/removeDestoryOrder', payload: id })
  }

  // 查看报废单详情
  const handleOrderInfo = (id: string) => {
    dispatch({ type: 'storekeeper/changeDestoryOrderInfoId', payload: id })
    // 去报表详情内查看
    router.push('/storekeeper/destoryInfo')
  }

  return (
    <div>
      <Button className={styles.createButton} type="primary" icon="plus" onClick={handleCreateOrder}>新增报废单</Button>
      <OrderTable
        destoryOrders={destoryOrders}
        loading={fetchDestoryOrderLoading}
        onOrderInfo={handleOrderInfo}
        onRemove={handleRemoveOrder}
        onEdit={handleEditOrder}
      />
      {showEditOrder === true && (
        <OrderModal
          onConfirm={handleConfirmEditOrder}
          onCancel={handleCancelEditOrder}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(Destory)
