module.exports.onGraphqlError = (graphqlError, setter, timer) => {
  let err = graphqlError.graphQLErrors[0].message;
  if (err === 'jwt expired') {
    window.location.replace('/login');
  } else {
    setter(err);
    timer = setTimeout(() => setter(), 2000);
  }
};
