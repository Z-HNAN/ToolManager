/**
 * 我的
 */

import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import Router from 'umi/router';

import styles from './index.less'

import FormComponent, { LoginParamsType } from './components/Form'

export interface LoginProps {
  dispatch: Dispatch
}

const Login: React.FC<LoginProps> = props => {
  const {
    dispatch,
  } = props

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // };

  // const handleClick = () => {
  //   Router.push('/your')
  // }

  // 处理登录
  const handleSubmit = (values: LoginParamsType) => {
    const { username, password } = values
    dispatch({ type: 'global/login', payload: { username, password } })
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            {/* <img alt="logo" className={styles.logo} /> */}
            <span className={styles.title}>登录</span>
          </div>
          <div className={styles.desc}>description</div>
        </div>
        <FormComponent
          onSubmit={handleSubmit}
          className={styles.from}
        />
      </div>
    </div>
  )
}

export default connect()(Login)
