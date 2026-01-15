import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, PermissionsAndroid, NativeModules} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  IconHome1,
  IconHome1Active,
  IconHome1Inactive,
  IconProfile1Active,
  IconProfile1Inactive,
  IconTransactionActive,
  IconTransactionInactive,
} from '../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {PetaniHome, TransactionList, Profile} from '../../screens';
import messaging from '@react-native-firebase/messaging';
import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import {
  setAgoraOptions,
  setCallFromID,
  setCallStatus,
  setCallToID,
  setIsSocketConnected,
  setIsThereIsIncomingCall,
  setLabelStatus,
  setRtcToken,
  setShowEndCallBtn,
  setChannelName,
  setCallFromName,
  setFromUserPhoto,
  getCallData,
} from '../redux/action';
import NotifService from '../../utils/helpers/Notifications/Service';
// import io from 'socket.io-client/dist/socket.io.js'; //<----import--
import { io } from 'socket.io-client';
import uuid from 'uuid';
import RNCallKeep, {AnswerCallPayload} from 'react-native-callkeep';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SOCKET_URL} from '../api/url';

let socket;
socket = io(SOCKET_URL, {
  jsonp: false,
});
BackgroundTimer.start();

const getNewUuid = () => uuid.v4().toLowerCase();

const format = uuid => uuid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

const isIOS = Platform.OS === 'ios';

const options = {
  ios: {
    appName: 'TALASI Petani',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    // additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
    // Required to get audio in background when using Android 11
    foregroundService: {
      channelId: 'com.talasipetani',
      channelName: 'Foreground service for my app',
      notificationTitle: 'My app is running on background',
      notificationIcon: 'Path to the resource icon of the notification',
    },
  },
};

RNCallKeep.setup(options);
RNCallKeep.setForegroundServiceSettings({
  channelId: 'com.talasipetani',
  channelName: 'Foreground service for TALASI Petani',
  notificationTitle: 'TALASI Petani is running on background',
  notificationIcon: 'Path to the resource icon of the notification',
});

const Tab = createBottomTabNavigator();
//tampilkan bottom tabs di component berikut ini:

export function BottomTabs() {
  const navigation = useNavigation();

  const {theme, token, isSocketConnected} = useSelector(
    reducer => reducer.global,
  );
  const [activeRoute, setActiveRoute] = useState('f');
  const dispatch = useDispatch();
  const notif = new NotifService(null, null, navigation);
  const [callData, setCallData] = useState(null);
  const {
    rtcToken,
    callStatus,
    agoraOptions,
    agoraChannelParams,
    showEndCallBtn,
    callFromID,
    callToID,
    labelStatus,
    isThereIsIncomingCall,
    channelName,
    callFromName,
  } = useSelector(reducer => reducer.call);

  const [logText, setLog] = useState('');
  const [heldCalls, setHeldCalls] = useState({}); // callKeep uuid: held
  const [mutedCalls, setMutedCalls] = useState({}); // callKeep uuid: muted
  const [calls, setCalls] = useState({}); // callKeep uuid: number

  const log = text => {
    console.info(text);
    setLog(logText + '\n' + text);
  };

  const addCall = (callUUID, number) => {
    setHeldCalls({...heldCalls, [callUUID]: false});
    setCalls({...calls, [callUUID]: number});
  };

  const removeCall = callUUID => {
    const {[callUUID]: _, ...updated} = calls;
    const {[callUUID]: __, ...updatedHeldCalls} = heldCalls;

    setCalls(updated);
    setHeldCalls(updatedHeldCalls);
  };

  const setCallHeld = (callUUID, held) => {
    setHeldCalls({...heldCalls, [callUUID]: held});
  };

  const setCallMuted = (callUUID, muted) => {
    setMutedCalls({...mutedCalls, [callUUID]: muted});
  };

  const displayIncomingCall = number => {
    const callUUID = getNewUuid();

    log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);

    RNCallKeep.displayIncomingCall(callUUID, number, number, 'generic', true);
  };

  // Register background handler
  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   console.log('Message handled in the background!', remoteMessage);
  //   if (remoteMessage?.notification?.android?.title === 'Panggilan Masuk') {
  //     displayIncomingCall(remoteMessage?.data?.call_from_name);
  //   }
  //   // RNCallKeep.displayIncomingCall(
  //   //   remoteMessage.data?.call_from_id,
  //   //   remoteMessage.data?.call_from_name,
  //   //   remoteMessage.data?.call_from_name,
  //   // );
  // });

  const didPerformDTMFAction = ({callUUID, digits}) => {
    const number = calls[callUUID];
    log(
      `[didPerformDTMFAction] ${format(
        callUUID,
      )}, number: ${number} (${digits})`,
    );
  };

  const onIncomingCallDisplayed = useCallback(
    ({callUUID, handle, fromPushKit, payload}) => {
      BackgroundTimer.setTimeout(() => {
        RNCallKeep.endAllCalls();
        if (callStatus === 'calling' || callStatus === 'ringing') {
          //jika bukan panggilan masuk
          console.log('labelStatus endCall', labelStatus);
          console.log('rtcToken endCall', rtcToken);
          console.log('callFromID endCall', callFromID);
          console.log('callToID endCall', callToID);
          socket?.emit('incomingCallAction', {
            rtc_token: rtcToken,
            call_from: callFromID,
            call_to: callToID,
            action: 'NOT_ANSWERED', // constant status (all uppercase)
          });
          dispatch(setLabelStatus('...'));
          dispatch(setIsThereIsIncomingCall(false));
          dispatch(setCallStatus('reject'));
        }
      }, 45000);
    },
    [rtcToken, callFromID, callToID],
  );
  const didReceiveStartCallAction = ({handle}) => {
    if (!handle) {
      // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
      return;
    }
    const callUUID = getNewUuid();
    addCall(callUUID, handle);

    log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

    RNCallKeep.startCall(callUUID, handle, handle);

    BackgroundTimer.setTimeout(() => {
      log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
      RNCallKeep.setCurrentCallActive(callUUID);
    }, 1000);
  };

  const didPerformSetMutedCallAction = ({muted, callUUID}) => {
    const number = calls[callUUID];
    log(
      `[didPerformSetMutedCallAction] ${format(
        callUUID,
      )}, number: ${number} (${muted})`,
    );

    setCallMuted(callUUID, muted);
  };

  const didToggleHoldCallAction = ({hold, callUUID}) => {
    const number = calls[callUUID];
    log(
      `[didToggleHoldCallAction] ${format(
        callUUID,
      )}, number: ${number} (${hold})`,
    );

    setCallHeld(callUUID, hold);
  };

  const hangup = callUUID => {
    RNCallKeep.endCall(callUUID);
    removeCall(callUUID);
  };

  const setOnHold = (callUUID, held) => {
    const handle = calls[callUUID];
    RNCallKeep.setOnHold(callUUID, held);
    log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);

    setCallHeld(callUUID, held);
  };

  const setOnMute = (callUUID, muted) => {
    const handle = calls[callUUID];
    RNCallKeep.setMutedCall(callUUID, muted);
    log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);

    setCallMuted(callUUID, muted);
  };

  const updateDisplay = callUUID => {
    const number = calls[callUUID];
    // Workaround because Android doesn't display well displayName, se we have to switch ...
    if (isIOS) {
      RNCallKeep.updateDisplay(callUUID, 'New Name', number);
    } else {
      RNCallKeep.updateDisplay(callUUID, number, 'New Name');
    }

    log(`[updateDisplay: ${number}] ${format(callUUID)}`);
  };
  useEffect(() => {
    getCallData()
      .then(async res => {
        console.log('res getCallData', res);
        if (res) {
          setCallData(res);
        } else {
          setCallData(null);
        }
      })
      .catch(err => {
        console.log('err getCallData', err);
        setCallData(null);
      });
    RNCallKeep.addEventListener('answerCall', answerCall);
    RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
    RNCallKeep.addEventListener(
      'didReceiveStartCallAction',
      didReceiveStartCallAction,
    );
    RNCallKeep.addEventListener(
      'didPerformSetMutedCallAction',
      didPerformSetMutedCallAction,
    );
    RNCallKeep.addEventListener(
      'didToggleHoldCallAction',
      didToggleHoldCallAction,
    );
    RNCallKeep.addEventListener('endCall', endCall);
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      onIncomingCallDisplayed,
    );

    return () => {
      RNCallKeep.removeEventListener('answerCall', answerCall);
      RNCallKeep.removeEventListener(
        'didPerformDTMFAction',
        didPerformDTMFAction,
      );
      RNCallKeep.removeEventListener(
        'didReceiveStartCallAction',
        didReceiveStartCallAction,
      );
      RNCallKeep.removeEventListener(
        'didPerformSetMutedCallAction',
        didPerformSetMutedCallAction,
      );
      RNCallKeep.removeEventListener(
        'didToggleHoldCallAction',
        didToggleHoldCallAction,
      );
      RNCallKeep.removeEventListener('endCall', endCall);
      RNCallKeep.removeEventListener('rejectCall', rejectCall);
      RNCallKeep.removeEventListener(
        'didDisplayIncomingCall',
        onIncomingCallDisplayed,
      );
    };
  }, []);

  useEffect(() => {
    if (callData && callData !== null) {
      socket.on('connect', () => {
        console.log('availbale to answer call', token);
        RNCallKeep.setAvailable(true);
        dispatch(setCallStatus('ringing'));
        dispatch(
          setLabelStatus('Incoming call from ' + callData.call_from_name),
        );
        dispatch(setIsThereIsIncomingCall(true));
        dispatch(setCallFromName(callData.call_from_name));

        // dispatch(setRtcToken(callData.rtc_token));
        // Saat terkoneksi maka akan request join room
        socket.emit('joinMyVoiceCallRoom', {current_user_token: token});
        socket.emit('incomingCallAction', {
          rtc_token: callData?.rtc_token,
          call_from: parseInt(callData?.call_from_id),
          call_to: parseInt(callData?.call_to_id),
          action: 'RINGING', // constant status (all uppercase)
        });

        navigation.navigate('Panggilan', {
          data: {
            callToID: parseInt(callData?.call_to_id),
            callFromID: parseInt(callData?.call_from_id),
            rtcToken: callData?.rtc_token,
            name: callData?.call_from_name,
          },
        }); // navigated to call screen in our app
      });
    }
  }, [callData]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage log!', remoteMessage);
      const notifData = remoteMessage.data?.chat_json
        ? JSON.parse(remoteMessage.data?.chat_json)
        : remoteMessage.data ?? null;
      const body = notifData?.last_message?.coupon_id
        ? 'Mengirimkan kupon harga khusus'
        : remoteMessage.notification?.body;
      console.log('notifData', notifData);
      console.log('body', body);
      console.log('title', remoteMessage.notification?.title);

      if (remoteMessage.notification?.title !== 'Panggilan masuk') {
        console.log('notif.localNotif');

        notif.localNotif(
          'Pesan Masuk',
          remoteMessage.notification?.title ?? 'Pesan Baru',
          body,
          notifData,
        );
      }
    });

    // availableToCall(token);

    // console.log('room', room);
    // console.log('usernameSendUser', usernameSendUser);

    socket.on('connect_error', err => {
      console.log('error connect', err);
      console.log(`websocket connect_error due to ${err.message}`);
    });
    // console.log('socket', socket);
    socket.on('connect', () => {
      console.log('availbale', token);
      RNCallKeep.setAvailable(true);

      // Saat terkoneksi maka akan request join room
      socket.emit('joinMyVoiceCallRoom', {current_user_token: token});

      // socket.emit('doVoiceCall', {
      //   current_user_token: token,
      //   target_user_id: target_id,
      // });
    });
    socket.on('disconnect', () => {
      dispatch(setIsSocketConnected(false));
      RNCallKeep.setAvailable(false);
    });

    socket.on('joinMyVoiceCallRoom', msg => {
      console.log('msg join voice call room', msg);
      if (msg === 'success') {
        dispatch(setIsSocketConnected(true));
      }
    });

    console.log('socket status', isSocketConnected);
    socket.on('doVoiceCall', msg => {
      console.error('msg doVoiceCall ==>', msg);
    });

    socket.on('joinVoiceCall', msg => {
      console.log('msg join voice call room ', msg);

      const setAgoraObjects = async (rtcTKN, channelId) => {
        dispatch(
          setAgoraOptions(opts => ({
            ...opts,
            channel: channelId,
            token: rtcTKN,
          })),
        );
      };
      if (msg.status === 'CALLING') {
        console.log('test');
        // dispatch(setCallData({
        //   ...callData,
        //   labelStatus: `Calling + ${msg.call_to_name}`,
        //   callFromName: msg.call_from_name,
        //   callToName: msg.call_to_name,
        //   callFromID: msg.call_from_id,
        //   callToID: msg.call_to_id,
        //   channelName: msg.channel_name,
        //   rtcToken: msg.rtc_token,
        // }));
        dispatch(setCallStatus('calling'));
        dispatch(setLabelStatus('Calling ' + msg.call_to_name));
        dispatch(setCallFromID(msg.call_from_id));
        dispatch(setCallToID(msg.call_to_id));
        dispatch(setChannelName(msg.channel_name));
        dispatch(setRtcToken(msg.rtc_token));
        dispatch(setFromUserPhoto(msg.from_user_photo));
        setAgoraObjects(msg.rtc_token, msg.channel_name);
      } else if (msg.status === 'INCOMING_CALL') {
        dispatch(setCallStatus('ringing'));
        dispatch(setLabelStatus('Incoming call from ' + msg.call_from_name));
        dispatch(setIsThereIsIncomingCall(true));
        setAgoraObjects(msg.rtc_token, msg.channel_name);
        dispatch(setChannelName(msg.channel_name));
        dispatch(setCallFromName(msg.call_from_name));
        // set id from sender and receiver
        dispatch(setCallFromID(msg.call_from_id));
        dispatch(setCallToID(msg.call_to_id));
        dispatch(setRtcToken(msg.rtc_token));
        // payload to send this user status
        // if this user receive this message with this status
        // this means this user already online

        socket.emit('incomingCallAction', {
          rtc_token: msg.rtc_token,
          call_from: msg.call_from_id,
          call_to: msg.call_to_id,
          action: 'RINGING', // constant status (all uppercase)
        });
      } else {
        dispatch(setLabelStatus('error: ' + msg.status));
      }
    });

    socket.on('incomingCallAction', msg => {
      console.log('msg incomingCallAction', msg);

      let targetUserAction = '';
      console.log('message incomingCallAction =>', msg);
      if (msg.action === 'RINGING') {
        targetUserAction = 'Berdering...';
      } else if (msg.action === 'ANSWERED') {
        dispatch(setShowEndCallBtn(true));
        targetUserAction = 'Panggilan Dijawab';
        dispatch(setCallStatus('ANSWER_CALL'));
      } else if (msg.action === 'NOT_ANSWERED') {
        targetUserAction = 'Panggilan Tidak Dijawab';
        dispatch(setCallFromID(0));
        dispatch(setCallToID(0));
        dispatch(setRtcToken(''));
        dispatch(setCallStatus('LEAVE_CALL'));
      } else if (msg.action === 'REJECTED') {
        // reset status
        dispatch(setCallFromID(0));
        dispatch(setCallToID(0));
        dispatch(setRtcToken(''));
        dispatch(setCallStatus('LEAVE_CALL'));
        navigation?.goBack();
        // hide button
        dispatch(setIsThereIsIncomingCall(false));

        targetUserAction = 'Panggilan Ditolak';
      } else if (msg.action === 'ENDED') {
        // console.error('panggilan diakhiri');
        navigation?.goBack();
        // reset status
        dispatch(setCallFromID(0));
        dispatch(setCallToID(0));
        dispatch(setRtcToken(''));
        dispatch(setCallStatus('LEAVE_CALL'));

        // hide button
        dispatch(setIsThereIsIncomingCall(false));
        dispatch(setShowEndCallBtn(false));

        // show call button
        targetUserAction = 'Panggilan Diakhiri';
      }

      dispatch(setLabelStatus(targetUserAction));
    });

    socket.on('connect_error', err => {
      console.log(`websocket connect_error due to ${err.message}`);
    });

    return async () => {
      unsubscribe;
      await AsyncStorage.removeItem('callData');
    };
  }, []);

  const answerCall = useCallback(
    ({callUUID, name}) => {
      for (var i = 0; i < 10; i++) {
        RNCallKeep.backToForeground();
      }
      console.log('angkat telpon');
      console.log('rtcToken', rtcToken);
      console.log('callToID', callToID);
      console.log('callFromID', callFromID);

      if (Platform.OS === 'android') {
        const {CallkeepHelperModule} = NativeModules;
        CallkeepHelperModule.startActivity();
        RNCallKeep.endCall(callUUID, false);
      }

      navigation.navigate('Panggilan', {
        data: {callToID, callFromID, rtcToken, name: name},
      }); // navigated to call screen in our app
    },
    [callToID, callFromID, rtcToken],
  );

  // const answerCall = ({callUUID, name}) => {
  //   for (var i = 0; i < 10; i++) {
  //     RNCallKeep.backToForeground();
  //   }
  //   console.log('angkat telpon');
  //   console.log('rtcToken', rtcToken);
  //   console.log('callToID', callToID);
  //   console.log('callFromID', callFromID);

  //   if (Platform.OS === 'android') {
  //     const {CallkeepHelperModule} = NativeModules;
  //     CallkeepHelperModule.startActivity();
  //     RNCallKeep.endCall(callUUID, false);
  //   }
  //   navigate("Panggilan", {callUUID});

  //   navigation.navigate('Panggilan', {
  //     data: {callToID, callFromID, rtcToken, name: name},
  //   }); // navigated to call screen in our app
  // };

  const endCall = useCallback(
    ({callUUID}) => {
      const handle = calls[callUUID];
      log(`[endCall] ${format(callUUID)}, number: ${handle}`);

      removeCall(callUUID);
    },
    [rtcToken, callFromID, callToID, callStatus],
  );

  const rejectCall = useCallback(
    ({callUUID}) => {
      const handle = calls[callUUID];
      log(`[rejectCall] ${format(callUUID)}, number: ${handle}`);
      if (callStatus === 'calling' || callStatus === 'ringing') {
        //jika bukan panggilan masuk
        console.log('labelStatus endCall', labelStatus);
        console.log('rtcToken endCall', rtcToken);
        console.log('callFromID endCall', callFromID);
        console.log('callToID endCall', callToID);
        socket?.emit('incomingCallAction', {
          rtc_token: rtcToken,
          call_from: callFromID,
          call_to: callToID,
          action: 'NOT_ANSWERED', // constant status (all uppercase)
        });
        dispatch(setLabelStatus('...'));
        dispatch(setIsThereIsIncomingCall(false));
        dispatch(setCallStatus('reject'));
      }
      removeCall(callUUID);
    },
    [rtcToken, callFromID, callToID, callStatus],
  );

  useEffect(() => {
    if (
      rtcToken &&
      isThereIsIncomingCall &&
      callFromID !== 0 &&
      callToID !== 0
    ) {
      // notif.callNotif(callFromID, 'Panggilan Masuk', labelStatus, {
      //   rtcToken: rtcToken,
      //   callToID,
      //   callFromID,
      //   callStatus,
      //   name: callFromName,
      // });

      displayIncomingCall(callFromName);
    }

    if (showEndCallBtn) {
      RNCallKeep.setCurrentCallActive(callFromName);
    }
  }, [
    callData,
    isThereIsIncomingCall,
    rtcToken,
    callFromID,
    callStatus,
    callToID,
    callFromName,
  ]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: {
          backgroundColor: '#000',
        },

        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
        },
      }}
      screenListeners={({navigation, route}) => ({
        state: e => {
          // Do something with the state
          const subRoute = getFocusedRouteNameFromRoute(route);

          // console.log('subRoute', subRoute);
          // console.log('state changed', e.data);
          setActiveRoute(e.data.state.routeNames[e.data.state.index]);
          // console.log('navigation', navigation);
          // Do something with the `navigation` object
          if (!navigation.canGoBack()) {
            console.log("we're on the initial screen");
          }
        },
      })}>
      <Tab.Screen
        name="HomeScreen"
        component={PetaniHome}
        options={{
          tabBarLabel: 'Beranda',
          tabBarInactiveTintColor: theme.iconColor,
          tabBarActiveTintColor: theme.activeIconColor,
          tabBarLabelStyle: {fontWeight: '600', fontSize: 12},
          tabBarItemStyle: {
            margin: 4,

            paddingVertical: 8,
            borderRadius: 4,
            backgroundColor:
              activeRoute === 'HomeScreen'
                ? theme.activeBackgroundIconColor
                : '#fff',
          },
          tabBarIcon: ({focused}) =>
            focused ? (
              <IconHome1Active width={20} height={20} />
            ) : (
              <IconHome1Inactive width={20} height={20} />
            ),
        }}
      />
      <Tab.Screen
        name="TransactionScreen"
        component={TransactionList}
        options={{
          tabBarLabel: 'Transaksi',
          tabBarInactiveTintColor: theme.iconColor,
          tabBarActiveTintColor: theme.activeIconColor,
          tabBarLabelStyle: {fontWeight: '600', fontSize: 12},
          tabBarItemStyle: {
            margin: 4,
            paddingVertical: 8,
            borderRadius: 4,
            backgroundColor:
              activeRoute === 'TransactionScreen'
                ? theme.activeBackgroundIconColor
                : '#fff',
          },
          tabBarIcon: ({focused}) =>
            focused ? (
              <IconTransactionActive width={20} height={20} />
            ) : (
              <IconTransactionInactive width={20} height={20} />
            ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          tabBarLabel: 'Profil',
          tabBarInactiveTintColor: theme.iconColor,
          tabBarActiveTintColor: theme.activeIconColor,
          tabBarLabelStyle: {fontWeight: '600', fontSize: 12},
          tabBarItemStyle: {
            margin: 4,

            paddingVertical: 8,
            borderRadius: 4,
            backgroundColor:
              activeRoute === 'ProfileScreen'
                ? theme.activeBackgroundIconColor
                : '#fff',
          },
          tabBarIcon: ({focused}) =>
            focused ? (
              <IconProfile1Active width={20} height={20} />
            ) : (
              <IconProfile1Inactive width={20} height={20} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}
