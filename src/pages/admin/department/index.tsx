/**
 * 工作部门
 */

import React from 'react'
import { connect } from 'dva'
import { IConnectState } from '@/models/connect'
import { Dispatch, AnyAction } from 'redux'
import { isNil } from 'lodash'
import { Button } from 'antd'
import WorkCellTable from './components/WorkCellTable'
import WorkCellModal from './components/WorkCellModal'
import {
  hidenModalSelector,
  workcellSelector,
  WorkcellSelectType,
} from './selector'

export type EditWorkcellType = {
  id: string | null
  name: string
  managerId: string | null
}

export const EMPTY_WORKCELL_PARAMS: EditWorkcellType = {
  id: null,
  name: '',
  managerId: '-1',
}

interface DepartmentProps {
  dispatch: Dispatch<AnyAction>
  hidenModal: boolean
  workcells: WorkcellSelectType[]
  fetchWorkcellsLoading: boolean
}

const mapStateToProps = (state: IConnectState) => {
  const hidenModal = hidenModalSelector(state)
  const workcells: WorkcellSelectType[] = workcellSelector(state)
  const fetchWorkcellsLoading: boolean = (state.loading.effects['admin/fetchWorkcells']) as boolean

  return {
    hidenModal,
    fetchWorkcellsLoading,
    workcells,
  }
}

const Department: React.FC<DepartmentProps> = props => {
  const {
    dispatch,
    hidenModal,
    fetchWorkcellsLoading,
    workcells,
  } = props

  const handleCreateWorkCell = () => {
    dispatch({ type: 'admin/changeEditWorkCell', payload: null })
  }

  const handleEditWorkCell = (id: string) => {
    dispatch({ type: 'admin/changeEditWorkCell', payload: id })
  }

  const handleCancelWorkCell = () => {
    dispatch({ type: 'admin/clearEditWorkCell' })
  }

  const handleRemoveWorkCell = (id: string) => {
    dispatch({ type: 'admin/removeWorkCell', payload: id })
  }

  const handleConfirmWorkCell = (edit: EditWorkcellType) => {
    dispatch({ type: 'admin/updateWorkCell', payload: edit })
  }

  return (
    <div>
      <Button type="primary" icon="plus" onClick={handleCreateWorkCell}>新增部门</Button>
      <WorkCellTable
        workcells={workcells}
        loading={fetchWorkcellsLoading}
        onEdit={handleEditWorkCell}
        onRemove={handleRemoveWorkCell}
      />
      {
        hidenModal === false &&
        (
          <WorkCellModal
            onConfirm={handleConfirmWorkCell}
            onCancel={handleCancelWorkCell}
          />
        )
      }
    </div>
  )
}

export default connect(mapStateToProps)(Department)
