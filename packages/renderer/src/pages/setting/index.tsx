import { Box, Select } from "@mantine/core"
import { useQuery } from "@apollo/client"

import { GET_LIST_COMPANIES_BY_USER } from "/@/graphql/query"
import { useGlobal } from "/@/context/global"
import { useUser } from "/@/context/user"

import HeaderSection from "/@/components/header/HeaderSection"
import client from "/@/apollo-client"

export default () => {
  const { value, setValue } = useGlobal()
  const user = useUser()

  const { data, loading } = useQuery(GET_LIST_COMPANIES_BY_USER, {
    client: client,
    skip: !user.uid,
    variables: { uid: user.uid }
  })

  return (
    <Box p="lg" w="100%">
      <HeaderSection
        title="Ubah Toko"
        label=" "
      />

      <Select
        placeholder="Pilih Toko"
        disabled={loading}
        value={value?.selectedCompany || user.companyId}
        onChange={(value: string) => {
          setValue((prev: Global) => ({
            ...prev,
            selectedCompany: value
          }))
        }}
        data={data?.companies?.map(({ id, name }: { id: string, name: string }) => ({
          value: id,
          label: name
        })) || []}
      />
    </Box>
  )
}