import axios from 'axios';

const domain = `//${window.location.hostname}:4000`;

axios.defaults.withCredentials = true;

const createUser = ({ username, password }) => axios.post(
  domain + '/api/createuser',
  { username, password }
);

const logIn = ({ username, password }) => axios.post(
  domain + '/api/login',
  { username, password }
);

const logOut = () => axios.post(
  domain + '/api/logout',
)

const getUser = () => axios.get(domain + '/api/user');

const getUpdatedTime = () => axios(domain + '/api/updatedtime');

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

const pushLocalData = ({ contentData }) => {
  const { nodes } = contentData;
  const nodesArr = Object.keys(nodes).map(key => nodes[key]);
  return axios.post(
    domain + '/api/syncfromlocal',
    { nodesArr }
  )
}

export default {
  getAllNodes,
  getRoot,
  initRoot,
  addNode,
  deleteNode,
  editNode,
  moveNode,
  logIn,
  logOut,
  getUser,
  createUser,
  pushLocalData,
  getUpdatedTime
}
