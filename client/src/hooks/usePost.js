import { useState, useEffect, useReducer } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { getLocalData } from '../utils/handleUserAuth';
import { GET_POST } from '../graphql/queries';

const usePost = (postId) => {
  const [post, setPost] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const { _, token: t } = getLocalData();
    setToken(t);
  }, []);

  const { loading: postLoading, error: postError } = useQuery(GET_POST, {
    variables: { id: postId },
    context: {
      headers: {
        authorization: token,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data != undefined) {
        console.log('FROM userPost: ', data);
        setPost(data.getPost);
      }
    },
  });

  return {
    post,
    loading: postLoading,
    error: postError,
  };
};

export default usePost;
