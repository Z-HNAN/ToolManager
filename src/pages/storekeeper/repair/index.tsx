/**
 * 提交报修
 */

import React from 'react'
import { Dispatch, AnyAction } from 'redux'
import { connect } from 'dva'
import { Row, Col, Button } from 'antd'
import { EditRepairOrderType } from '@/models/storekeeper'
import { IConnectState } from '@/models/connect'
import { WhiteSpace } from '@/components'
import OrderTable from './components/OrderTable'
import RepairCard from './components/RepairCard'
import OrderModal from './components/OrderModal'
import OrderEditModal from './components/OrderEditModal'
import {
  RepairOrderSelectType,
  repairOrderSelector,
  RepairUnitSelectType,
  repairUnitSelector,
  showRepairOrderModalSelector,
  showOrderEditModalSelector,
} from './selector'
import styles from './index.less'


interface RepairProps {
  dispatch: Dispatch<AnyAction>
  repairOrders: RepairOrderSelectType[]
  fetchRepairOrderLoading: boolean
  noOrderRepairUnits: RepairUnitSelectType[]
  showRepairModal: boolean
  showEditModal: boolean
}

const mapStateToProps = (state: IConnectState) => {
  return {
    repairOrders: repairOrderSelector(state),
    noOrderRepairUnits: repairUnitSelector(state)('-1'),
    fetchRepairOrderLoading: state.loading.effects['storekeeper/fetchRepairOrder'],
    showRepairModal: showRepairOrderModalSelector(state),
    showEditModal: showOrderEditModalSelector(state),
  }
}

const Repair: React.FC<RepairProps> = props => {
  const {
    dispatch,
    fetchRepairOrderLoading,
    repairOrders,
    noOrderRepairUnits,
    showRepairModal,
    showEditModal,
  } = props

  // 查看报修单详情
  const handleOrderInfo = (id: string) => {
    // 更换id
    dispatch({ type: 'storekeeper/changeRepairOrderInfoId', payload: id })
    // 初始化该order下的订单
    dispatch({ type: 'storekeeper/initRepairOrderMapUnit', payload: id })
  }
  // 新增报修单
  const handleCreateOrder = () => {
    dispatch({ type: 'storekeeper/changeEditRepairOrder', payload: null })
  }
  // 删除报修单
  const handleOrderRemove = (id: string) => {
    dispatch({ type: 'storekeeper/removeRepairOrder', payload: id })
  }
  // 编辑报修单
  const handleOrderEdit = (id: string) => {
    dispatch({ type: 'storekeeper/changeEditRepairOrder', payload: id })
  }
  // 确认编辑报修单
  const handleConfirmOrderEdit = (editRepairOrder: EditRepairOrderType) => {
    dispatch({ type: 'storekeeper/updateRepairOrder', payload: editRepairOrder })
  }
  // 取消编辑报修单
  const handleCancelOrderEdit = () => {
    dispatch({ type: 'storekeeper/clearEditRepairOrder' })
  }
  // 从报修单中增加该报修项
  const handleRepairAdd = (repairUnitId: string, orderId: string) => {
    dispatch({ type: 'storekeeper/addRepairToOrder', payload: { repairUnitId, orderId } })
  }
  // 从报修单中移除该报修项
  const handleRepairRemove = (id: string) => {
    dispatch({ type: 'storekeeper/removeRepairFromOrder', payload: id })
  }
  // 提交报修单
  const handleSubmitOrder = (orderId: string) => {
    dispatch({ type: 'storekeeper/submitRepairOrder', payload: orderId })
  }

  return (
    <div>
      <Button className={styles.createButton} type="primary" icon="plus" onClick={handleCreateOrder}>新增报修单</Button>
      <OrderTable
        loading={fetchRepairOrderLoading}
        repairOrders={repairOrders}
        onOrderInfo={handleOrderInfo}
        onRemove={handleOrderRemove}
        onEdit={handleOrderEdit}
      />
      <WhiteSpace />
      {/* <Typography.Title level={4}>待关联的保修项</Typography.Title> */}
      <Row gutter={[24, 16]}>
        {noOrderRepairUnits.map(repairUnit => (
          <Col key={repairUnit.id} span={8}>
            <RepairCard onLink={handleRepairAdd} repairOrders={repairOrders} repairUnit={repairUnit} />
          </Col>
        ))}
      </Row>
      {showRepairModal === true && (
        <OrderModal
          onRemove={handleRepairRemove}
          onSubmit={handleSubmitOrder}
        />
      )}
      {showEditModal === true && (
        <OrderEditModal
          onConfirm={handleConfirmOrderEdit}
          onCancel={handleCancelOrderEdit}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(Repair)
