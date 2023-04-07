import {useRecoilState, useSetRecoilState} from 'recoil';

import {getChants, getInfo} from '../api/chants';
import {appState, chantsLoadingState, chantsState} from '../store/store';
import {cleanString} from '../utils/string';

function useLoadChants() {
  const [chants, setChants] = useRecoilState(chantsState);
  const setLoading = useSetRecoilState(chantsLoadingState);
  const [app, setApp] = useRecoilState(appState);

  return async function () {
    setLoading({loading: true, error: false});
    try {
      const appInfo = await getInfo();
      if (appInfo.version === app.version) {
        setChants(chants);
        setLoading({loading: false, error: false});
        return;
      }
      const response = await getChants();

      for (const chant of response.chants) {
        chant.clean = {
          title: cleanString(chant.title),
          chant: cleanString(chant.chant),
        };
      }
      setChants(response.chants);

      setApp(appInfo);
      setLoading({loading: false, error: false});
    } catch (e) {
      setLoading({loading: false, error: true});
    }
  };
}

export {useLoadChants};
