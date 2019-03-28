import { combineReducers } from 'redux';
import {
  UPDATE_DATA,
  UPDATE_CURSOR,
  UPDATE_FOCUSED_NODE
} from 'actions';

function contentData(
  state = {
    rootId: '11111111-d540-03c2-ecd5-cb5c391484e',
    nodes: {
      '11111111-d540-03c2-ecd5-cb5c391484e': {
        id: '11111111-d540-03c2-ecd5-cb5c391484e',
        content: 'home',
        children: []
      }
    }
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_DATA:
      return { ...payload }
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
      return {
        currId: payload.currId,
      }
    default:
      return state;
  }
}

export default combineReducers({
  global: (state = {}) => state,
  contentData,
  cursorPosition,
  focusedNode
});
