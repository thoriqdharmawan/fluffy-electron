import { ActionIcon, Button, Flex, Modal, NumberInput, TextInput, Title } from '@mantine/core'
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { IconMinus, IconPlus, IconShoppingCart } from '@tabler/icons';
import { useCart } from 'react-use-cart';

interface Props {
  opened: boolean;
  onClose: () => void
}

interface FormValues {
  name: string;
  price?: number;
  quantity: number;
  note?: string;
}

export default function AddManualProduct(props: Props) {
  const { addItem } = useCart();
  const { opened, onClose } = props
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      price: undefined,
      quantity: 1,
      note: undefined
    },
    validate: {
      name: isNotEmpty("Bagian ini diperlukan"),
      price: isNotEmpty("Bagian ini diperlukan"),
      quantity: isInRange({ min: 1 }, "Bagian ini diperlukan"),
    }
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const setQty = (type: number) => {
    form.setValues((prev) => ({ ...prev, quantity: (prev.quantity || 0) + type }))
  }

  const handleAddToCart = () => {
    const { hasErrors } = form.validate()

    if (!hasErrors) {
      const { name, price = 0, quantity } = form.values

      const item = {
        id: randomId(),
        name: name || 'Produk tanpa nama',
        price,
        price_wholesale: price,
        min_wholesale: 1,
        is_primary: false,
        status: 'ACTIVE',
        stock: 1000000,
        type: 'NOVARIANT'
      }

      addItem(item, quantity)
      handleClose()
    }
  }

  return (
    <Modal opened={opened} onClose={handleClose}>
      <TextInput
        // ref={focusTrapRef}
        mb="md"
        withAsterisk
        label="Nama Produk"
        placeholder="Masukan Nama Produk"
        labelProps={{ mb: 8 }}
        data-autofocus
        {...form.getInputProps('name')}
      />

      <NumberInput
        mb="md"
        icon="Rp"
        label="Harga Produk"
        placeholder="Masukan Harga Produk"
        withAsterisk
        hideControls
        labelProps={{ mb: 8 }}
        parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
        formatter={(value: any) =>
          !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
        }
        {...form.getInputProps('price')}
      />

      <Title order={6} mb="xs">
        Jumlah
      </Title>
      <Flex align="center" gap="xs" mb="xl" w="100%">
        <ActionIcon
          disabled={form.values.quantity <= 0}
          onClick={() => setQty(-1)}
          radius="lg"
          variant="default"
        >
          <IconMinus size={12} />
        </ActionIcon>
        <NumberInput
          radius="xl"
          w="100%"
          ta="right"
          min={0}
          styles={{ input: { textAlign: 'center' } }}
          placeholder="Masukan Jumlah Produk"
          hideControls
          {...form.getInputProps('quantity')}
        />
        <ActionIcon
          variant="default"
          radius="lg"
          onClick={() => setQty(1)}
        >
          <IconPlus size={12} />
        </ActionIcon>
      </Flex>

      <Button
        w="100%"
        radius="lg"
        mt="sm"
        leftIcon={<IconShoppingCart size={18} />}
        onClick={handleAddToCart}
      >
        Tambah ke Keranjang
      </Button>
    </Modal>
  )
}
