/**
 * Supervisor监管员布局
 */

import React from 'react'
import router from 'umi/router';
import { Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu'

import BasicLayout from './BasicLayout'


// 需要路由跳转的页面

const SupervisorLayout: React.FC<any> = props => {
  const { children } = props

  // 处理router跳转
  function handleMenuClick(param: ClickParam) {
    const { key } = param
    // 替换路由
    router.replace(`/supervisor/${key}`)
  }

  const menu = (
    <Menu
      mode="inline"
      defaultSelectedKeys={['order']}
      style={{ height: '100%', borderRight: '0' }}
      onClick={handleMenuClick}
    >
      <Menu.Item key="order">
        <span><Icon type="user" />处理申请</span>
      </Menu.Item>
      <Menu.SubMenu
        key="manager"
        title={<span><Icon type="user" />夹具管理</span>}
      >
        <Menu.Item key="manager/create">新增类目</Menu.Item>
        <Menu.Item key="manager/list">类目列表</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="history" disabled>
        <span><Icon type="user" />历史纪录</span>
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


export default SupervisorLayout
