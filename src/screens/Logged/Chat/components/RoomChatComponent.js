import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {
  IconCallBold,
  IconDocumentText,
  IconDocumentUpload,
  IconLeftArrow,
  IconUserOcatgon,
  LogoKecil,
} from '../../../../assets';
import {gStyles} from '../../../../utils/styles';
import {AppBar} from '../../../../components';
import {formatChatTimestamp} from '../../../../utils/helpers/date';
import {setChatMessage} from '../../../../services';
import HTMLView from 'react-native-htmlview';

const RoomChatComponent = React.memo(
  ({
    theme,
    navigation,
    route,
    chat,
    chatMessage,
    chatHistory,
    dispatch,
    chatBotOptions,
    chatWithBot,
    setChatWithBot,
    openPanel,
    userInfo,
    handleSubmitMessage,
    scrollViewRef,
    fadeAnim,
    fadeAnimBot,
    setAttachment,
    _renderHargaKhususAtauPenawaran,
  }) => {
    // const RoomChatComponent = props => {
    // const {theme, navigation, route, chatMessage, dispatch, chat} = props;
    // const {
    //   theme,
    //   navigation,
    //   route,
    //   chat,
    //   chatMessage,
    //   chatHistory,
    //   dispatch,
    //   chatBotOptions,
    //   chatWithBot,
    //   setChatWithBot,
    //   openPanel,
    //   userInfo,
    //   handleSubmitMessage,
    //   scrollViewRef,
    //   isModalPreviewVisible,
    //   toggleModalPreview,
    //   attachment,
    //   setAttachment,
    //   _renderHargaKhususAtauPenawaran,
    // } = props;
    // console.log('chat roomchatcomponent', chat);

    const _renderChatDoc = doc => {
      // console.log('chat doc', doc);
      return doc?.files?.map((file, i) => {
        // console.log('file', file);
        const f = file.file_url.split('.');
        const filetype = f[f.length - 1];
        if (filetype === 'png' || filetype === 'jpg' || filetype === 'jpeg') {
          return (
            <TouchableOpacity
              onPress={() => {
                setAttachment({
                  // name: file.filename, //ini dikomen karena untuk menyembunyikan inputan teks ngirim gambar
                  uri: file.file_url,
                  type: `image/${filetype}`,
                });
                // toggleModalPreview();
              }}
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{uri: file.file_url}}
                style={{width: 100, height: 100, borderRadius: 5}}
              />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              onPress={() => {
                setAttachment({
                  // name: file.filename, //ini dikomen karena untuk menyembunyikan inputan teks ngirim gambar
                  uri: file.file_url,
                  type: `${filetype}`,
                });
                // toggleModalPreview();
              }}
              key={i}>
              <IconDocumentText fill="#2E3192" width={32} height={32} />
            </TouchableOpacity>
          );
        }
      });
    };

    return (
      <View style={styles.container}>
        {/* Modal pratinjau gambar */}

        <AppBar
          appBarColor={theme.backgroundColor}
          navigation={navigation}
          headerTextColor={theme.textColor}
          iconLeft={<IconLeftArrow width={20} height={20} fill={'#797B8A'} />}
          rightContent={
            chatWithBot === true ? null : chat?.is_finish_flag !== 'Y' &&
              chat?.sender_profile?.name &&
              chat?.sender_profile?.id ? (
              <TouchableOpacity
                // onPress={() =>
                //   Linking.openURL(`tel:${chat?.sender_profile?.photo_url}`)
                // }
                onPress={() => openPanel('Call')}
                style={styles.appBarRightContent}>
                <IconCallBold width={24} height={24} fill="#2E3192" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.appBarRightContent}>
                <IconCallBold width={24} height={24} fill="#CBCCD1" />
              </TouchableOpacity>
            )
          }
          titleComponent={
            <View style={gStyles.rowWithoutJustify}>
              <Image
                source={
                  chatWithBot === true
                    ? LogoKecil
                    : chat?.sender_profile?.photo_url
                    ? {uri: chat.sender_profile.photo_url}
                    : LogoKecil
                }
                style={[
                  gStyles.dimension(24, 25),
                  gStyles.borderRadius(40),
                  gStyles.marginRight(6),
                ]}
              />
              <View style={gStyles.flexCenter('row')}>
                <Text
                  style={[
                    gStyles.text(16, '500', theme.textColor),
                    gStyles.marginRight(4),
                  ]}>
                  {chatWithBot === true
                    ? 'Talasi'
                    : chat?.sender_profile?.name ?? 'Talasi'}
                </Text>
                <Text style={gStyles.text(12, '400', '#797B8A')}>
                  {chatWithBot === true ? '(Bot Talasi)' : '(Purchasing Admin)'}
                </Text>
              </View>
            </View>
          }
          borderBottom
          borderBottomColor={theme.textColor}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          style={[
            gStyles.paddingVertical(16),
            gStyles.paddingBottom(50),
            gStyles.paddingHorizontal(8),
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}
          contentContainerStyle={[gStyles.flex(0), gStyles.paddingBottom(20)]}>
          {/* content chat */}

          {chatHistory?.length > 0 &&
            chatHistory?.map((c, index) => (
              <Animated.View
                style={[styles.messageContainer, {opacity: fadeAnim}]}
                key={index}>
                {/* {console.log('c', c)} */}
                {c?.user_id !== userInfo?.farmer_profile?.user_id ||
                c?.user_id !== userInfo?.user?.id ? ( //jika yang mengirim orang lain
                  // si pengirim
                  <View style={styles.senderWrapper}>
                    {c?.message !== '' ? (
                      <View style={[styles.senderTextWrapper]}>
                        {/* {console.log('c.message', c?.message)} */}
                        {c?.message.charAt(0) === '<' ? (
                          <HTMLView value={c?.message} stylesheet={styles} />
                        ) : (
                          <Text
                            style={gStyles.text(14, '400', theme.textColor)}>
                            {c?.message}
                          </Text>
                        )}

                        <Text
                          style={[
                            gStyles.text(10, '400', '#797B8A'),
                            gStyles.textAlign('right'),
                          ]}>
                          {formatChatTimestamp(c?.created_at)}
                        </Text>
                      </View>
                    ) : c?.offer_id !== 0 ||
                      (c?.coupon_id !== 0 && c?.files === null) ? (
                      <View>{_renderHargaKhususAtauPenawaran(c)}</View>
                    ) : c?.files !== null ? (
                      <View style={[styles.senderTextWrapper]}>
                        {_renderChatDoc(c)}
                        <Text style={gStyles.text(14, '400', theme.textColor)}>
                          {c?.message}
                        </Text>
                        <Text
                          style={[
                            gStyles.text(10, '400', '#797B8A'),
                            gStyles.textAlign('right'),
                          ]}>
                          {formatChatTimestamp(c?.created_at)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <View style={styles.receiverWrapper}>
                    {c?.message !== '' && c?.files === null ? (
                      <View style={styles.receiverTextWrapper}>
                        <Text style={gStyles.text(14, '400', theme.textColor)}>
                          {c?.message}
                        </Text>
                        {c?.created_at ? (
                          <Text
                            style={[
                              gStyles.text(10, '400', '#797B8A'),
                              gStyles.textAlign('right'),
                            ]}>
                            {formatChatTimestamp(c?.created_at)}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              gStyles.text(10, '400', '#797B8A'),
                              gStyles.textAlign('right'),
                            ]}>
                            loading
                          </Text>
                        )}
                      </View>
                    ) : c?.offer_id !== 0 ||
                      (c?.coupon_id !== 0 && c?.files === null) ? (
                      <View>{_renderHargaKhususAtauPenawaran(c)}</View>
                    ) : c?.files !== null &&
                      c?.offer_id === 0 &&
                      c?.coupon_id === 0 ? (
                      <View style={styles.receiverTextWrapper}>
                        {_renderChatDoc(c)}
                        <Text style={gStyles.text(14, '400', theme.textColor)}>
                          {c?.message}
                        </Text>
                        {c?.created_at ? (
                          <Text
                            style={[
                              gStyles.text(10, '400', '#797B8A'),
                              gStyles.textAlign('right'),
                            ]}>
                            {formatChatTimestamp(c?.created_at)}
                          </Text>
                        ) : (
                          <Text
                            style={[
                              gStyles.text(10, '400', '#797B8A'),
                              gStyles.textAlign('right'),
                            ]}>
                            loading
                          </Text>
                        )}
                      </View>
                    ) : null}
                  </View>
                )}
              </Animated.View>
            ))}
        </ScrollView>
        {chat?.is_finish_flag === 'Y' ? (
          <View style={styles.endedChatWrapper}>
            <Text style={gStyles.text(12, '400', '#797B8A')}>
              Chat ini telah berakhir.
            </Text>
          </View>
        ) : chatWithBot === false ? (
          <View
            style={[
              styles.chatInput,
              {
                backgroundColor: theme.backgroundColor,
              },
            ]}>
            <View style={[gStyles.row_center3]}>
              <TextInput
                placeholder="Tulis pesan Anda"
                name="pesan"
                placeholderTextColor={'#687083'}
                autoCorrect={false}
                onChangeText={value => dispatch(setChatMessage(value))}
                // defaultValue={chatMessage}
                value={chatMessage}
                textAlignVertical="top"
                multiline={true}
                blurOnSubmit={true}
                style={[gStyles.chatField, {color: 'black', flex: 1}]}
                returnKeyType="send"
                onSubmitEditing={value => {
                  handleSubmitMessage(chatHistory, value);
                  dispatch(setChatMessage(''));
                }}
              />
              {chatMessage?.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    handleSubmitMessage(chatHistory, chatMessage);
                    dispatch(setChatMessage(''));
                  }}>
                  <Text>Kirim</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity
                style={gStyles.rowWithoutJustify}
                onPress={() => openPanel('Upload File')}>
                <IconDocumentUpload fill="#5C73BD" width={20} height={20} />
                <Text
                  style={[
                    gStyles.text(14, '500', '#5C73BD'),
                    gStyles.marginLeft(4),
                  ]}>
                  Upload file
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[gStyles.rowWithoutJustify, gStyles.marginLeft(12)]}
                onPress={() => openPanel('Lampirkan Penawaran')}>
                <IconDocumentText fill="#5C73BD" width={20} height={20} />
                <Text
                  style={[
                    gStyles.text(14, '500', '#5C73BD'),
                    gStyles.marginLeft(4),
                  ]}>
                  Penawaran
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.botOptionsWrapper,
              {
                // flex: 1,
                opacity: fadeAnimBot,
                backgroundColor: theme.backgroundColor,
              },
            ]}>
            {chatWithBot === true &&
              chatBotOptions?.map((bot, i) => (
                <TouchableOpacity
                  onPress={() => bot.onPress(chatHistory)}
                  key={i}
                  style={[
                    styles.botOptions,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor:
                        i === chatBotOptions.length - 1 ? '#fff' : '#EBF0FF',
                      borderWidth: i === chatBotOptions.length - 1 ? 1 : 0,
                      borderColor:
                        i === chatBotOptions.length - 1 ? '#829BDE' : '#fff',
                    },
                  ]}>
                  {i === chatBotOptions.length - 1 ? (
                    <IconUserOcatgon
                      fill="#5C73BD"
                      width={20}
                      height={20}
                      style={gStyles.marginRight(4)}
                    />
                  ) : null}

                  <Text style={gStyles.text(14, '500', '#5C73BD')}>
                    {bot.title}
                  </Text>
                </TouchableOpacity>
              ))}
          </Animated.View>
        )}
      </View>
    );
  },
);

export default RoomChatComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  senderWrapper: {
    display: 'flex',

    flex: 1,
    alignItems: 'flex-start',
  },
  senderTextWrapper: {
    padding: 8,
    borderRadius: 8,
    maxWidth: 313,
    borderWidth: 1,
    borderTopLeftRadius: 0,
    borderColor: '#E3E3E5',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  receiverWrapper: {
    display: 'flex',
    flex: 1,

    alignItems: 'flex-end',
  },
  receiverTextWrapper: {
    padding: 8,
    borderRadius: 8,
    borderBottomRightRadius: 0,
    // width: 280,
    backgroundColor: '#F5F6F7',
    marginBottom: 8,
  },
  chatInput: {
    borderTopWidth: 1,
    borderTopColor: '#E3E3E5',
    padding: 12,
  },
  botOptionsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingRight: 8,
  },
  botOptions: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  appBarRightContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
  },
  endedChatWrapper: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: '#F5F6F7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  // HTML Converter
  p: {
    color: '#313447',
    fontSize: 14,
    lineHeight: 20,
    margin: 0,
    padding: 0,
    height: 'auto',
  },
  b: {fontWeight: 700},
  ul: {
    color: '#313447',
    fontSize: 14,
    lineHeight: 0,
    margin: 0,
    padding: 0,
    height: 'auto',
  },
  li: {
    color: '#313447',
    fontSize: 14,
    lineHeight: 25,
  },
});
