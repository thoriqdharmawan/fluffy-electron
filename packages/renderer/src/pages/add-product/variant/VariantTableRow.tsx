import { memo } from 'react';
import { NumberInput, TextInput, Switch, Select, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { FormValues } from '..';
import { DEFAULT_VARIANTS_TYPE } from '/@/constant/global';

type Props = {
  coord?: number[];
  form: UseFormReturnType<FormValues>;
  index: number;
  totalVariant: number;
};

const VariantTableRow = memo(function VariantTableRowMemo(props: Props) {
  const { form, index, totalVariant } = props;
  const { productVariants } = form.values;

  const { has_price_wholesale, has_variant_scale } = productVariants?.[index] || {};

  const handleDeleteVariant = () => {
    form.removeListItem('productVariants', index);
  };

  return (
    <tr>
      <td valign="top">
        <Select
          placeholder="Pilih Varian"
          data={DEFAULT_VARIANTS_TYPE?.map((v) => ({ label: v, value: v }))}
          {...form.getInputProps(`productVariants.${index}.name`)}
        />

        {totalVariant !== 1 && (
          <Button onClick={handleDeleteVariant} mt="xl" color="red" variant="light" compact>
            Hapus Varian
          </Button>
        )}
      </td>
      <td valign="top">
        <NumberInput
          min={0}
          icon="Rp"
          mb="md"
          withAsterisk
          hideControls
          label="Harga Jual"
          labelProps={{ mb: 8 }}
          placeholder="Tambahkan Harga Jual"
          parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
          formatter={(value: any) =>
            !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
          }
          {...form.getInputProps(`productVariants.${index}.price`)}
        />
        <Switch
          label="Tambahkan Harga Jual Grosir?"
          mb="md"
          checked={has_price_wholesale}
          {...form.getInputProps(`productVariants.${index}.has_price_wholesale`)}
        />
        {has_price_wholesale && (
          <NumberInput
            min={0}
            mb="md"
            icon="Rp"
            withAsterisk={has_price_wholesale}
            hideControls
            labelProps={{ mb: 8 }}
            label="Harga Jual Grosir"
            placeholder="Tambahkan Harga Jual Grosir"
            parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
            formatter={(value: any) =>
              !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : ''
            }
            {...form.getInputProps(`productVariants.${index}.price_wholesale`)}
          />
        )}
        {has_price_wholesale && (
          <NumberInput
            label="Minimal Pembelian Grosir"
            placeholder="Tambahkan Minimal Pembelian Grosir"
            min={1}
            withAsterisk={has_price_wholesale}
            labelProps={{ mb: 8 }}
            mb={24}
            {...form.getInputProps(`productVariants.${index}.min_wholesale`)}
          />
        )}
        <NumberInput
          label="Skala Varian"
          placeholder="Tambahkan Skala Varian"
          min={1}
          step={1}
          withAsterisk={has_variant_scale}
          labelProps={{ mb: 8 }}
          mb={24}
          {...form.getInputProps(`productVariants.${index}.variant_scale`)}
        />
      </td>
      <td valign="top">
        <TextInput
          label="SKU Produk"
          placeholder="Tambahkan SKU"
          labelProps={{ mb: 8 }}
          {...form.getInputProps(`productVariants.${index}.sku`)}
        />
      </td>
      <td valign="top">
        <NumberInput
          label="Stock Produk"
          placeholder="Tambahkan Stok Produk"
          labelProps={{ mb: 8 }}
          {...form.getInputProps(`productVariants.${index}.stock`)}
        />
      </td>
    </tr>
  );
});

export default VariantTableRow;
