import {MMKV} from 'react-native-mmkv';
const storage = new MMKV({id: 'hodari'});

storage.setObject = function (key, obj) {
  try {
    storage.set(key, JSON.stringify(obj));
  } catch (e) {
    console.log(`Unable to store ${key}`);
    console.log(e);
  }
};
storage.getObject = function (key, defaultValue) {
  if (!storage.contains(key)) {
    return defaultValue;
  }
  try {
    return JSON.parse(storage.getString(key));
  } catch {
    return defaultValue;
  }
};
storage.delete('chants');

export {storage};
