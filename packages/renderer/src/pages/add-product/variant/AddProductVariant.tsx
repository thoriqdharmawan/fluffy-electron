import { UseFormReturnType } from "@mantine/form";
import { Button, Table } from "@mantine/core";
import { GLOABL_STATUS } from "/@/constant/global";
import { Empty } from "/@/components/empty-state";
import { FormValues } from "..";

import VariantTableRow from "./VariantTableRow";

export default function AddProductVariant({ form }: { form: UseFormReturnType<FormValues> }) {
  const { productVariants } = form.values;

  const rows = productVariants?.map((productVariant, idx) => {
    return (
      <VariantTableRow
        key={idx}
        totalVariant={productVariants?.length}
        coord={productVariant.coord}
        form={form}
        index={idx}
      />
    );
  });

  const handleAddNewVariant = () => {
    form.insertListItem('productVariants', {
      name: '',
      sku: '',
      price: '',
      price_purchase: '',
      price_wholesale: '',
      min_wholesale: 1,
      has_price_purchase: false,
      has_price_wholesale: false,
      has_variant_scale: false,
      variant_scale: 1,
      stock: 0,
      status: GLOABL_STATUS.ACTIVE,
      isPrimary: false,
    });
  };

  return (
    <>
      <Table sx={{ minWidth: 800 }} horizontalSpacing="xl" verticalSpacing="sm" striped withBorder>
        <thead>
          <tr>
            <th>Nama Varian</th>
            <th>Harga</th>
            <th>SKU</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr>
            <td colSpan={5}>
              {rows?.length === 0 && (
                <Empty
                  title="Tidak Ada Varian"
                  label="Anda belum menambahkan Tipe Varian produk."
                />
              )}
            </td>
          </tr>
        </tbody>
      </Table>

      <Button mt="xl" onClick={handleAddNewVariant}>
        Tambah Varian Baru
      </Button>
    </>
  );
}
