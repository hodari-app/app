const api = 'https://hodari-server.pages.dev/';

function getInfo() {
  return fetch(`${api}/hodari.json`).then(res => res.json());
}

function getChants() {
  return fetch(`${api}/chants-v2.json`).then(res => res.json());
}

function getChant(chant) {
  return fetch(`${api}/chants/${chant}.md`).then(res => res.json());
}

export {getInfo, getChants, getChant};
