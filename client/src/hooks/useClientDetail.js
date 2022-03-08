import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import { GET_SELF_DETAIL } from '../graphql/queries';
import { getLocalData } from '../utils/handleUserAuth';

const useClientDetail = (initialValue) => {
  const [userDetail, setUserDetail] = useState(initialValue);

  const { userId, token } = getLocalData();

  const { loading, error, data } = useQuery(GET_SELF_DETAIL, {
    context: {
      headers: {
        Authorization: token,
      },
    },
    onError: (err) => {
      throw new Error(err.graphQLErrors[0].message);
    },
    onCompleted: (data) => {
      setUserDetail(data.getSelf);
    },
  });

  return [userDetail, setUserDetail];
};

export default useClientDetail;
