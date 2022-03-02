import { useState } from 'react';
import { useQuery } from '@apollo/client';

import { getLocalData } from '../utils/handleUserAuth';
import { GET_USER_DETAIL } from '../graphql/queries';

const useUserDetail = (userId) => {
  const [userDetail, setUserDetail] = useState();
  const { userId: localUserId, token } = getLocalData();

  const { loading, error, data } = useQuery(GET_USER_DETAIL, {
    variables: {
      id: userId,
    },
    context: {
      headers: {
        Authorization: token,
      },
    },
    onError: (err) => {
      console.log('useUsertDetail error: ', err);
    },
    onCompleted: (data) => {
      setUserDetail(data.getUser);
    },
  });

  return [userDetail, setUserDetail];
};

export default useUserDetail;
