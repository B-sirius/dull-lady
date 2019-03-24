import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'reducer';

const applyMiddleFuncs = [thunk];
let composeEnhancers = compose;

if (process.env.NODE_ENV === 'development') {
    // applyMiddleFuncs.push(require('redux-logger').default);
    // 开发环境启动  redux-devtools  这个chrome插件
    // eslint-disable-next-line no-underscore-dangle
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
function configureStore(preloadedState = {}) {
    const store = createStore(rootReducer, preloadedState, composeEnhancers(
        applyMiddleware(...applyMiddleFuncs)
    ));

    return store;
}
export default configureStore;
