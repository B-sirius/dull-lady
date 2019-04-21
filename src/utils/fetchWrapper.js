import store from 'store';
import { updateNetworkCondition } from 'actions';

const fetchWrapper = promise => {
  return promise
    .then(res => {
      store.dispatch(updateNetworkCondition({ isOnline: true }))
      return { res, error: null }
    })
    .catch(error => {
      store.dispatch(updateNetworkCondition({ isOnline: false }))
      return { error, res: null };
    });
}
export default fetchWrapper;