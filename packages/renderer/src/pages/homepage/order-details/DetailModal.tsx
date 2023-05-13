import { useMemo, useState } from 'react';
import { Stepper, Button, Flex, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons';
import { useCart } from 'react-use-cart';

import DetailOrders from './steps/DetailOrders';
import CompletePayment from './steps/CompletePayment';
import PaymentMethod from './steps/payment-method/PaymentMethod';
import PayNow from './steps/PayNow';
import { addTransaction, decreaseStock } from './transaction';
import { getVariants } from '/@/context/helpers';
import { useUser } from '/@/context/user';
import { useGlobal } from '/@/context/global';

type Props = {
  open: boolean;
  onClose: () => void;
  data: any[];
  refetchTotalTransaction: () => void;
  transactionNumber: string;
  attendance: any;
};

interface Customer {
  name: string;
  phone: string | number | undefined;
  address: string;
  note: string;
}

export interface FormValues {
  paymentAmount?: number;
  paymentType: string | undefined;
  paymentMethod: string | undefined;
  discount: number;
  discountType: string;
  customer: Customer;
}

const getNextLabel = (active: number) => {
  switch (active) {
    case 0:
      return 'Lanjut ke Metode Pembayaran';
    case 1:
      return 'Lanjut ke Pembayaran';
    case 2:
      return 'Buat Pesanan';
    default:
      return 'Selanjutnya';
  }
};

export default function DetailModal(props: Props) {
  const { open, onClose, data, refetchTotalTransaction, transactionNumber, attendance } = props;
  const { value } = useGlobal()
  const user = useUser();
  const companyId = value.selectedCompany || user.companyId
  const { emptyCart } = useCart();
  const [active, setActive] = useState(0);
  const [error, setError] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormValues>({
    initialValues: {
      paymentAmount: undefined,
      paymentType: undefined,
      paymentMethod: undefined,
      discount: 0,
      discountType: '',
      customer: {
        name: '0',
        phone: '',
        address: '',
        note: '',
      },
    },
  });

  const makeError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 5000);
  };

  const handleClose = () => {
    onClose();
    setActive(0);
    form.reset();
    setError(false);
  };

  const totalPayment = useMemo(() => {
    const actualPrices = data.map(({ quantity, min_wholesale, price_wholesale, itemTotal }) => {
      return quantity >= min_wholesale ? price_wholesale * quantity : itemTotal;
    });

    return actualPrices.reduce((acc, cur) => acc + cur, 0);
  }, [data]);

  const handleCreateTransaction = () => {
    setLoading(true);
    const { values } = form;

    const offset = (values.paymentAmount || 0) - totalPayment;

    const variables = {
      customerId: Number(values.customer.name) || null,
      payment_amount: values.paymentAmount,
      total_amount: totalPayment,
      code: transactionNumber,
      tax: 0,
      tax_type: 'PERCENT',
      payment_method: values.paymentMethod,
      payment_type: values.paymentType,
      status: offset >= 0 ? 'COMPLETED' : 'INCOMPLETE',
      employeeId: attendance?.employee?.id,
      companyId: companyId,
      products_solds: data?.map((product) => {
        const variants = getVariants(product.variants, product.coord);

        return {
          name: product.name,
          productId: product.productId,
          quantity_sold: product.quantity,
          unit_price: product.price,
          total_price: product.quantity * product.price,
          variants,
        };
      }),
    };

    const dataDecrease = data.filter(d => d.productId)?.map(({ id, quantity }) => ({
      id,
      quantity: quantity * -1,
    }))

    addTransaction({
      variables: variables,
    })
      .then((res) => {
        setTransactionId(res.data?.insert_transactions.returning?.[0]?.id);
        emptyCart();
        showNotification({
          title: 'Yeayy, Sukses!! 😊',
          message: 'Pesanan Berhasil Dibuat',
          icon: <IconCheck />,
          color: 'green',
        });
        decreaseStock(dataDecrease);
        refetchTotalTransaction();
        setActive((current) => (current < 3 ? current + 1 : current));
        setLoading(false);
      })
      .catch(() => {
        showNotification({
          title: 'Pesanan Gagal Dibuat',
          message: 'Coba Lagi nanti',
          icon: <IconExclamationMark />,
          color: 'red',
        });
      });
  };

  const nextStep = () => {
    if (active === 1 && !form.values.paymentMethod) {
      makeError();
      return;
    }

    if (active === 2 && !form.values.paymentAmount) {
      makeError();
      return;
    }

    setError(false);

    if (active === 2) {
      handleCreateTransaction();
    } else {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const STEPS = [
    {
      label: 'Detail Pesanan',
      description: 'Pesanan yang akan dibuat',
      components: <DetailOrders open={open} products={data} totalPayment={totalPayment} />,
    },
    {
      label: 'Metode Pembayaran',
      description: 'Pilih metode pembayaran',
      components: <PaymentMethod totalPayment={totalPayment} form={form} error={error} />,
    },
    {
      label: 'Bayar Pesanan',
      description: 'Pastikan pesanan sudah sesuai',
      components: <PayNow totalPayment={totalPayment} form={form} error={error} />,
    },
  ];

  return (
    <Modal size={940} opened={open} onClose={handleClose}>
      <Stepper active={active} breakpoint="sm">
        {STEPS.map((step, i) => {
          return (
            <Stepper.Step key={i} label={step.label} description={step.description}>
              {step.components}
            </Stepper.Step>
          );
        })}
        <Stepper.Completed>
          <CompletePayment form={form} totalPayment={totalPayment} transactionId={transactionId} />
        </Stepper.Completed>
      </Stepper>

      <Flex hidden={active === 3} justify="space-between" align="center" mt="xl">
        <Button disabled={loading || active === 0} variant="default" onClick={prevStep}>
          Kembali
        </Button>
        <Button loading={loading} onClick={nextStep}>
          {getNextLabel(active)}
        </Button>
      </Flex>
    </Modal>
  );
}
