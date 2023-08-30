import { useState } from "react";

import { Box, Button, Col, Flex, Grid, Group, LoadingOverlay, Paper, TextInput, Textarea, Title } from "@mantine/core";

import type { ProductsCardProps, VariantInterface } from "./addProductInteface";

import { useForm } from "@mantine/form";

import { GLOABL_STATUS } from "/@/constant/global";

import type { FileWithPath } from "@mantine/dropzone";

import HeaderSection from "/@/components/header/HeaderSection";
import DropzoneUpload from "/@/components/dropzone/DropzoneUpload";

export interface FormValues extends ProductsCardProps { }

const AddProduct = () => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormValues>({
    initialValues: {
      image: "",
      name: "",
      description: "",
      categories: [],
      type: "VARIANT",
      variants: [DEFAULT_VARIANT],
      productVariants: [
        {
          name: "",
          sku: "",
          price: null,
          price_purchase: null,
          price_wholesale: null,
          min_wholesale: 1,
          has_price_purchase: false,
          has_price_wholesale: false,
          has_variant_scale: false,
          variant_scale: 1,
          stock: 0,
          status: GLOABL_STATUS.ACTIVE,
          isPrimary: false,
        },
      ],
    },

    validate: {
      name: value => (!value ? "Bagian ini diperlukan" : null),
      productVariants: {
        name: value => (!value ? "Bagian ini diperlukan" : null),
        price: value => (!value ? "Bagian ini diperlukan" : null),
        price_purchase: (value, values, path) => {
          const index = Number(path.split(".")[1] || 0);
          const isRequired = values.productVariants?.[index]?.has_price_purchase;
          return isRequired && !value ? "Bagian ini diperlukan" : null;
        },
        price_wholesale: (value, values, path) => {
          const index = Number(path.split(".")[1] || 0);
          const isRequired = values.productVariants?.[index]?.has_price_wholesale;
          return isRequired && !value ? "Bagian ini diperlukan" : null;
        },
        min_wholesale: (value, values, path) => {
          const index = Number(path.split(".")[1] || 0);
          const isRequired = values.productVariants?.[index]?.has_price_wholesale;
          return isRequired && !value ? "Bagian ini diperlukan" : null;
        },
        variant_scale: (value, values, path) => {
          const index = Number(path.split(".")[1] || 0);
          const isRequired = values.productVariants?.[index]?.has_variant_scale;
          return isRequired && !value ? "Bagian ini diperlukan" : null;
        },
      },
    },
  });

  const handleSubmit = async (goToList: boolean) => {

  };

  const handleDeleteFiles = () => {
    if (form?.values.image)
      form.setValues({ image: "" });
    else
      setFiles([]);
  };

  return (
    <Box p="lg" w="100%">
      <HeaderSection
        title="Tambah Produk"
        label="Anda dapat menambahkan produk baru ke dalam aplikasi kami dengan mudah dan cepat. Silakan isi informasi produk dengan benar dan tekan tombol Tambahkan Produk untuk menyimpan produk baru Anda."
      />

      <Box sx={{ position: "relative" }}>
        <LoadingOverlay visible={loading} overlayBlur={2} />

        <Paper shadow="sm" radius="md" p="xl" mb="xl">
          <Title order={4} mb="xl">
            Informasi Produk
          </Title>
          <Grid align="center" gutter="xl">
            <Col span="content">
              <DropzoneUpload
                form={form}
                files={files}
                onDelete={handleDeleteFiles}
                dropzoneProps={{
                  onDrop: setFiles,
                  multiple: false,
                  mb: "md",
                }}
              />
            </Col>
            <Col span={12} sm="auto">
              <TextInput
                label="Nama Produk"
                placeholder="Tambahkan Nama Produk"
                labelProps={{ mb: 8 }}
                mb={24}
                withAsterisk
                {...form.getInputProps("name")}
              />
              <Textarea
                label="Deskripsi"
                placeholder="Tambahkan Deskripsi Produk"
                labelProps={{ mb: 8 }}
                mb={24}
                minRows={4}
                {...form.getInputProps("description")}
              />
            </Col>
          </Grid>
        </Paper>
        <Paper shadow="sm" radius="md" p="xl" mb="xl">
          <Title order={4} mb="xl">
            Varian Produk
          </Title>

          {/* <AddProductVariant form={form} /> */}
        </Paper>
        <Flex justify="end" align="center">
          <Group position="right" mt="md">
            <Button variant="subtle" onClick={() => handleSubmit(false)}>
              Simpan dan Tambah Baru
            </Button>
            <Button onClick={() => handleSubmit(true)}>Tambahkan Produk</Button>
          </Group>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddProduct;

export const DEFAULT_VARIANT: VariantInterface = {
  label: "Satuan",
  values: [],
};
