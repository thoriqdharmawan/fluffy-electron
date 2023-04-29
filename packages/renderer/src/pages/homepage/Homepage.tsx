import { useState } from 'react';
import { Box, Center, Flex } from '@mantine/core';
import { useQuery } from '@apollo/client';

import { GET_TOTAL_TRANSACTIONS_TODAY, GET_ACTIVE_ATTENDACE } from '/@/graphql/query'
import { NowEnd, NowStart } from '/@/context/global';
import { useUser } from '/@/context/user';
import client from '/@/apollo-client';
import CheckIn from '/@/components/check-in/CheckIn';
import LoginButton from '/@/components/login/LoginButton';

import Cart from './cart/Cart';
import Products from './products/Products';
import DetailModal from './order-details/DetailModal';

export default function Homepage() {
  const { companyId } = useUser();
  const [attendance, setAttendance] = useState();
  const [working, setWorking] = useState(true);

  const [detail, setDetail] = useState({
    open: false,
    data: [],
  });

  const { data: dataAttendance, refetch: refetchAttendance } = useQuery(GET_ACTIVE_ATTENDACE, {
    client: client,
    skip: !companyId,
    variables: { companyId },
    onCompleted: (data) => {
      setWorking(data?.total.aggregate.count > 0);
      setAttendance(data?.attendances?.[0]);
    },
  });

  const { data, refetch } = useQuery(GET_TOTAL_TRANSACTIONS_TODAY, {
    client: client,
    skip: !companyId,
    variables: {
      companyId,
      gte: NowStart,
      lte: NowEnd,
    },
  });

  const handleNextPayment = (items: any) => {
    setDetail({
      open: true,
      data: items,
    });
  };

  const transacitonNumber = `#${(data?.total.aggregate.count || 0) + 1}`;

  const handleStartWorking = () => {
    setWorking(true);
    refetchAttendance();
  };

  const handleDoneWorking = () => {
    setWorking(false);
    refetchAttendance();
  };

  if (!companyId) {
    return (
      <Center w="100%">
        <LoginButton />
      </Center>
    )
  }

  return (
    <>
      <Flex justify="space-between" w="100%" direction={{ base: 'column', md: 'row' }}>
        {working ? (
          <>
            <Products
              attendanceId={dataAttendance?.attendances?.[0]?.id}
              employeeId={dataAttendance?.attendances?.[0]?.employee?.id}
              employeeName={dataAttendance?.attendances?.[0]?.employee?.name}
              onDoneWork={handleDoneWorking}
            />

            <Box maw={460} w="100%">
              <Cart onNextToPayment={handleNextPayment} transacitonNumber={transacitonNumber} />
            </Box>
          </>
        ) : (
          <CheckIn onWork={handleStartWorking} />
        )}
      </Flex>

      <DetailModal
        open={detail.open}
        onClose={() => setDetail((prev) => ({ ...prev, open: false }))}
        data={detail.data}
        refetchTotalTransaction={refetch}
        transactionNumber={transacitonNumber}
        attendance={attendance}
      />
    </>
  )
}
