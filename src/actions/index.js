import backend from 'backend';
import once from 'utils/once';
import store from 'store';
export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_DATA = 'UPDATE_DATA';
export const UPDATE_CURSOR = 'UPDATE_CURSOR';
export const UPDATE_FOCUSED_NODE = 'UPDATE_FOCUSED_NODE';
export const REMOVE_REQUEST = 'REMOVE_REQUEST';
export const ADD_REQUEST = 'ADD_REQUEST';
export const UPDATE_NETWORK_STATE = 'UPDATE_NETWORK_STATE';
export const UPDATE_SETTING_STATE = 'UPDATE_SETTING_STATE';

const onceDispatchEdit = once(
  ({ id, content }) => {
    store.dispatch({
      type: ADD_REQUEST,
      payload: {
        request: backend.editNode,
        args: {
          id,
          content
        }
      }
    })
  }
  , 600);

export const updateUser = ({ username }) => (dispatch) => () => {
  dispatch({
    type: UPDATE_USER,
    payload: { username }
  })
}

// 打开设置
export const openSetting = () => (dispatch) => () => {
  dispatch({
    type: UPDATE_SETTING_STATE,
    payload: {
      active: true
    }
  });
}

// 关闭设置
export const closeSetting = () => (dispatch) => () => {
  dispatch({
    type: UPDATE_SETTING_STATE,
    payload: {
      active: false
    }
  });
}

// 更新root节点，即切换子层级显示
export const updateRoot = id => (dispatch, getState) => () => {
  const { contentData } = getState();
  const { nodes } = contentData;
  const path = [id];
  let node = nodes[id];
  while (!!node.parent) {
    path.unshift(node.parent);
    node = nodes[node.parent];
  }

  dispatch({
    type: UPDATE_DATA,
    payload: {
      ...contentData,
      path,
      rootId: id
    }
  });
}

// 更新光标位置
export const updateCursor = () => (dispatch, getState) => {
  const { cursorPosition } = getState();
  const { id, position } = cursorPosition;
  const el = document.getElementById(id);
  if (!el) return;
  const range = document.createRange();
  const sel = window.getSelection();
  if (el.childNodes.length) {
    range.setStart(el.childNodes[0], position);
  }
  else {
    range.setStart(el, position);
  }
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);

  dispatch({
    type: UPDATE_CURSOR,
    payload: {
      needUpdate: false
    }
  });
}

// 左缩进
export const indentToLeft = () => (dispatch, getState) => {
  const { contentData, focusedNode } = getState();
  const { currId } = focusedNode;
  const id = currId;
  if (!id || !contentData.nodes[id]) return;

  const { nodes, rootId } = contentData;
  const parentId = nodes[id].parent;
  if (parentId === rootId) return;

  const parent = nodes[parentId];
  const newParent = nodes[parent.parent];
  // 找出node在parent.children里的index
  const nodeIndex = nodes[parentId].children.indexOf(id);
  if (nodeIndex === -1) {
    console.error(`未在${parentId}中找到子节点${id}`);
    return false;
  }
  // 找出parent在其parent里的index
  const parentIndex = newParent.children.indexOf(parentId);
  if (parentIndex === -1) {
    console.error(`未在${newParent.id}中找到子节点${parentId}`);
    return false;
  }
  dispatch(
    moveNode({
      id,
      parentId: newParent.id,
      priority: parentIndex + 1
    })
  )
  dispatch({
    type: UPDATE_CURSOR,
    payload: {
      needUpdate: true,
      id: id,
      position: 0,
    }
  })
}

// 右缩进
export const indentToRight = () => (dispatch, getState) => {
  const { contentData, focusedNode } = getState();
  const { currId } = focusedNode;
  const id = currId;
  if (!id || !contentData.nodes[id]) return;
  const { nodes } = contentData;
  const parentId = nodes[id].parent;
  const node = nodes[id];
  // 找出node在parent.children里的index
  const nodeIndex = nodes[parentId].children.indexOf(id);
  if (nodeIndex === -1) {
    console.error(`未在${parentId}中找到子节点${id}`);
    return false;
  }
  if (nodeIndex === 0) {
    return;
  }
  // 找出平级的上个节点
  const brotherNode = nodes[nodes[parentId].children[nodeIndex - 1]];
  const brotherNodeChildrenLength = !!brotherNode.children ? brotherNode.children.length : 0;
  dispatch(
    moveNode({
      id,
      parentId: brotherNode.id,
      priority: brotherNodeChildrenLength
    }));
  // 更新光标位置
  dispatch({
    type: UPDATE_CURSOR,
    payload: {
      needUpdate: true,
      id: id,
      position: node.content.length
    }
  })
}

let lastEditId = null;
export const editNode = ({ id, content, lastId }) => (dispatch, getState) => {
  const { contentData } = getState();
  const { nodes } = contentData;
  if (!nodes[id]) {
    return;
  }
  dispatch({
    type: UPDATE_DATA,
    payload: {
      ...contentData,
      nodes: {
        ...nodes,
        [id]: {
          ...nodes[id],
          content
        }
      }
    }
  })
  // 发送后端同步请求
  if (lastEditId === id) {
    onceDispatchEdit({ id, content });
  }
  else {
    dispatch({
      type: ADD_REQUEST,
      payload: {
        request: backend.editNode,
        args: {
          id,
          content
        }
      }
    })
  }
  lastEditId = id;
}

export const deleteNode = ({ id }) => (dispatch, getState) => {
  const { contentData } = getState();
  const { nodes } = contentData;
  const parentId = nodes[id].parent;
  const parent = nodes[parentId];
  const nodeIndex = parent.children.indexOf(id);
  if (nodeIndex === -1) {
    console.error(`未在${parent.id}中找到子节点${id}`);
    return false;
  }
  const newNodesMap = {
    ...nodes,
    [parentId]: {
      ...parent,
      children: [
        ...parent.children.slice(0, nodeIndex),
        ...parent.children.slice(nodeIndex + 1)
      ]
    }
  };
  // 完整的删除子树
  let toDeleteKeys = [...nodes[id].children];
  while (!!toDeleteKeys.length) {
    const key = toDeleteKeys.pop();
    if (!!nodes[key].children.length) {
      toDeleteKeys = [...toDeleteKeys, ...nodes[key].children]
    }
    delete newNodesMap[key];
  }

  dispatch({
    type: UPDATE_DATA,
    payload: {
      ...contentData,
      nodes: newNodesMap
    }
  })

  // 发送后端同步请求
  dispatch({
    type: ADD_REQUEST,
    payload: {
      request: backend.deleteNode,
      args: {
        id
      }
    }
  });
}

export const moveNode = ({ id, parentId, priority }) => (dispatch, getState) => {
  const { contentData } = getState();
  const { nodes } = contentData;
  const prevParentId = nodes[id].parent;
  const prevParent = nodes[prevParentId];
  const newParent = nodes[parentId];
  const newParentChildren = newParent.children || [];
  const node = nodes[id];
  const nodeIndex = prevParent.children.indexOf(id);
  if (nodeIndex === -1) {
    console.error(`未在${prevParentId}中找到子节点${id}`);
    return false;
  }
  dispatch({
    type: UPDATE_DATA,
    payload: {
      ...contentData,
      nodes: {
        ...nodes,
        [prevParentId]: {
          ...prevParent,
          children: [
            ...prevParent.children.slice(0, nodeIndex),
            ...prevParent.children.slice(nodeIndex + 1)
          ]
        },
        [id]: {
          ...node,
          parent: parentId
        },
        [parentId]: {
          ...newParent,
          children: [
            ...newParentChildren.slice(0, priority),
            id,
            ...newParentChildren.slice(priority)
          ]
        }
      }
    }
  })
  // 发送后端同步请求
  dispatch({
    type: ADD_REQUEST,
    payload: {
      request: backend.moveNode,
      args: {
        id,
        parentId,
        priority
      }
    }
  });
}

export const createNode = ({ id, parentId, priority }) => (dispatch, getState) => {
  const { contentData } = getState();
  const { nodes } = contentData;
  const parent = nodes[parentId];
  dispatch({
    type: UPDATE_DATA,
    payload: {
      ...contentData,
      nodes: {
        ...nodes,
        [id]: {
          id,
          parent: parentId,
          content: '',
          children: []
        },
        [parentId]: {
          ...parent,
          children: [
            ...parent.children.slice(0, priority),
            id,
            ...parent.children.slice(priority)
          ]
        }
      }
    }
  });
  // 发送后端同步请求
  dispatch({
    type: ADD_REQUEST,
    payload: {
      request: backend.addNode,
      args: {
        id,
        parentId,
        priority
      }
    }
  });
}

// 更新网络状态
export const updateNetworkCondition = ({ isOnline }) => (dispatch, getState) => {
  const { networkCondition } = getState();
  if (networkCondition.isOnline !== isOnline) {
    dispatch({
      type: UPDATE_NETWORK_STATE,
      payload: {
        isOnline
      }
    })
  }
}