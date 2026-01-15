import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import ChatList from './ChatList';
import {gStyles} from '../../../../utils/styles';
import {IconMessageOutline} from '../../../../assets';
import {Button} from '../../../../components';

const ActiveChat = ({chats, createRoomChat, goToRoomChat}) => {
  const {theme, userInfo} = useSelector(reducer => reducer.global);

  return (
    <View
      style={[gStyles.padding(16), {backgroundColor: theme.backgroundColor}]}>
      <Text style={gStyles.text(16, '500', '#313447')}>Chat Aktif</Text>
      {chats?.length > 0 ? (
        chats.map((chat, i) => (
          <ChatList
            key={i}
            active
            chat={chat}
            onPress={() => goToRoomChat(chat)}
            userInfo={userInfo}
          />
        ))
      ) : (
        <View style={styles.wrapper}>
          <Text style={gStyles.text(14, '700', '#313447')}>
            Tidak Ada Chat Yang Aktif
          </Text>

          <Text
            style={[
              gStyles.text(12, '400', '#797B8A'),
              gStyles.marginBottom(12),
              gStyles.marginTop(4),
            ]}>
            Saat ini tidak ada chat yang sedang berlangsung.
          </Text>
          <Button
            type="full"
            title="Mulai Chat Bantuan"
            textStyle={gStyles.text(12, '400', '#fff')}
            icon={
              <IconMessageOutline
                fill="#fff"
                width={16}
                height={16}
                style={gStyles.marginRight(8)}
              />
            }
            paddingVertical={8}
            style={styles.button}
            onPress={() => goToRoomChat()}
          />
        </View>
      )}
    </View>
  );
};

export default ActiveChat;

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E3E3E5',
    padding: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
});
