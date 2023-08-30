import { useState } from "react";
import { Box, Button, Col, Flex, Grid, Group, LoadingOverlay, Paper, TextInput, Textarea, Title } from "@mantine/core";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import type { ProductsCardProps, VariantInterface } from "./addProductInteface";
import { useForm } from "@mantine/form";
import { GLOABL_STATUS, PRODUCT_STATUS } from "/@/constant/global";
import type { FileWithPath } from "@mantine/dropzone";
import { useGlobal } from "/@/context/global";
import { useUser } from "/@/context/user";
import { ADD_PRODUCT, UPDATE_IMAGE_PRODUCT } from "/@/graphql/mutation";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconExclamationMark } from "@tabler/icons";

import HeaderSection from "/@/components/header/HeaderSection";
import DropzoneUpload from "/@/components/dropzone/DropzoneUpload";
import AddProductVariant from "./variant/AddProductVariant";
import client from "/@/apollo-client";

export interface FormValues extends ProductsCardProps { }

const AddProduct = () => {
  const { value } = useGlobal();
  const user: any = useUser();
  
  const companyId = value.selectedCompany || user.companyId;

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
          price: undefined,
          price_purchase: undefined,
          price_wholesale: undefined,
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

  const showError = (title: string) => {
    showNotification({
      title: title,
      message: 'Coba Lagi nanti',
      icon: <IconExclamationMark />,
      color: 'red',
    });
  };

  const handleUploadImage = (productId: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, 'products/' + productId);

    uploadBytes(storageRef, files[0])
      .then(() => {
        getDownloadURL(storageRef).then((url: string) => {
          client
            .mutate({
              mutation: UPDATE_IMAGE_PRODUCT,
              variables: {
                id: productId,
                image: url,
              },
            })
            .then(() => {
              showNotification({
                title: 'Yeayy, Sukses!! 😊',
                message: 'Produk berhasil dibuat',
                icon: <IconCheck />,
                color: 'green',
              });
            })
            .catch(() => showError('Gagal Menambahkan Foto Produk 🤥'))
            .finally(() => {
              form.reset();
              setLoading(false);
              handleDeleteFiles();
            });
        });
      })
      .catch(() => {
        setLoading(false);
        showError('Gagal Menambahkan Foto Produk 🤥');
      });
  };

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();

    if (!hasErrors) {
      setLoading(true);

      const { values } = form;

      const variables = {
        name: values.name,
        image: values.image,
        companyId,
        description: values.description,
        type: values.type,
        categories: values.categories?.map((category) => ({
          name: category,
          companyId,
        })),
        variants: values.variants?.map((variant) => ({
          name: variant.label,
          values: variant.values,
        })),
        status: PRODUCT_STATUS.WAITING_FOR_APPROVAL,
        product_variants: values.productVariants?.map((product_variant) => {
          const {
            has_price_purchase,
            has_price_wholesale,
            price_purchase,
            price_wholesale,
            price,
            variant_scale,
          } = product_variant;

          const pricePurchase = has_price_purchase ? price_purchase : price;
          const priceWholesale = has_price_wholesale ? price_wholesale : price;

          return {
            coord: product_variant.coord,
            name: product_variant.name,
            is_primary: product_variant.isPrimary,
            price: product_variant.price,
            price_purchase: pricePurchase,
            price_wholesale: priceWholesale,
            scale: variant_scale || 1,
            min_wholesale: product_variant.min_wholesale || 1,
            sku: product_variant.sku,
            status: product_variant.status,
            stock: product_variant.stock || 0,
          };
        }),
      };

      client.mutate({
        mutation: ADD_PRODUCT,
        variables,
      })
        .then((res) => {
          handleUploadImage(res.data?.insert_products?.returning?.[0].id);
        })
        .catch(() => {
          showError('Gagal Membuat Produk 🤥');
          setLoading(false);
        });
    }
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

          <AddProductVariant form={form} />
        </Paper>
        <Flex justify="end" align="center">
          <Group position="right" mt="md">
            <Button onClick={handleSubmit}>Tambahkan Produk</Button>
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
