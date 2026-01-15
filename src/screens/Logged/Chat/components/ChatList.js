import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {gStyles} from '../../../../utils/styles';
import {DefaultProfile} from '../../../../assets';
import {formatChatTimestamp} from '../../../../utils/helpers/date';

const ChatList = ({
  chat,
  onPress = () => Alert.alert('go to room chat'),
  userInfo,
}) => {
  console.log('userInfo di chat list', userInfo);
  // console.log('chat', chat);
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <Image
          source={DefaultProfile}
          style={[gStyles.dimension(40, 40), gStyles.borderRadius(40)]}
        />
        <View
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <View style={{display: 'flex', flex: 1, flexDirection: 'row'}}>
            <View style={[gStyles.flex(1), gStyles.marginLeft(8)]}>
              <Text style={gStyles.text(14, '700', '#313447')}>
                {chat?.sender_profile?.name}{' '}
                <Text style={gStyles.weight('400')}>(Purchasing Admin)</Text>
              </Text>
            </View>

            <View style={gStyles.row_2}>
              {chat?.is_active_flag === 'Y' && chat?.is_finish_flag === 'N' ? (
                <Text style={gStyles.textSuccess}>Aktif</Text>
              ) : (
                <Text style={[gStyles.textGrey, gStyles.textAlign('right')]}>
                  {formatChatTimestamp(chat?.last_message?.created_at)}
                </Text>
              )}
            </View>
          </View>
          <Text
            style={[gStyles.text(12, '400', '#797B8A'), gStyles.marginLeft(8)]}>
            {userInfo?.farmer_profile?.user_id === chat?.last_message?.user_id
              ? 'You: '
              : null}
            {chat?.last_message?.files?.length > 0
              ? 'Mengirim files'
              : chat?.last_message?.offer_id !== 0
              ? 'Mengirim Penawaran'
              : chat?.last_message?.coupon_id !== 0
              ? 'Mengirim Harga Khusus'
              : chat?.last_message?.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E3E3E5',
    padding: 12,
    marginTop: 8,
  },
});
