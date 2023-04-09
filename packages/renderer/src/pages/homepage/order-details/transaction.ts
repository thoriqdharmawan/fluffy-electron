import client from '/@/apollo-client';

import { ADD_TRANSACTION, DECREASE_VARIANT_BY_ID } from '/@/graphql/mutation';

const addTransaction = ({ variables }: { variables: any }) => {
  return client.mutate({
    mutation: ADD_TRANSACTION,
    variables,
  });
};

interface VariantDecrease {
  id: number;
  quantity: number;
}

const decreaseStock = async (variantsToDecrease: VariantDecrease[]) => {
  for (let variant of variantsToDecrease) {
    const { id, quantity } = variant;

    await client.mutate({
      mutation: DECREASE_VARIANT_BY_ID,
      variables: {
        id,
        quantity,
      },
    });
  }
};

export { addTransaction, decreaseStock };
