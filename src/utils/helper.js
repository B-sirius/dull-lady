// 将html转为安全文本
export const htmlEntities = str => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 得到文本中光标的位置
export const getCaretPosition = editableDiv => {
  let caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      const tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      const tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

// 更新root节点，即切换子层级显示
export const updateRoot = (dispatch, type, id, contentData) => () => {
  const { nodes } = contentData;
  const path = [id];
  let node = nodes[id];
  while (!!node.parent) {
    path.unshift(node.parent);
    node = nodes[node.parent];
  }

  dispatch({
    type,
    payload: {
      ...contentData,
      path,
      rootId: id
    }
  });
}

// 更新光标位置
export const updateCursor = (dispatch, type, cursorPosition) => {
  const { id, position } = cursorPosition;
  const el = document.getElementById(id);
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
    type,
    payload: {
      needUpdate: false
    }
  });
}

// 左缩进
export const handleIndentToLeft = (dispatch, updateDataType, updateCursorType, contentData, focusedNode) => {
  const { currId } = focusedNode;
  const id = currId;
  if (!id || !contentData.nodes[id]) return;

  const { nodes, rootId } = contentData;
  const parentId = nodes[id].parent;
  if (parentId === rootId) return;

  const parent = nodes[parentId];
  const node = nodes[id];
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

  dispatch({
    type: updateDataType,
    payload: {
      ...contentData,
      nodes: {
        ...nodes,
        [parentId]: {
          ...parent,
          children: [
            ...parent.children.slice(0, nodeIndex),
            ...parent.children.slice(nodeIndex + 1),
          ]
        },
        [id]: {
          ...node,
          parent: parent.parent
        },
        [newParent.id]: {
          ...newParent,
          children: [
            ...newParent.children.slice(0, parentIndex + 1),
            id,
            ...newParent.children.slice(parentIndex + 1),
          ]
        }
      }
    }
  });

  dispatch({
    type: updateCursorType,
    payload: {
      needUpdate: true,
      id: id,
      position: 0,
    }
  })
}

// 右缩进
export const handleIndentToRight = (dispatch, updateDataType, updateCursorType, contentData, focusedNode) => {
  const { currId } = focusedNode;
  const id = currId;
  if (!id || !contentData.nodes[id]) return;

  const { nodes } = contentData;
  const parentId = nodes[id].parent;
  const parent = nodes[parentId];
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
  // 节点将会被插入到其兄弟节点的子节点的末尾
  if (!brotherNode.children) brotherNode.children = [];
  dispatch({
    type: updateDataType,
    payload: {
      ...contentData,
      nodes: {
        ...nodes,
        [brotherNode.id]: {
          ...brotherNode,
          children: [
            ...brotherNode.children,
            id
          ]
        },
        [parentId]: {
          ...parent,
          children: [
            ...parent.children.slice(0, nodeIndex),
            ...parent.children.slice(nodeIndex + 1),
          ]
        },
        [id]: {
          ...node,
          parent: brotherNode.id
        }
      }
    }
  });
  // 更新光标位置
  dispatch({
    type: updateCursorType,
    payload: {
      needUpdate: true,
      id: id,
      position: node.content.length
    }
  })
}

// 删除节点
export const handleDeleteNode = (dispatch, type, contentData, focusedNode) => {
  const id = focusedNode.currId;
  if (!id) return;
  
  const { nodes } = contentData;
  const parent = nodes[nodes[id].parent];
  const nodeIndex = nodes[parent.id].children.indexOf(id);

  if (nodeIndex === -1) {
    console.error(`未在${parent.id}中找到子节点${id}`);
    return false;
  }

  dispatch({
    type,
    payload: {
      ...contentData,
      nodes: {
        ...nodes,
        [parent.id]: {
          ...parent,
          children: [
            ...parent.children.slice(0, nodeIndex),
            ...parent.children.slice(nodeIndex + 1)
          ]
        }
      }
    }
  })
}