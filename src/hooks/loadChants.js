import {useRecoilState, useSetRecoilState} from 'recoil';
import * as Sentry from '@sentry/react-native';

import {getChants, getInfo} from '../api/chants';
import {appState, chantsLoadingState, chantsState} from '../store/store';
import * as db from '../store/database';

function useLoadChants() {
  const setChants = useSetRecoilState(chantsState);
  const setLoading = useSetRecoilState(chantsLoadingState);
  const [app, setApp] = useRecoilState(appState);

  return async function load() {
    setLoading({loading: true, error: false});
    const chants = await db.getChants();
    try {
      const appInfo = await getInfo();
      if (appInfo.version === app.version && chants.length) {
        setChants(chants);
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
