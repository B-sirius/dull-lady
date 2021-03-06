import { combineReducers } from 'redux';
import {
  UPDATE_DATA,
  UPDATE_CURSOR,
  UPDATE_FOCUSED_NODE,
  REMOVE_REQUEST,
  ADD_REQUEST,
  UPDATE_NETWORK_STATE,
  UPDATE_SETTING_STATE,
  UPDATE_USER,
  SAVED,
  UNSAVED
} from 'actions';

function userInfo(
  state = {
    username: null
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_USER:
      return {
        ...payload
      }
    default:
      return state;
  }
}

function settingState(
  state = {
    active: false
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_SETTING_STATE:
      return {
        ...payload
      }
    default:
      return state;
  }
}

function networkCondition(
  state = {
    isOnline: true
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_NETWORK_STATE:
      return {
        ...payload
      }
    default:
      return state;
  }
}

function contentData(
  state = {
    path: [],
    rootId: null,
    nodes: {}
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_DATA:
      return {
        ...state,
        ...payload
      }
    default:
      return state;
  }
}

// 更新光标位置
function cursorPosition(
  state = {
    needUpdate: false, // 只有为true时才需要执行更新
    id: null,
    position: 0,
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_CURSOR:
      return {
        ...state,
        ...payload
      }
    default:
      return state;
  }
}

// 更新focus的node
function focusedNode(
  state = {
    currId: null, // 当前点击的id
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_FOCUSED_NODE:
      return { ...payload }
    default:
      return state;
  }
}

function requestQueue(
  state = [],
  action
) {
  const { type, payload } = action;
  switch (type) {
    case REMOVE_REQUEST:
      return state.slice(1);
    case ADD_REQUEST:
      return [...state, payload]
    default: return state;
  }
}

function unsavedChange(state = {
  isSaved: true
}, action) {
  const { type } = action;
  switch (type) {
    case SAVED:
      return { isSaved: true }
    case UNSAVED:
      return { isSaved: false }
    default: return state;
  }
}

export default combineReducers({
  global: (state = {}) => state,
  contentData,
  cursorPosition,
  focusedNode,
  requestQueue,
  networkCondition,
  settingState,
  userInfo,
  unsavedChange
});
