// import React, {useEffect} from 'react';
// import {Platform} from 'react-native';
// import SplashScreen from 'react-native-splash-screen';
// import {Routes, store, persistor} from './services';
// import {NavigationContainer} from '@react-navigation/native';
// import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/integration/react';
// import * as Sentry from '@sentry/react-native';
// import {SENTRY_DSN} from './services/url';

// Sentry.init({
//   dsn: SENTRY_DSN,
//   ignoreErrors: [
//     'Network request failed',
//     'Failed to fetch',
//     'NetworkError',
//     'withrealtime/messaging',
//   ],
//   tracesSampleRate: 1.0,
// });

// const App = () => {
//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       SplashScreen.hide();
//     }
//   }, []);
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <NavigationContainer>
//           <Routes />
//         </NavigationContainer>
//       </PersistGate>
//     </Provider>
//   );
// };

// export default Sentry.wrap(App);


import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Routes from './services/routes';
import {store, persistor} from './services/redux/store';

import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import * as Sentry from '@sentry/react-native';
import {SENTRY_DSN} from './services/url';


Sentry.init({
  dsn: SENTRY_DSN,
  ignoreErrors: [
    'Network request failed',
    'Failed to fetch',
    'NetworkError',
    'withrealtime/messaging',
  ],
  tracesSampleRate: 1.0,
});

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default Sentry.wrap(App);
