/**
 * 生产线管理
 */

import React from 'react'
import { Dispatch, AnyAction } from 'redux'
import { connect } from 'dva'
import { Button, Spin, Empty } from 'antd'
import { AdvancedSearch, WhiteSpace } from '@/components'
import { IConnectState } from '@/models/connect'
import { ProductionlineSearch } from '@/models/storekeeper'
import { undefinedToNull } from '@/utils'
import { BasicPagation } from '@/models/global'
import ProductionlineTable from './components/ProductionlineTable'
import ProductionlineModal from './components/ProductionlineModal'
import {
  hiddenSearchResultSelector,
  hiddenEditProductionlineModalSelector,
  ProductionlineResultSelectType,
  productionlineSelector,
  pagationStatusSelector,
} from './selector'

import styles from './index.less'

interface ProductionlineProps {
  dispatch: Dispatch<AnyAction>
  hiddenResult: boolean
  hiddenEditModal: boolean
  searchLoading: boolean
  productionlineResult: ProductionlineResultSelectType
  pagationStatus: BasicPagation
}

export type EditProductionlineType = {
  id: string | null
  name: string
  remark: string
}

export const EMPTY_EDIT_PRODUCTIONLINE: EditProductionlineType = {
  id: null,
  name: '',
  remark: '',
}

const mapStateToProps = (state: IConnectState) => {
  return {
    hiddenResult: hiddenSearchResultSelector(state),
    hiddenEditModal: hiddenEditProductionlineModalSelector(state),
    searchLoading: state.loading.effects['storekeeper/searchProductionlineResult'],
    productionlineResult: productionlineSelector(state),
    pagationStatus: pagationStatusSelector(state),
  }
}

const Productionline: React.FC<ProductionlineProps> = props => {
  const {
    dispatch,
    hiddenResult,
    hiddenEditModal,
    searchLoading,
    productionlineResult,
    pagationStatus,
  } = props


  // 确认搜索
  const handleSearch = (productionlineSearch: ProductionlineSearch) => {
    dispatch({ type: 'storekeeper/changeProductionlineAdvancedSearchContent', payload: undefinedToNull(productionlineSearch) })
    dispatch({ type: 'storekeeper/clearProductionlineSearchResult' })
    dispatch({ type: 'storekeeper/searchProductionlineResult' })
  }
  // 取消搜索
  const handleCancel = () => {
    dispatch({ type: 'storekeeper/changeProductionlineAdvancedSearchContent', payload: null })
    dispatch({ type: 'storekeeper/clearProductionlineSearchResult' })
  }

  // 新增productionline
  const handleCreate = () => {
    dispatch({ type: 'storekeeper/changeEditProductionline', payload: null })
  }
  // 编辑productionline
  const handleEdit = (id: string) => {
    dispatch({ type: 'storekeeper/changeEditProductionline', payload: id })
  }
  // 取消确认编辑
  const handleCancelEdit = () => {
    dispatch({ type: 'storekeeper/clearEditProductionline' })
  }
  // 提交确认编辑
  const handleSubmitEdit = (edit: EditProductionlineType) => {
    dispatch({ type: 'storekeeper/updateEditProductionline', payload: edit })
  }
  // 删除productionline
  const handleRemove = (id: string) => {
    dispatch({ type: 'storekeeper/removeProductionline', payload: id })
  }


  // 更换页数
  const handleChangePage = (targetPage: number) => {
    // 可能存在跳页的情况
    const { page } = pagationStatus
    const step = targetPage - page > 0 ? targetPage - page : 0
    for (let i = 1; i <= step; i += 1) {
      dispatch({ type: 'storekeeper/searchProductionlineResult', payload: (page + i) })
    }
  }


  let resultDOM = (
    <Spin spinning={searchLoading === true}>
      <Empty description="点击搜索按钮进行筛选" />
    </Spin >
  )
  if (hiddenResult === false) {
    resultDOM = (
      <ProductionlineTable
        loading={searchLoading}
        productionlineResult={productionlineResult}
        onEdit={handleEdit}
        onRemove={handleRemove}
        onChangePage={handleChangePage}
      />
    )
  }

  return (
    <div>
      <Button className={styles.createButton} type="primary" icon="plus" onClick={handleCreate}>新增生产线</Button>
      <AdvancedSearch
        interval={12}
        search={[
          ['生产线名称', 'name', 'text'],
        ]}
        onSearch={handleSearch}
        onClear={handleCancel}
      />
      <WhiteSpace />
      {resultDOM}
      {hiddenEditModal === false && (
        <ProductionlineModal
          onConfirm={handleSubmitEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  )
}

export default connect(mapStateToProps)(Productionline)
