import type { CSSProperties } from "react";

import { Button, Flex, Group, Text, useMantineTheme, Image } from "@mantine/core";
import type { DropzoneProps, FileWithPath } from "@mantine/dropzone";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { type UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import type { SystemProp } from "@mantine/styles";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons";

interface DropzoneInterface extends Partial<DropzoneProps> {
  form: UseFormReturnType<any>
  files: FileWithPath[]
  onDelete: () => void
  dropzoneProps: any
  wrapperImageAlign?: SystemProp<CSSProperties["alignItems"]>
}

const IMG_PLACEHOLDER_SIZE = 300;

export default function DropzoneUpload(props: DropzoneInterface) {
  const { form, files, onDelete, dropzoneProps, wrapperImageAlign } = props;
  const theme = useMantineTheme();

  if (form?.values.image || files[0]) {
    const imageUrl = form?.values.image || URL.createObjectURL(files?.[0]);

    return (
      <Flex direction="column" align={wrapperImageAlign || "inherit"}>
        <Image
          src={imageUrl}
          imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
          radius="md"
          width={IMG_PLACEHOLDER_SIZE}
          height={IMG_PLACEHOLDER_SIZE}
          withPlaceholder
        />
        <Button onClick={onDelete} mt={12}>
          Hapus Foto Produk
        </Button>
      </Flex>
    );
  }

  const handleRejectFiles = () => {
    showNotification({
      id: "reject-upload",
      disallowClose: false,
      autoClose: 5000,
      title: "Foto produk tidak boleh melebihi 2MB",
      message: "",
      color: "red",
      icon: <IconX />,
    });
  };

  return (
    <Dropzone
      onReject={handleRejectFiles}
      maxSize={2 * 1024 ** 2} // 2mb
      accept={IMAGE_MIME_TYPE}
      w={IMG_PLACEHOLDER_SIZE}
      h={IMG_PLACEHOLDER_SIZE}
      sx={{
        alignItems: "center",
        display: "flex",
      }}
      {...dropzoneProps}
    >
      <Group position="center" align="center" spacing="xl" style={{ pointerEvents: "none" }}>
        <Dropzone.Accept>
          <IconUpload
            size={50}
            stroke={1.5}
            color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size={50}
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size={50} stroke={1.5} />
        </Dropzone.Idle>
        <div>
          <Text size="md" align="center" inline>
            Tambahkan Foto Produk
          </Text>
          <Text size="sm" align="center" color="dimmed" mt={8}>
            Foto Produk tidak boleh melebihi 2MB
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
