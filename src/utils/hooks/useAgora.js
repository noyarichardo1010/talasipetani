import {useEffect, useState, useRef, useCallback} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';

import {askMediaAccess, requestAudioPermission} from '../helpers/permissions';
// import {AGORA_APP_ID} from '@env';

import {useSelector} from 'react-redux';

export const useRequestAudioHook = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Request required permissions from Android

      requestAudioPermission()
        .then(() => {
          console.log('requested!');
        })
        .catch(err => console.log('please allow app to use mic', err));
    }
  }, []);
};

import RtcEngine, {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
} from 'react-native-agora';

const Config = {
  // Get your own App ID at https://dashboard.agora.io/
  appId: '3cce61a68f6b46a1af18245a0a9c0993',
  // Please refer to https://docs.agora.io/en/Agora%20Platform/token
  token: '',
  channelId: 'testdcg',
  uid: 0,
  mLogConfig: true,
  channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
};

export const useInitializeAgora = () => {
  // Replace yourAppId with the App ID of your Agora project.
  const {token} = useSelector(reducer => reducer.global);
  // const idUser = checkIdUser();
  const [channelName, setChannelName] = useState('my-channel');
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [isMute, setIsMute] = useState(false);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const [localUid, setLocalUid] = useState(undefined);

  const [isJoined, setIsJoined] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [engine, setEngine] = useState(null);
  const appId = '3cce61a68f6b46a1af18245a0a9c0993';
  const agoraEngineRef = useRef(null); // Agora engine instance

  const [message, setMessage] = useState(''); // Message to the user

  function showMessage(msg) {
    setMessage(msg);
  }
  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };
  useEffect(() => {
    // Initialize Agora engine when the app starts
    setupVoiceSDKEngine();
  });

  const setupVoiceSDKEngine = useCallback(async () => {
    try {
      // use the helper function to get permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();

      const agoraEngine = agoraEngineRef.current;
      agoraEngine.initialize(Config);
      console.log('agoraEngine', agoraEngine);
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
    } catch (e) {
      console.log(e);
    }
  }, []);
  const joinChannel = useCallback(
    async (rtcToken, channelId, uid) => {
      if (isJoined) {
        return;
      }
      console.log('rtcToken', rtcToken);
      console.log('channelId', channelId);
      console.log('uid', uid);

      try {
        agoraEngineRef.current?.setChannelProfile(
          ChannelProfileType.ChannelProfileCommunication,
        );
        agoraEngineRef.current?.joinChannel(rtcToken, channelId, uid, {
          clientRoleType: ClientRoleType.ClientRoleAudience,
        });
      } catch (e) {
        console.log(e);
      }
    },
    [agoraEngineRef],
  );

  const leaveChannel = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('You left the channel');
    } catch (e) {
      console.log(e);
    }
  };

  const toggleIsMute = useCallback(async () => {
    agoraEngineRef.current?.muteLocalAudioStream(!isMute);
    setIsMute(!isMute);
  }, [isMute]);

  const toggleIsSpeakerEnable = useCallback(async () => {
    agoraEngineRef.current?.setEnableSpeakerphone(!isSpeakerEnable);
    setIsSpeakerEnable(!isSpeakerEnable);
  }, [isSpeakerEnable]);

  return {
    isMute,
    isSpeakerEnable,
    joinSucceed,
    agoraEngineRef,
    joinChannel,
    leaveChannel,
    toggleIsMute,
    toggleIsSpeakerEnable,
    localUid,
    isPublished,
    engine,
    isJoined,
  };
};
