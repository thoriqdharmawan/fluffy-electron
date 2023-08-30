import { VARIANTS_TYPE } from "../pages/add-product/addProductInteface";

export const PRODUCT_STATUS = {
  WAITING_FOR_APPROVAL: "WAITING_FOR_APPROVAL",
  ACTIVE: "ACTIVE",
  REJECT: "REJECT",
  OPNAME: "OPNAME",
  DELETE: "DELETE",
};

export const LIST_VIEW_TYPES = {
  TABLE: "TABLE",
  GRID: "GRID",
};

export enum GLOABL_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const DEFAULT_VARIANTS_TYPE_NAME: VARIANTS_TYPE[] = [
  {
    value: 'Satuan',
    label: 'Satuan',
    disabled: false,
  },
  {
    value: 'Ukuran',
    label: 'Ukuran',
    disabled: false,
  },
  {
    value: 'Warna',
    label: 'Warna',
    disabled: false,
  },
  {
    value: 'Rasa',
    label: 'Rasa',
    disabled: false,
  },
];

export const DEFAULT_VARIANTS_TYPE: string[] = [
  'Pcs',
  'Renceng',
  'Dus',
  'Box',
  'Pak',
  'Ball',
  'Kg',
  'Liter',
  'Gram',
  'Kodi',
  'Dozen',
  'Roll',
  'Set',
  'Karat',
  'Slop',
];
