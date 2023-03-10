import {useRecoilState, useSetRecoilState} from 'recoil';
import {Index} from 'flexsearch';

import {getChants, getInfo} from '../api/chants';
import {
  appState,
  chantsIndexState,
  chantsLoadingState,
  chantsState,
} from '../store/store';

function useLoadChants() {
  const [chants, setChants] = useRecoilState(chantsState);
  const setChantsIndex = useSetRecoilState(chantsIndexState);
  const setLoading = useSetRecoilState(chantsLoadingState);
  const [app, setApp] = useRecoilState(appState);

  function createIndex(toIndex) {
    const chantsIndex = new Index({
      charset: 'latin:simple',
      tokenize: 'forward',
      resolution: 9,
    });
    let id = 0;
    for (const {title} of toIndex) {
      chantsIndex.add(id++, title);
    }
    setChantsIndex(chantsIndex);
  }

  return async function () {
    setLoading({loading: true, error: false});
    try {
      const appInfo = await getInfo();
      if (appInfo.version === app.version) {
        createIndex(chants);
        setLoading({loading: false, error: false});
        return;
      }
      const response = await getChants();
      createIndex(response.chants);
      setChants(response.chants);
      setApp(appInfo);
      setLoading({loading: false, error: false});
    } catch (e) {
      setLoading({loading: false, error: true});
    }
  };
}

export {useLoadChants};
