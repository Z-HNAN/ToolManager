
import React from 'react';
import { TabBar } from 'antd-mobile';
import Router from 'umi/router';
import Icon from '@/components/Icon'


import styles from './index.less'

export interface ITabBar {
  title: string
  icon: string
  selectedIcon: string
  link: string
}

export const tabBarData: ITabBar[] = [
  {
    title: '用户',
    icon: 'add',
    selectedIcon: 'add',
    link: '/users',
  },
  {
    title: '我的',
    icon: 'add',
    selectedIcon: 'add',
    link: '/me',
  },
]

interface IProps {
  pathname: string
  [porpName: string]: any
}

// {children.props.location.pathname === link && children}

const MenuBar: React.FC<IProps> = props => {
  const { pathname, children } = props
  return (
    <TabBar>
      {tabBarData.map(({ title, icon, selectedIcon, link }) => (
        <TabBar.Item
          key={link}
          title={title}
          icon={<Icon className={styles.tabBarIcon} type={icon} />}
          selectedIcon={<Icon className={styles.tabBarIcon} type={selectedIcon} />}
          selected={pathname === link}
          onPress={() => Router.push(`${link}`)}
        >
          {/* 匹配到的children路由进行渲染 */}
          {children}
        </TabBar.Item>
      ))}
    </TabBar>
  )
}

export default MenuBar;
