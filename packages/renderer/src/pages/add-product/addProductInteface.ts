import type { GLOABL_STATUS } from "/@/constant/global";

export interface VariantInterface {
  id?: number
  label: string | undefined
  values: string[] | []
}

export interface TableProductsVariants {
  id?: number
  name?: string
  coord?: number[]
  sku?: string
  price?: number | null
  price_purchase?: number | null
  price_wholesale?: number | null
  min_wholesale?: number
  has_price_purchase?: boolean
  has_price_wholesale?: boolean
  has_variant_scale?: boolean
  variant_scale?: number
  stock?: number | undefined
  status?: GLOABL_STATUS
  isPrimary?: boolean
}

export declare type ProductType = "VARIANT" | "NOVARIANT";

export interface ProductsCardProps {
  id?: string
  image: string | undefined
  name: string

  description?: string
  categories?: string[]

  type: ProductType
  variants?: VariantInterface[] | []
  productVariants?: TableProductsVariants[] | undefined
}
