const fetchWrapper = promise => {
  return promise
    .then(res => ({ res, error: null }))
    .catch(error => ({ error, res: null }));
}
export default fetchWrapper;