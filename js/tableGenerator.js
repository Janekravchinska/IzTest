

const { axios } = window;
const serverAdress = 'http://localhost:8080';
const limit = 20;
let offset = 0;


window.onload = () => {
  loadUsersTable();
  loadSearchListener();
};

async function loadSearchListener() {
  const input = document.getElementById("mySearch");
  let wraper = document.getElementById("wraper");

  input.addEventListener("keyup", async event => {
    event.preventDefault()
    if (event.keyCode === 13) {

      wraper = document.getElementById("wraper");
      wraper.remove();
      _wraperMade();
      await searchUsers(input.value);
    }
  });
}

async function loadUsersTable() {
  _wraperMade();
  const response = await axios.get(`${serverAdress}/?limit=10000`);
  const dataList = response.data.data;
  const currentPage = dataList.slice(offset, offset + limit);
  for (const element of currentPage) {
    _tableRow(element);

    let elem = document.getElementById(`id${element.id}`);

    elem.onclick = async event => await updateUser(_userData(element));
  }

  let countSpan = document.getElementById('count');
  countSpan.innerHTML = dataList.length;
}


async function searchUsers(val) {
  const responseNames = await axios.get(`${serverAdress}/?name=${val}`);
  const responseCities = await axios.get(`${serverAdress}/?city=${val}`);
  const responseEmails = await axios.get(`${serverAdress}/?email=${val}`);
  const responsePhones = await axios.get(`${serverAdress}/?phone=${val}`);
  const datalist = [
    ...responseNames.data.data,
    ...responseCities.data.data,
    ...responseEmails.data.data,
    ...responsePhones.data.data]
    .sort((a, b) => a.id - b.id);
  const count = Number(
    responseCities.data.count + 
    responseNames.data.count + 
    responsePhones.data.count + 
    responseEmails.data.count);

  const dataListHash = {};
  const dataListFiltered = []
  for (const obj of datalist) {
    if (dataListHash[obj.id] === undefined) {
      dataListHash[obj.id] = true;
      dataListFiltered.push(obj);
      _tableRow(obj);
    }
  }


  let countSpan = document.getElementById('count');
  countSpan.innerHTML = count;
}

async function updateUser(userData) {
  await axios.put(`${serverAdress}/update/${userData.id}`, userData);
}

function _wraperMade() {
  const table = document.querySelector('#table');
  const wraper = document.createElement('div');
  wraper.setAttribute('id', 'wraper')
  table.appendChild(wraper);
}

function _tableRow(obj) {

  const row = document.createElement('form');
  row.setAttribute('class', 'row');
  row.addEventListener('submit', async e => e.preventDefault());

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const sell = document.createElement('textarea');
      if(key !== 'id') {
        sell.setAttribute('id', `${key}-${obj.id}`);
        sell.innerHTML = obj[key];
        row.appendChild(sell);

      }
    }
  }

  const button = document.createElement('input');
  button.innerHTML = 'Change';
  button.setAttribute('id', `id${obj.id}`);
  button.setAttribute('type', 'submit');

  button.onclick = async event => await updateUser(_userData(obj));
  row.appendChild(button);
  const wraper = document.getElementById("wraper");
  wraper.appendChild(row);
};

function _userData(obj) {
  return {
    name: document.getElementById(`name-${obj.id}`).value,
    email: document.getElementById(`email-${obj.id}`).value,
    funds: document.getElementById(`funds-${obj.id}`).value,
    city: document.getElementById(`city-${obj.id}`).value,
    phone: document.getElementById(`phone-${obj.id}`).value,
    id: obj.id,
  }
}