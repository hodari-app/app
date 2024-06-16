import {useRecoilState, useSetRecoilState} from 'recoil';

import {getChants, getInfo} from '../api/chants';
import {appState, chantsLoadingState, chantsState} from '../store/store';

function useLoadChants() {
  const setChants = useSetRecoilState(chantsState);
  const setLoading = useSetRecoilState(chantsLoadingState);
  const [app, setApp] = useRecoilState(appState);

  return async function () {
    setLoading({loading: true, error: false});
    try {
      const appInfo = await getInfo();
      if (appInfo.version === app.version) {
        setLoading({loading: false, error: false});
        return;
      }

      const response = await getChants();
      const chants = response.chants.map(
        ({id, title, chant, youtube, categories, updatedAt}) => ({
          id,
          title,
          body: chant,
          categories,
          videoUrl: youtube,
          updatedAt,
        }),
      );

      setChants(chants);
      setApp(appInfo);

      setLoading({loading: false, error: false});
    } catch (e) {
      setLoading({loading: false, error: true});
    }
  };
}

export {useLoadChants};
