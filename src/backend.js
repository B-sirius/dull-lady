import axios from 'axios';

const domain = `http://${window.location.hostname}:4000`;

const getAllNodes = () => axios.get(domain + '/api/nodes');

const initRoot = ({ id }) => axios.post(
  domain + '/api/initroot',
  { id }
);

const getRoot = () => axios.get(domain + '/api/noderoot');

const addNode = ({ id, parentId, priority }) => axios.post(
  domain + '/api/addnode',
  { id, parentId, priority }
);

const deleteNode = ({ id }) => axios.post(
  domain + '/api/deletenode',
  {
    id
  }
);

const editNode = ({ id, content }) => axios.post(
  domain + '/api/editnode',
  { id, content }
);

const moveNode = ({ id, parentId, priority }) => axios.post(
  domain + '/api/movenode',
  { id, parentId, priority }
);

export default {
  getAllNodes,
  getRoot,
  initRoot,
  addNode,
  deleteNode,
  editNode,
  moveNode
}
