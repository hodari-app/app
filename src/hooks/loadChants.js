import {useAtom, useSetAtom} from 'jotai';
// import * as Sentry from '@sentry/react-native';

import {getChants, getInfo} from '../api/chants';
import {appState, chantsLoadingState, chantsState} from '../store/store';
import * as db from '../store/database';

function useLoadChants() {
  const setChants = useSetAtom(chantsState);
  const setLoading = useSetAtom(chantsLoadingState);
  const [app, setApp] = useAtom(appState);

  return async function load() {
    setLoading({loading: false, error: false});
    const chants = await db.getChants();
    try {
      setChants(chants);

      const appInfo = await getInfo();
      if (appInfo.version === app.version && chants.length) {
        return;
      }

      setLoading({loading: true, error: false});
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
      // Sentry.captureException(e);
      setLoading({loading: false, error: !chants.length});
    }
  };
}

export {useLoadChants};
