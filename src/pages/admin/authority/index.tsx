/**
 * 权限管理
 */

import React from 'react'

import { WhiteSpace, AdvancedSearch } from '@/components'

interface AuthorityProps {

}

const Authority: React.FC<AuthorityProps> = () => {

  const handleSearch = (values: any) => {
    console.log(values)
  }

  return (
    <div>
      <AdvancedSearch
        search={[
          ['姓名', 'name', 'text'],
          ['体重', 'weight', 'number'],
          ['身高', 'height', 'number'],
        ]}
        onSearch={handleSearch}
      />
      <WhiteSpace />
    </div>
  )
}

export default Authority
