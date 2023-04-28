import { useState } from 'react'
import { ActionIcon, Flex, NumberInput, Text } from '@mantine/core'
import { IconCheck, IconPencil, IconX } from '@tabler/icons';
import { useMutation } from '@apollo/client';
import { isNotEmpty, useForm } from '@mantine/form';

import { EDIT_PRODUCT_STOCK } from '/@/graphql/query';
import client from '/@/apollo-client';

interface Props {
  editable?: boolean;
  id?: number;
  stock: number;
  refetch?: () => void;
}

export default function StockEditable(props: Props) {
  const { id, stock, editable = true, refetch } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)

  const form = useForm<{ stock: number }>({
    validate: {
      stock: isNotEmpty('Bagian ini diperlukan'),
    }
  })

  const [updateStock] = useMutation(EDIT_PRODUCT_STOCK, { client: client })

  const handleClose = () => {
    form.reset()
    setEditing(false)
  }

  const handleConfirm = () => {
    const { hasErrors } = form.validate();

    if (!hasErrors) {
      setLoading(true)
      updateStock({
        variables: {
          id: id,
          stock: form.values.stock
        }
      }).then(() => {
        if (typeof refetch === 'function') {
          refetch()
        }
      }).finally(() => {
        handleClose()
        setLoading(false)
      })
    }
  }

  return (
    <Flex
      align="center"
      direction="row"
    >
      {editing ? (
        <>
          <NumberInput min={0} {...form.getInputProps('stock')} value={stock} />
          <ActionIcon onClick={() => setEditing(false)} color="red" variant="light" ml="sm">
            <IconX size={18} />
          </ActionIcon>
          <ActionIcon loading={loading} onClick={handleConfirm} color="blue" variant="light" ml="sm">
            <IconCheck size={18} />
          </ActionIcon>
        </>
      ) : (
        <>
          {editable ? stock : <Text color="dimmed" fs="italic" size="xs">Buka varian produk untuk melihat stok</Text>}
          <ActionIcon hidden={!editable} onClick={() => setEditing(true)} color="blue" variant="light" ml="md">
            <IconPencil size={18} />
          </ActionIcon>
        </>
      )}
    </Flex>
  )
}

