import {Text, View} from 'react-native';
import React from 'react';

import {useSelector} from 'react-redux';

import ChatList from './ChatList';
import {gStyles} from '../../../../utils/styles';

const PreviousChat = ({chats, goToRoomChat}) => {
  const {theme, userInfo} = useSelector(reducer => reducer.global);

  return (
    <View
      style={[gStyles.padding(16), {backgroundColor: theme.backgroundColor}]}>
      <Text style={gStyles.text(16, '500', '#313447')}>Chat Terdahulu</Text>
      {chats?.map((chat, i) => (
        <ChatList
          chat={chat}
          key={i}
          onPress={() => goToRoomChat(chat)}
          userInfo={userInfo}
        />
      ))}
    </View>
  );
};

export default PreviousChat;
