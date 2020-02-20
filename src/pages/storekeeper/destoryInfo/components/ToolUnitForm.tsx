import React from 'react'
import { FormComponentProps } from 'antd/es/form'
import { connect } from 'dva'
import { Dispatch, AnyAction } from 'redux'
import { Form, Input } from 'antd'
import { AutoSuggest } from '@/components'
import { EditDestoryUnitType } from '@/models/storekeeper'
import { IConnectState } from '@/models/connect'

import {
  ToolCodeSelectType,
  toolCodeSelector,
} from '../selector'

interface ToolUnitFormProps {
  dispatch: Dispatch<AnyAction>
  form: FormComponentProps['form']
  edit: EditDestoryUnitType
  toolCodes: ToolCodeSelectType[]
}

// 表单布局
const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
  },
}

const mapStateToProps = (state: IConnectState) => {
  const { editDestoryUnit } = state.storekeeper
  return {
    edit: (editDestoryUnit as EditDestoryUnitType),
    toolCodes: toolCodeSelector(state),
  }
}

const ToolUnitForm: React.FC<ToolUnitFormProps> = props => {
  const {
    dispatch,
    form,
    edit,
    toolCodes,
  } = props
  const { getFieldDecorator } = form

  React.useEffect(() => {
    form.setFieldsValue({
      code: {
        key: edit.toolId,
        label: edit.code,
      },
      remark: edit.remark,
    })
  }, [edit])

  // 处理更新Code搜索框内数据
  const handleUpdate = (search: string) => {
    dispatch({ type: 'storekeeper/fetchToolCodeSearch', payload: search })
  }

  return (
    <Form {...formItemLayout}>
      <Form.Item label="Code">
        {getFieldDecorator('code', {
          rules: [{ required: true, message: '请完善夹具Code' }],
        })(
          <AutoSuggest
            dataSource={toolCodes}
            onUpdate={handleUpdate}
          />,
        )}
      </Form.Item>
      <Form.Item label="备注">
        {getFieldDecorator('remark', {
          rules: [{ required: true, message: '请输入报废备注' }],
        })(
          <Input />,
        )}
      </Form.Item>
    </Form>
  )
}

export default connect(mapStateToProps)(ToolUnitForm)
