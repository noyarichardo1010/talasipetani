import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  AppState,
  Image,
} from 'react-native';

import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import {
  useInitializeAgora,
  useRequestAudioHook,
} from '../../../utils/hooks/useAgora';
import {
  DefaultProfile,
  IconCallBold,
  IconMic,
  IconMicOff,
  IconSoundOnOutline,
  IconSoundOnSolid,
} from '../../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {socket} from '../../../utils/helpers/socket';
import {
  getCallData,
  setCallFromName,
  setCallStatus,
  setChannelName,
  setFromUserPhoto,
  setIsThereIsIncomingCall,
  setLabelStatus,
  setRtcToken,
  setShowEndCallBtn,
} from '../../../services';
import {formatDuration} from '../../../utils/helpers/date';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Panggilan = ({navigation, route}) => {
  const appId = '3cce61a68f6b46a1af18245a0a9c0993';
  const {token, userInfo} = useSelector(reducer => reducer.global);
  const [callInitiated, setCallInitiated] = useState(false);
  const [callData, setCallData] = useState(null);
  // const {data} = route.params;
  const dispatch = useDispatch();
  // console.log('data', data);
  const {
    rtcToken,
    callStatus,
    callFromName,
    channelName,
    agoraOptions,
    agoraChannelParams,
    isThereIsIncomingCall,
    callFromID,
    callToID,
    showEndCallBtn,
    fromUserPhoto,
    labelStatus,
  } = useSelector(reducer => reducer.call);

  const agoraEngineRef = useRef(null); // Agora engine instance
  const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // Message to the user
  const [callDuration, setCallDuration] = useState(0);
  function showMessage(msg) {
    setMessage(msg);
  }

  const setupVoiceSDKEngine = async () => {
    try {
      // use the helper function to get permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user joined with uid ' + Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user left the channel. uid: ' + Uid);
          setRemoteUid(0);
        },
      });

      console.log('agoraEngineeee', agoraEngine);

      agoraEngine?.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });
      // agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };
  const [isSpeakerOn, setSpeakerOn] = useState(false);
  const [isMicOff, setIsMicOff] = useState(false);
  const toggleSpeaker = useCallback(() => {
    // Toggle speaker volume
    setSpeakerOn(!isSpeakerOn);
    // console.log('agoraEngineRef.current', agoraEngineRef.current);
    // if (agoraEngineRef.current?.setEnableSpeakerPhone(!isSpeakerOn)) {
    //   setSpeakerEnabled(agoraEngineRef.current?.isSpeakerphoneEnabled);
    // }
  }, [isSpeakerOn]);

  const toggleMic = useCallback(() => {
    setIsMicOff(!isMicOff);
  }, [isMicOff]);

  useEffect(() => {
    if (isSpeakerOn === true) {
      console.log('agoraEngineRef speaker on', agoraEngineRef);
      agoraEngineRef?.current?.setEnableSpeakerphone(true);
    } else {
      agoraEngineRef?.current?.setEnableSpeakerphone(false);
    }
  }, [isSpeakerOn, agoraEngineRef]);

  useEffect(() => {
    if (isMicOff === true) {
      console.log('agoraEngineRef mute mic', agoraEngineRef);
      //how to disable the mic?

      agoraEngineRef?.current?.enableLocalAudio(true);
      // agoraEngineRef?.current?.muteLocalAudioStream(true);
    } else {
      agoraEngineRef?.current?.enableLocalAudio(true);
      // agoraEngineRef?.current?.muteLocalAudioStream(false);
    }
  }, [isMicOff, agoraEngineRef]);

  const join = useCallback(
    async (tkn, channel) => {
      if (isJoined) {
        return;
      }
      try {
        console.log('rtcToken join', tkn);
        console.log('channelName join', channel);

        agoraEngineRef.current?.setChannelProfile(
          ChannelProfileType.ChannelProfileCommunication,
        );
        agoraEngineRef.current?.startPreview();
        agoraEngineRef.current?.joinChannel(tkn, channel, userInfo?.id, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [channelName, rtcToken],
  );

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('You left the channel');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let timer;

    if (labelStatus === 'Panggilan Dijawab') {
      const interval = setInterval(() => {
        setCallDuration(prevCount => prevCount + 1);
      }, 1000);

      // Membersihkan interval saat komponen tidak lagi digunakan
      return () => {
        clearInterval(interval);
      };
    }

    return () => {
      clearInterval(timer);
    };
  }, [labelStatus]);

  const answerCall = useCallback(async () => {
    dispatch(setIsThereIsIncomingCall(false));
    dispatch(setShowEndCallBtn(true));
    // join(rtcToken, channelName);
    // console.log('data', data);
    // console.log('rtcToken answer', rtcToken);
    // console.log('callFromID answer', callFromID);
    // console.log('callToID answer', callToID);
    // console.log('agoraOptions', agoraOptions);
    // console.log('userInfo.id answer', userInfo);
    // await joinChannel(rtcToken, channelName, callToID);
    socket?.emit('incomingCallAction', {
      rtc_token: rtcToken,
      call_from: callFromID,
      call_to: callToID,
      action: 'ANSWERED', // constant status (all uppercase)
    });

    console.log('answer call emitted');
  }, [dispatch, rtcToken, channelName, callFromID, callToID, userInfo?.id]);

  const disconnectCall = useCallback(() => {
    dispatch(setShowEndCallBtn(false));
    console.log('callStatus', callStatus);
    if (callStatus === 'calling' && labelStatus !== 'Panggilan Dijawab') {
      socket?.emit('incomingCallAction', {
        rtc_token: rtcToken,
        call_from: callFromID,
        call_to: callToID,
        action: 'NOT_ANSWERED', // constant status (all uppercase)
      });
      console.log('end Call emitted');
    } else {
      socket?.emit('incomingCallAction', {
        rtc_token: rtcToken,
        call_from: callFromID,
        call_to: callToID,
        action: 'ENDED', // constant status (all uppercase)
      });
      console.log('end Call emitted');
    }
    leave();
    navigation.goBack();
  }, [dispatch, rtcToken, callFromID, callToID, agoraOptions, callStatus]);

  const removeCallData = async () => {
    await AsyncStorage.removeItem('callData');
  };
  useEffect(() => {
    setupVoiceSDKEngine();
    console.log('appstate', AppState.currentState);
    if (isThereIsIncomingCall && rtcToken) {
      //join room
      console.log('agoraOptions');
      answerCall();
    } else {
      getCallData()
        .then(async res => {
          console.log('res getCallData', res);
          if (res) {
            //join ke channel
            const channel = channelName
              ? channelName
              : `CALL-USER-${res?.call_from_id}`;
            dispatch(setIsThereIsIncomingCall(false));
            dispatch(setShowEndCallBtn(true));
            // console.log('data', data);
            console.log('rtcToken callData', res?.rtc_token);
            console.log('callFromID callData', res?.call_from_id);
            console.log('callToID callData', res?.call_to_id);
            // console.log('agoraOptions', agoraOptions);
            console.log('userInfo.id callData', userInfo?.id);
            // await joinChannel(rtcToken, channelName, callToID);

            socket?.emit('incomingCallAction', {
              rtc_token: res?.rtc_token,
              call_from: res?.call_from_id,
              call_to: res?.call_to_id,
              action: 'ANSWERED', // constant status (all uppercase)
            });
            dispatch(setLabelStatus('Panggilan Dijawab'));
            removeCallData();
            console.log('answer call emitted');
            join(callData?.rtc_token, channel);
          } else {
            setCallData(null);
            // make a room
            console.log('do a call');
            doCall();
            setCallInitiated(true);
          }
        })
        .catch(err => {
          console.log('err getCallData', err);
          setCallData(null);
          // make a room
          console.log('do a call');
          doCall();
          setCallInitiated(true);
        });
    }
    socket.on('doVoiceCall', msg => {
      console.error('msg doVoiceCall ==>', msg);
    });
    return () => {
      // disconnectCall(userInfo?.id, data?.id);
      // Clear the callInitiated flag when the component unmounts
      setCallInitiated(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rtcToken && rtcToken !== '' && channelName && channelName !== '') {
      if (labelStatus === 'Panggilan Dijawab') {
        join(rtcToken, channelName);
      }
    }
  }, [rtcToken, channelName, labelStatus]);

  const doCall = useCallback(() => {
    console.log('token', token);
    dispatch(setCallFromName(route.params?.data?.name));
    dispatch(setLabelStatus(`Memanggil ${route.params?.data?.name}`));
    dispatch(setCallStatus('calling'));
    dispatch(setFromUserPhoto(route.params?.data?.photo_url));
    console.log('target_user_id', route.params);
    console.log('token', token);
    console.log('chat_room_id', route.params?.data?.chat_room_id);
    socket?.emit('doVoiceCall', {
      current_user_token: token,
      target_user_id: route.params?.data?.id,
      // chat_room_id: route.params?.data?.chat_room_id,
    });
    dispatch(setShowEndCallBtn(true));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      console.log('check call');
      if (
        callInitiated &&
        labelStatus !== 'Panggilan Dijawab' &&
        callStatus !== 'ANSWER_CALL'
      ) {
        //jika panggilan tidak dijawab
        console.log('callInititated', callInitiated);
        console.log('labelStatus', labelStatus);
        console.log('callStatus', callStatus);
        //jika memanggil
        socket.emit('incomingCallAction', {
          rtc_token: rtcToken,
          call_from: callFromID,
          call_to: callToID,
          action: 'NOT_ANSWERED', // constant status (all uppercase)
        });

        setCallInitiated(false);
        leave();
        navigation.goBack();
      }
    }, 45000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Gambar panggilan */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={fromUserPhoto !== '' ? {uri: fromUserPhoto} : DefaultProfile}
          style={styles.callImage}
        />

        {/* Informasi panggilan */}
        <View style={styles.callInfo}>
          <Text style={styles.callerName}>{callFromName ?? 'Nama'}</Text>
          <Text style={styles.callTime}>
            {labelStatus === 'Panggilan Dijawab'
              ? formatDuration(callDuration)
              : labelStatus === 'Panggilan Diakhiri'
              ? '...'
              : labelStatus}
          </Text>
        </View>
      </View>
      <View
        style={{
          // backgroundColor: 'red',
          display: 'flex',
          width: '90%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        {/* Tombol aksi panggilan */}
        <TouchableOpacity onPress={toggleSpeaker}>
          {isSpeakerOn ? (
            <IconSoundOnSolid fill="black" width={30} height={30} />
          ) : (
            <IconSoundOnOutline fill="black" width={30} height={30} />
          )}
        </TouchableOpacity>
        {showEndCallBtn && !isThereIsIncomingCall ? (
          <TouchableOpacity
            onPress={disconnectCall}
            style={{
              display: 'flex',
              backgroundColor: 'red',
              width: 60,
              height: 60,
              borderRadius: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconCallBold fill="white" width={30} height={30} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={answerCall}
            style={{
              display: 'flex',
              backgroundColor: 'green',
              width: 60,
              height: 60,
              borderRadius: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconCallBold fill="white" width={30} height={30} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={toggleMic}>
          {isMicOff ? (
            <IconMicOff fill="black" width={30} height={30} />
          ) : (
            <IconMic fill="black" width={30} height={30} />
          )}
        </TouchableOpacity>
      </View>

      {/* <View style={styles.callActions}>
        <TouchableOpacity onPress={join}>
          <Text style={styles.button}>Join</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={disconnectCall}>
          <Text style={styles.button}>Matikan</Text>
        </TouchableOpacity>
      </View> */}
      {/* <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}>
        {isJoined ? (
          <Text>Local user uid: {route.params?.data?.id}</Text>
        ) : (
          <Text>Join a channel</Text>
        )}
        {isJoined && remoteUid !== 0 ? (
          <Text>Remote user uid: {remoteUid}</Text>
        ) : (
          <Text>Waiting for a remote user to join</Text>
        )}
        <Text>{message}</Text>
      </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 50,
  },
  callImage: {
    width: 75,
    height: 75,
    borderRadius: 75,
    marginBottom: 20,
  },
  callInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  callTime: {
    fontSize: 16,
    color: 'gray',
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  callButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  callButtonText: {
    color: 'white',
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  videoView: {width: '90%', height: 200},
  btnContainer: {flexDirection: 'row', justifyContent: 'center'},
  head: {fontSize: 20},
});

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

export default Panggilan;
