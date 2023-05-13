import { Box, Select } from "@mantine/core"

import HeaderSection from "/@/components/header/HeaderSection"

export default () => {
  return (
    <Box p="lg" w="100%">
      
      <HeaderSection
        title="Ubah Toko"
        label=" "
      />

      <Select
        placeholder="Pilih Toko"
        maw={220}
        data={[
          { value: 'react', label: 'React' },
          { value: 'ng', label: 'Angular' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'vue', label: 'Vue' },
        ]}
      />
    </Box>
  )
}