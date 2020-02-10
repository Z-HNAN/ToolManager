/**
 * work布局，没有侧边栏
 */

import zhCN from 'antd/es/locale/zh_CN'
import React, { ReactElement } from 'react'
import { Layout, ConfigProvider } from 'antd';

import { Header as HeaderComponent } from './components/Basic'

import styles from './BasicLayout.less'

const { Content } = Layout;

interface PropsType {
  children: ReactElement
}

const BasicLayout: React.FC<PropsType> = props => {
  const {
    children,
  } = props

  return (
    <ConfigProvider locale={zhCN}>
      <Layout>
        <Layout>
          <HeaderComponent />
        </Layout>
        <Layout>
          <Layout className={styles.body}>
            <Content className={styles.content}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}


export default BasicLayout
