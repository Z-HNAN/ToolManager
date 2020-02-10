/**
 * Repairer检修员
 */

import React, { ReactElement } from 'react'
import router from 'umi/router';
import { Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu'

import BasicLayout from './BasicLayout'

interface RepairLayoutProps {
  children: ReactElement
}

// 需要路由跳转的页面

const RepairLayout: React.FC<RepairLayoutProps> = props => {
  const { children } = props

  // 处理router跳转
  function handleMenuClick(param: ClickParam) {
    const { key } = param
    // 替换路由
    router.replace(`/repairer/${key}`)
  }

  const menu = (
    <Menu
      mode="inline"
      defaultSelectedKeys={['order']}
      style={{ height: '100%', borderRight: '0' }}
      onClick={handleMenuClick}
    >
      <Menu.Item key="order">
        <span><Icon type="user" />检修单</span>
      </Menu.Item>
      <Menu.Item key="manager">
        <span><Icon type="user" />检修项管理</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <BasicLayout
      menu={menu}
      content={children}
    />
  );
}


export default RepairLayout
