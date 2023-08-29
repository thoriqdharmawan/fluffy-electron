import { useState } from 'react'
import { Button, Flex, Modal, Select, Text, Table, NumberInput, Title, Alert } from '@mantine/core'
import { IconCheck, IconChevronsRight, IconInfoCircle, IconExclamationMark } from '@tabler/icons'
import { useMutation, useQuery } from '@apollo/client';
import { showNotification } from '@mantine/notifications';

import { getVariants, simplifyFraction } from '/@/context/helpers';
import { GET_LIST_PRODUCT_VARIANTS_STOCK } from '/@/graphql/query';
import { SET_TRANSFER_STOCK } from '/@/graphql/mutation';
import Loading from '/@/components/loading/Loading';
import client from '/@/apollo-client';


interface Props {
  opened: boolean;
  id: string | undefined;
  onClose: () => void;
  refetch: any;
}

interface TableProps {
  stock: number;
  transferedStock: number;
  resultStock: number;
  type?: string
}

const calculate = (itemTransfered: number, scale: number) => {
  return Math.floor(Math.floor((itemTransfered || 0)) / scale)
}

interface GetTransferedStock {
  isFromGreater: boolean;
  itemTransfered: number;
  scale: number;
  isMultiplied: boolean;
}

const getTransferedStock = (args: GetTransferedStock) => {
  const { isFromGreater, itemTransfered, scale, isMultiplied } = args
  if (isFromGreater) {
    return itemTransfered
  }

  const calculated = calculate(itemTransfered, scale)

  if (isMultiplied) {
    return calculated * scale
  }

  return calculated
}

const TableSwitch = ({ stock, transferedStock, resultStock, type }: TableProps) => {
  const isSubtraction = type === "SUBTRACTION"
  const sign = isSubtraction ? '-' : '+'

  return (
    <Table mb={24} highlightOnHover withBorder>
      <tbody>
        <tr>
          <td>Stok Awal</td>
          <td><Text ta="right">{stock}</Text></td>
        </tr>
        {transferedStock !== 0 && (
          <tr>
            <td>{isSubtraction ? 'Pengurangan' : 'Penambahan'}</td>
            <td><Text ta="right" color={isSubtraction ? "red" : "green"}>{sign} {transferedStock}</Text></td>
          </tr>
        )}
        <tr>
          <td>Stok Akhir</td>
          <td><Text ta="right">{resultStock}</Text></td>
        </tr>
      </tbody>
    </Table>
  )
}

export default function SwitchStock(props: Props) {
  const { opened, onClose, id, refetch } = props

  if (!opened) {
    return <></>
  }

  const [transferedItem, setTransferedItem] = useState<number>(0)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [listVariant, setListVariant] = useState<{ label: string, value: string }[] | []>([])
  const [selected, setSelected] = useState<any>({
    from: undefined,
    to: undefined
  })

  const [transferStock] = useMutation(SET_TRANSFER_STOCK, { client })

  const { from, to } = selected

  const { loading, error } = useQuery(GET_LIST_PRODUCT_VARIANTS_STOCK, {
    client,
    skip: !id,
    fetchPolicy: 'network-only',
    variables: { productId: id },
    onCompleted: ({ product_variants, variants }) => {
      setListVariant(() => {
        return product_variants.map((pv: any) => {
          return {
            id: pv.id,
            label: pv.name,
            value: pv.name,
            scale: pv.scale,
            stock: pv.stock,
          }
        })
      })
    }
  })

  if (error) {
    console.error(error)
  }

  const handleChange = (value: number) => {
    setTransferedItem(value)
  }

  const handleChangeVariant = (value: string, origin: string) => {
    setTransferedItem(0)
    const res = [...listVariant].filter((l) => l.value === value)?.[0]

    setSelected((prev: any) => {
      return {
        ...prev,
        [origin]: res
      }
    })
  }

  const handleClose = () => {
    onClose()
    setSelected({ from: undefined, to: undefined })
    setTransferedItem(0)
  }

  const isShowingDetail = !!from && !!to

  const [simplifyFromScale, simplifyToScale] = simplifyFraction(from?.scale, to?.scale)
  const isFromGreaterThanTo = simplifyFromScale > simplifyToScale

  const actualTransferedFrom = Math.floor(transferedItem / simplifyToScale) * simplifyToScale
  const itemTransferedFrom = getTransferedStock({
    isFromGreater: isFromGreaterThanTo,
    itemTransfered: actualTransferedFrom,
    scale: simplifyFromScale,
    isMultiplied: true
  })

  const calculateTransferedTo = getTransferedStock({
    isFromGreater: isFromGreaterThanTo,
    itemTransfered: transferedItem,
    scale: simplifyToScale,
    isMultiplied: false
  })
  const itemTransferedTo = isFromGreaterThanTo
    ? transferedItem * simplifyFromScale
    : calculateTransferedTo

  const isDisabledSubmit = loading || !isShowingDetail || transferedItem <= 0 || !transferedItem

  const handleSubmit = () => {
    setLoadingSubmit(true)
    transferStock({
      variables: {
        id_from: from.id,
        stock_from: -itemTransferedFrom,
        id_to: to.id,
        stock_to: itemTransferedTo
      }
    }).then(() => {
      handleClose()
      if (typeof refetch === 'function') {
        refetch()
      }
      showNotification({
        title: 'Yeayy, Sukses!! 😊',
        message: 'Produk stok berhasil diubah',
        icon: <IconCheck />,
        color: 'green',
      });
    }).catch(() => {
      showNotification({
        title: "Gagal Mengubah Stok 🤥",
        message: 'Coba Lagi nanti',
        icon: <IconExclamationMark />,
        color: 'red',
      });
    }).then(() => setLoadingSubmit(false))
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Bongkar Pasang Stock"
    >
      {loading && (<Loading />)}
      {!loading && (
        <>
          <Flex
            justify="space-between"
            align="center"
            direction="row"
            gap="md"
            mb="xl"
          >
            <Select
              placeholder="Pilih Varian"
              data={listVariant}
              onChange={(value: string) => handleChangeVariant(value, 'from')}
            />

            <IconChevronsRight />

            <Select
              placeholder="Pilih Varian"
              data={listVariant}
              onChange={(value: string) => handleChangeVariant(value, 'to')}
            />
          </Flex>
          {
            (isShowingDetail) && (
              <>
                <Flex
                  justify="space-between"
                  align="center"
                  direction="row"
                  gap={50}
                >
                  <Table mb={24} highlightOnHover withBorder>
                    <tbody>
                      <tr>
                        <td>Skala</td>
                        <td><Text ta="right">{from?.scale}</Text></td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table mb={24} highlightOnHover withBorder>
                    <tbody>
                      <tr>
                        <td>Skala</td>
                        <td><Text ta="right">{to?.scale}</Text></td>
                      </tr>
                    </tbody>
                  </Table>
                </Flex>

                <Alert icon={<IconInfoCircle size="1rem" />} title="Informasi" color="green" mb="md">
                  Setiap {simplifyToScale} {from.label} bertambah {simplifyFromScale} {to.label}
                </Alert>

                <NumberInput
                  mb={24}
                  min={0}
                  max={from.stock}
                  withAsterisk
                  label="Stok yang akan transfer"
                  value={transferedItem}
                  onChange={handleChange}
                  labelProps={{ mb: 8 }}
                />

                <Title order={6} mb="sm">Hasil</Title>

                <Flex gap={50}>
                  <TableSwitch
                    stock={from.stock}
                    transferedStock={itemTransferedFrom}
                    resultStock={from.stock - itemTransferedFrom}
                    type="SUBTRACTION"
                  />
                  <TableSwitch
                    stock={to.stock}
                    transferedStock={itemTransferedTo}
                    resultStock={to.stock + itemTransferedTo}
                  />
                </Flex>
              </>
            )
          }
        </>
      )}
      <Flex
        justify="space-between"
        align="center"
        direction="row"
        gap="md"
        mt="xl"
      >

        <Button variant='subtle'>Batalkan</Button>
        <Button
          onClick={handleSubmit}
          loading={loadingSubmit}
          disabled={isDisabledSubmit}
        >
          Simpan
        </Button>
      </Flex>
    </Modal>
  )
}
