import {
  useRecoilState,
  useRecoilStateLoadable,
  useSetRecoilState,
} from 'recoil';
import * as Sentry from '@sentry/react-native';

import {getChants, getInfo} from '../api/chants';
import {appState, chantsLoadingState, chantsState} from '../store/store';

function useLoadChants() {
  const [{contents}, setChants] = useRecoilStateLoadable(chantsState);
  const setLoading = useSetRecoilState(chantsLoadingState);
  const [app, setApp] = useRecoilState(appState);

  return async function load() {
    setLoading({loading: true, error: false});
    const chants = await contents;
    try {
      const appInfo = await getInfo();
      if (appInfo.version === app.version && chants.length) {
        setLoading({loading: false, error: false});
        return;
      }

      const response = await getChants();

      const formated = response.chants.map(
        ({id, title, chant, youtube, categories, updatedAt}) => ({
          id,
          title,
          body: chant,
          categories,
          videoUrl: youtube,
          updatedAt,
        }),
      );
      setChants(formated);
      setApp(appInfo);

      setLoading({loading: false, error: false});
    } catch (e) {
      Sentry.captureException(e);
      setLoading({loading: false, error: true});
    }
  };
}

export {useLoadChants};
