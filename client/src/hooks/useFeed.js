import { useState, useEffect, useReducer } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { getLocalData } from '../utils/handleUserAuth';
import { GET_FEED_LATEST, GET_FEED_FOLLOWING } from '../graphql/queries';

const reducer = (state, action) => {};

const useFeed = (limit) => {
  const [activeTab, setActiveTab] = useState('latest');
  const [posts, setPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [token, setToken] = useState();

  let loading = true;
  let error = null;

  useEffect(() => {
    const { _, token: localToken } = getLocalData();
    setToken(localToken);
    setPosts([...latestPosts]);
  }, []);

  const {
    data: latestData,
    loading: latestLoading,
    error: latestError,
  } = useQuery(GET_FEED_LATEST, {
    variables: { limit: limit || 10 },
    context: {
      headers: {
        authorization: token,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data != undefined) {
        setLatestPosts(data.getFeedLatest);
      }
    },
  });

  const {
    data: folData,
    loading: folLoading,
    error: folError,
  } = useQuery(GET_FEED_FOLLOWING, {
    variables: { limit: limit || 10 },
    context: {
      headers: {
        authorization: token,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data != undefined) {
        setFollowingPosts(data.getFeedFollowing);
      }
    },
  });

  // When GraphQL error changes everytime, change error
  useEffect(() => {
    if (latestError) {
      error = latestError.message;
    } else if (folError) {
      error = folError.message;
    } else {
      error = null;
    }
  }, [latestError, folError]);

  // When dependency (e.g. activeTab) changes, change the posts state
  useEffect(() => {
    if (activeTab === 'latest') {
      setPosts([...latestPosts]);
    } else if (activeTab == 'followings') {
      setPosts([...followingPosts]);
    } else {
      setPosts([...latestPosts]);
    }

    if (folLoading || latestLoading) {
      loading = true;
    } else {
      loading = false;
    }
  }, [activeTab, latestPosts, followingPosts, folLoading, latestLoading]);

  return {
    posts,
    loading: folLoading || latestLoading,
    activeTab,
    setActiveTab,
    error,
  };
};

export default useFeed;
