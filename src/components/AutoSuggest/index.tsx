/**
 * 自动建议框
 */

import React from 'react'
import { AutoComplete, Select, Input, Icon } from 'antd'
import { isNil } from 'lodash'
// import { AutoCompleteProps } from 'antd/es/auto-complete'

export type AutoSuggestItemType = {
  key: string // 最终填充
  label: string // 用于向用户展示
}

interface AutoSuggestProps {
  value: AutoSuggestItemType
  onChange: (value: AutoSuggestItemType) => void
  onUpdate: (search: string) => void
  dataSource: AutoSuggestItemType[]
}

const AutoSuggest: React.ForwardRefExoticComponent<
  AutoSuggestProps
> = React.forwardRef((props, ref) => {
  const {
    value,
    onChange,
    onUpdate,
    dataSource = [],
  } = props

  // 暂时存储表单内容
  const [inputValue, setInputValue] = React.useState(isNil(value) ? '' : value.label)
  const [searchValue, setSearchValue] = React.useState<any>(null)

  // 处理dataSourceId,
  const processDataSource = dataSource.map((item: any) => ({
    ...item,
    key: `@${item.key}`,
  }))

  // 处理触发变化
  const triggerChange = (currency: any) => {
    const search = isNil(currency) ? undefined : currency
    onChange(search)
  }


  /**
   * 处理内容变化
   * 当输入内容直接匹配到key时，会直接跳为label的值
   */
  const handleChange = (newInputValue: any) => {
    // 回填输入框数据
    setInputValue(newInputValue)

    // 匹配该项是否存在与dataSource中
    const selectItem = dataSource.find((item: any) => item.label.toUpperCase() === newInputValue.toUpperCase())
    if (isNil(selectItem) === false) {
      // 存在,此时放入searchValue中
      setSearchValue(selectItem)
    }

    // 触发更新
    triggerChange(selectItem)

    // 触发刷新数据
    onUpdate(newInputValue)
  }

  // 处理选择更新
  const handleSelect = (_, option: any) => {
    const {
      props: {
        children: label,
      },
    } = option
    //  匹配出dataSource中的源数据
    const selectItem = dataSource.find((item: any) => item.label === label)
    // 存入searchValue中
    setSearchValue(selectItem)

    // 触发更新
    triggerChange(selectItem)
  }

  /**
   * 处理清除
   */
  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation()

    // 如果已经清空，则不再去响应事件
    if (isNil(searchValue) && inputValue === '') {
      return
    }

    // 清除内容
    setSearchValue(null)
    setInputValue('')
    triggerChange(null)
  }

  /**
   * 处理失焦,回填确认的搜索数据
   */
  const handleBlur = () => {
    const search = isNil(searchValue) ? '' : searchValue.label
    setInputValue(search)
  }


  // 渲染dataSource
  const handleRenderDataSource = (item: any) => (
    <Select.Option key={item.key}>{item.label}</Select.Option>
  )

  return (
    <AutoComplete
      ref={ref}
      value={inputValue}
      dataSource={processDataSource.map(handleRenderDataSource)}
      onChange={handleChange}
      onBlur={handleBlur}
      onSelect={handleSelect}
    >
      <Input
        prefix={<Icon type="search" />}
        suffix={<Icon onClick={handleClear} type="close-circle" />}
      />
    </AutoComplete>
  )
})

export default AutoSuggest
