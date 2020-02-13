/**
 * Root最外层Layout
 */

import React, { ReactElement } from 'react'
import { Modal } from 'antd';
import { isNil } from 'lodash'
import { IConnectState } from '@/models/connect';
import { DialogType } from '@/models/global'
import { connect } from 'dva'
import { Dispatch, AnyAction } from 'redux';

interface RootLayoutProps {
  dispatch: Dispatch<AnyAction>
  children: ReactElement
  dialog: DialogType
}

const mapStateToProps = (state: IConnectState) => {
  const { dialog } = state.global
  return { dialog }
}

const RootLayout: React.FC<RootLayoutProps> = props => {
  const { children, dialog, dispatch } = props

  // 关闭Dialog
  const handleClearDialog = () => {
    dispatch({ type: 'global/changeDialog', payload: null })
  }

  // dialog发生变化使用
  React.useEffect(() => {
    if (isNil(dialog)) {
      return
    }
    
    // 弹出Dialog-UI
    Modal[dialog.type]({
      content: dialog.msg,
      onOk: handleClearDialog,
    })
  }, [dialog, handleClearDialog])

  return children
}


export default connect(mapStateToProps)(RootLayout)
