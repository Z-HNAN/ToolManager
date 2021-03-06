/**
 * Admin管理员
 */

import React from 'react'
import router from 'umi/router';
import { Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu'

import BasicLayout from './BasicLayout'

const AdminLayout: React.FC<any> = props => {
  const { children } = props

  // 处理router跳转
  function handleMenuClick (param: ClickParam) {
    const { key } = param
    // 替换路由
    router.replace(`/admin/${key}`)
  }

  // Admin菜单
  const menu = (
    <Menu
      mode="inline"
      defaultSelectedKeys={['department']}
      style={{ height: '100%', borderRight: '0' }}
      onClick={handleMenuClick}
    >
      <Menu.Item key="department">
        <span><Icon type="user" />工作部门</span>
      </Menu.Item>
      <Menu.Item key="authority">
        <span><Icon type="user" />权限管理</span>
      </Menu.Item>
      <Menu.Item key="user">
        <span><Icon type="user" />人员管理</span>
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


export default AdminLayout
