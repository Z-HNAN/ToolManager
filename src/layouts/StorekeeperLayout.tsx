/**
 * Storekeeper仓库管理员
 */

import React, { ReactElement } from 'react'
import router from 'umi/router';
import { Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu'

import BasicLayout from './BasicLayout'

interface StorekeeperLayoutProps {
  children: ReactElement
}

// 需要路由跳转的页面

const StorekeeperLayout: React.FC<StorekeeperLayoutProps> = props => {
  const { children } = props

  // 处理router跳转
  function handleMenuClick(param: ClickParam) {
    const { key } = param
    // 替换路由
    router.replace(`/storekeeper/${key}`)
  }

  const menu = (
    <Menu
      mode="inline"
      defaultSelectedKeys={['tool']}
      style={{ height: '100%', borderRight: '0' }}
      onClick={handleMenuClick}
    >
      <Menu.Item key="tool">
        <span><Icon type="user" />工夹具管理</span>
      </Menu.Item>
      <Menu.Item key="purchase">
        <span><Icon type="user" />提交采购</span>
      </Menu.Item>
      <Menu.Item key="repair">
        <span><Icon type="user" />提交报修</span>
      </Menu.Item>
      <Menu.Item key="destory">
        <span><Icon type="user" />提交报废</span>
      </Menu.Item>
      <Menu.Item key="productionline">
        <span><Icon type="user" />生产线管理</span>
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


export default StorekeeperLayout
