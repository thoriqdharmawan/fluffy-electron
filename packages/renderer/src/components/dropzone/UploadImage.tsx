import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { FileWithPath } from "@mantine/dropzone";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconExclamationMark } from "@tabler/icons";

import { UPDATE_IMAGE_PRODUCT } from "/@/graphql/mutation"
;
import client from "/@/apollo-client";

const showError = (title: string) => {
  showNotification({
    title,
    message: "Coba Lagi nanti",
    icon: <IconExclamationMark />,
    color: "red",
  });
};

interface Params {
  productId: string | null
  files: FileWithPath[]
  setLoading?: (loading: boolean) => void
  onCompleted?: () => void
}

export const handleUploadProductImage = ({ productId, files, setLoading, onCompleted }: Params) => {
  const storage = getStorage();
  const storageRef = ref(storage, `products/${productId}`);

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
              title: "Yeayy, Sukses!! 😊",
              message: "Produk berhasil dibuat",
              icon: <IconCheck />,
              color: "green",
            });
          })
          .catch(() => showError("Gagal Menambahkan Foto Produk 🤥"))
          .finally(() => {
            if (setLoading)
              setLoading(false);

            if (onCompleted)
              onCompleted();
          });
      });
    })
    .catch(() => {
      if (setLoading)
        setLoading(false);

      showError("Gagal Menambahkan Foto Produk 🤥");
    });
};
