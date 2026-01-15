import {
  StyleSheet,
  Alert,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Keyboard,
  Modal,
  TextInput,
  Image,
  Animated,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import RoomChatComponent from './components/RoomChatComponent';

import {Image as CompressImage} from 'react-native-compressor';
import DocumentPicker from '@react-native-documents/picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import API, {getErrorResponse} from '@services/api';

import {Box, IconClose, IconDocument, IconQuestionBold} from '@assets';

import {
  setAlert,
  setChatHistory,
  setLoading,
  setMessage,
  setMessageType,
} from '@services';
// import {
//   disconnectChat,
//   initiateChat,
//   sendAttachmentMessage,
//   sendMessage,
//   sendOfferMessage,
//   subscribeToChat,
//   subscribeToNewChat,
// } from '@helpers/chat';
import {
  disconnectChat,
  initiateChat,
  sendAttachmentMessage,
  sendMessage,
  sendOfferMessage,
  subscribeToChat,
  subscribeToNewChat,
} from '../../../utils/helpers/chat';

import axios from 'axios';
import {BASE_URL} from '@services/api/url';
import {
  BottomPanel,
  BottomPanelModal,
  CardTransaksi,
  Gap,
  LoadingScreen,
  ModalComponent,
  PickAttachment,
  statusQuery,
  Button,
} from '@components';
import {
  getOfferNumber,
  setAlertType,
  setPage,
  setSelectedKupon,
} from '../../../services';
import {gStyles} from '../../../utils/styles';
import {ImageProduct} from '../../../components/atoms/Product';
// import {useInitializeAgora} from '../../../utils/hooks/useAgora';

const HargaKhusus = React.memo(({data, navigation, onPress}) => {
  const [detail, setDetail] = useState(null);
  const dispatch = useDispatch();

  const pilihKupon = async kupon => {
    await dispatch(getOfferNumber())
      .then(res => {
        console.log('res handleBuatPenawaran', res);
        dispatch(setSelectedKupon(kupon));

        if (res.success) {
          navigation.navigate('BuatPenawaran');
        } else if (res.message) {
          Alert.alert(res.message);
        } else {
          // cancel();
        }
      })
      .catch(err => {
        console.log('err', err);
        Alert.alert(err?.message);
      });
  };
  // Komponen ini hanya akan dirender jika 'data' berubah
  useEffect(() => {
    if (data?.sentBy !== 'Bot' && data?.coupon_id) {
      API.get(`farmer/offer/special-price/${data?.coupon_id}`)
        .then(res => {
          console.log('res detail harga khusus', res);
          // if (res?.meta?.http_status === 200) {
          // setFaqs(res.data.faqs);
          setDetail(res.data);
          // }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  return (
    <View
      style={{
        display: 'flex',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E3E3E5',
        padding: 12,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 12,
          borderBottomColor: '#E3E3E5',
          borderBottomWidth: 1,
        }}>
        <Text style={gStyles.text(14, '500', '#313447')}>
          {detail?.coupon_code}
        </Text>
        <Text
          style={[
            gStyles.text(12, '500', '#313447'),
            {
              backgroundColor: '#F5F6F7',
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 40,
            },
          ]}>
          {detail?.status}
        </Text>
      </View>

      <ScrollView
        style={{display: 'flex', marginVertical: 12}}
        showsHorizontalScrollIndicator={false}
        horizontal>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: '#E3E3E5',
            borderBottomWidth: 1,
            paddingBottom: 12,
          }}>
          {detail?.commoditie_detail?.map((kmdt, i) => (
            <View style={styles.cardBodyWrapper} key={i}>
              <View style={styles.boxWrapper}>
                {/* <Image source={Box} style={gStyles.dimension(32, 32)} /> */}
                <ImageProduct
                  url={kmdt?.commoditie_photo}
                  style={[
                    gStyles.dimension('100%', '100%'),
                    {borderRadius: 40},
                  ]}
                />
              </View>
              <View style={styles.cardBodyContent}>
                <Text style={gStyles.text(14, '500', '#313447')}>
                  {kmdt.commoditie_name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={gStyles.row}>
        <Button
          title="Detail"
          onPress={() => {
            //get primary bank of users
            navigation.navigate('KuponDetail', {
              data: detail,
              pilihKupon: pilihKupon,
              wording: 'Pakai',
            });
          }}
          type="outline"
          style={gStyles.btnOutlinePrimary}
          textStyle={gStyles.btnOutlinePrimaryText}
          paddingVertical={8}
        />
        <Button
          title="Pakai"
          onPress={onPress}
          type="full"
          style={gStyles.btnPrimary}
          textStyle={gStyles.btnPrimaryText}
          paddingVertical={8}
        />
      </View>
    </View>
  );
});

const Penawaran = React.memo(({data, navigation}) => {
  // Komponen ini hanya akan dirender jika 'data' berubah
  // console.log('penawaran ', data);
  const [detail, setDetail] = useState(null);
  // Komponen ini hanya akan dirender jika 'data' berubah
  useEffect(() => {
    API.get(`offer/${data?.offer_id}`)
      .then(res => {
        console.log('res detail offer', res);
        if (res?.meta?.http_status === 200) {
          // setFaqs(res.data.faqs);
          setDetail(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const onPress = () => {
    navigation.navigate('DetailTransaksi', detail);
  };
  return (
    <CardTransaksi
      no={detail?.offer_number}
      date={detail?.offer_date}
      totalPrice={detail?.total_price_offer}
      products={detail?.offer_commodities}
      status={detail?.status}
      onPress={onPress}
    />
  );
});

const RoomChat = ({navigation, route}) => {
  const {theme, chatMessage, chatHistory, userInfo, token} = useSelector(
    reducer => reducer.global,
  );
  const dispatch = useDispatch();
  const {chat} = route.params;
  const [data, setData] = useState(chat);
  // console.log('userInfo', userInfo);
  // console.log('data', data);
  const [type, setType] = useState(
    data?.is_finish_flag === 'Y' && data?.is_active_flag === 'Y'
      ? 'history'
      : data?.is_finish_flag === 'Y' || data?.is_active_flag === 'Y'
      ? 'chat'
      : null,
  );
  const [BottomPanelPopup, setBottomPanelPopup] = useState({
    show: false,
    data: null,
    title: '',
    type: '',
  });
  const [singleFile, setSingleFile] = useState(null);
  const [chatWithBot, setChatWithBot] = useState(true);
  const [panelFor, setPanelFor] = useState('');
  const [chooseFromWhere, setChooseFromWhere] = useState(null);
  const [waitingAdmin, setWaitingAdmin] = useState(false);
  const [image, setImage] = useState('');
  const [attachment, setAttachment] = useState(null);

  const [attachmentText, setAttachmentText] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [history, setHistory] = useState([]);
  const [newChat, setNewChat] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [fadeAnimBot] = useState(new Animated.Value(0));

  const initialChatBot = [
    {
      title: 'Lupa Kata Sandi',
      onPress: prevChat => sendChat(prevChat, 'Lupa Kata Sandi', true),
      isSent: false,
    },
    {
      title: 'Cara tambah nomor handphone',
      onPress: prevChat =>
        sendChat(prevChat, 'Cara tambah nomor handphone', true),
      isSent: false,
    },
    {
      title: 'Cara tambah rekening bank',
      onPress: prevChat =>
        sendChat(prevChat, 'Cara tambah rekening bank', true),
      isSent: false,
    },
    {
      title: 'Lainnya',
      onPress: prevChat => Alert.alert('lainnya'),
      isSent: false,
    },
    {
      title: 'Chat dengan Admin Talasi',
      onPress: prevChat => chatDenganAdminTalasi(prevChat),
      isSent: false,
    },
  ];

  const scrollViewRef = useRef();

  // Fungsi untuk menggulir ke bawah
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  const getDetailChat = () => {
    API.get(`farmer/chat/${data?.id}`)
      .then(res => {
        console.log('res get detail chat', res);
        setChatWithBot(false);

        dispatch(setChatHistory(res?.data?.chat_message?.message_data)); //uncomment ini jika mau melihat roomchat yang ada riwayatnya atau tidak
      })
      .catch(err => {
        console.log('err get detail chat', err);
      });
  };
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: false, // Set this to 'true' for better performance on supported devices
    }).start();

    Animated.timing(fadeAnimBot, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: false, // Set this to 'true' for better performance on supported devices
    }).start();
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (type) {
      if (type === 'chat') {
        setChatWithBot(false);
        // getDetailChat();
        // console.log('dataaaa', data);
        initiateChat(data?.id, userInfo?.name, data?.user_id_farmer);
        subscribeToChat(setHistory);
        subscribeToNewChat(setNewChat);
      } else if (type === 'history') {
        // console.log('chat', data);
        getDetailChat();
      }
    } else {
      getListPusatBantuan('', pageFAQ);
    }
    return () => {
      disconnectChat();
    };
  }, [type]);

  useEffect(() => {
    console.log('history', history);
    // setData({...data, ...history?.chat_room});
    dispatch(setChatHistory(history?.message)); //uncomment ini jika mau melihat roomchat yang ada riwayatnya atau tidak
  }, [history]);

  const chatDenganAdminTalasi = prevChat => {
    setWaitingAdmin(true);
    setChatWithBot(false);
    // console.log('data', data);
  };

  useEffect(() => {
    if (waitingAdmin) {
      dispatch(setLoading(true));

      API.get('farmer/chat/create-room')
        .then(res => {
          console.log('res create chat room', res);
          if (res?.meta?.http_status === 200) {
            setWaitingAdmin(false);
            setData(res.data);
            setType(
              res.data?.is_finish_flag === 'Y' &&
                res.data?.is_active_flag === 'Y'
                ? 'history'
                : res.data?.is_finish_flag === 'Y' ||
                  res.data?.is_active_flag === 'Y'
                ? 'chat'
                : null,
            );

            // initiateChat(data?.id, userInfo?.name, userInfo?.id);
            // subscribeToChat();
            // subscribeToNewChat();
            dispatch(setLoading(false));
          } else {
            const errMessage =
              getErrorResponse(res?.response?.data?.errors) ||
              res?.response?.data?.message ||
              res?.message;
            console.log('errMessage', errMessage);
            setWaitingAdmin(false);
            dispatch(setMessage(errMessage));
            dispatch(setMessageType('error'));
            dispatch(setAlertType('top'));
            dispatch(setLoading(false));
            dispatch(setAlert(true));
          }
        })
        .catch(err => {
          console.log('err create chat room', err);
          const errMessage =
            getErrorResponse(err?.response?.data?.errors) ||
            err?.response?.data?.message;
          console.log('errMessage', errMessage);

          dispatch(setMessage(errMessage));
          dispatch(setMessageType('error'));
          dispatch(setAlertType('top'));
          setWaitingAdmin(false);
          dispatch(setLoading(false));
          dispatch(setAlert(true));
        });
    }
  }, [waitingAdmin]);

  const [chatBotOptions, setChatBotOptions] = useState(initialChatBot);
  const initialChatHistory = [
    {
      id: 1,
      user_id: 0,
      sentBy: 'Bot',
      contentType: 'text',
      name: '',
      message: 'Halo, ada yang bisa kami bantu?',
      created_at: new Date(),
      files: null,
    },
  ];
  useEffect(() => {
    // user_id: userInfo?.id,
    //     id: userInfo?.id,
    //     sentBy: userInfo?.name,
    //     message: chat,
    //     chatBotOption: chat,
    //     name: userInfo?.name,
    //     content: chat,
    //     files: files,

    dispatch(setChatHistory(initialChatHistory));
    const faqList = faqs.map(faq => ({
      ...faq,
      title: faq.question,
      onPress: prevChat => sendChat(prevChat, faq.question, true),
      isSent: false,
    }));
    if (pageFAQ > 1) {
      faqList.push({
        title: 'Sebelumnya',
        onPress: () => changePageFAQ(false),
        isSent: false,
      });
    }
    if (pageFAQ !== lastPageFAQ) {
      faqList.push({
        title: 'Lainnya',
        onPress: () => changePageFAQ(true),
        isSent: false,
      });
    }
    faqList.push({
      title: 'Chat dengan Admin Talasi',
      onPress: prevChat => chatDenganAdminTalasi(prevChat),
      isSent: false,
    });
    setChatBotOptions(faqList);
    console.log('faqs', faqs);
  }, [faqs]);

  const backHandle = () => {
    navigation.goBack();
  };
  useEffect(() => {
    const backAction = () => {
      backHandle();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  const lupaKataSandi = [
    {
      id: 1,
      sentBy: 'sender',
      contentType: 'text',
      name: '',
      content: (
        <Text style={gStyles.text(14, '400', theme.textColor)}>
          Berikut halaman yang bisa membantu masalah Anda
        </Text>
      ),
    },
    {
      id: 1,
      sentBy: 'sender',
      contentType: 'component',
      name: '',
      content: (
        <View
          style={{
            display: 'flex',
            padding: 12,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            borderRadius: 8,
            backgroundColor: '#2A378E',
            marginBottom: 8,
            width: 313,
          }}>
          <View style={gStyles.flexCenter('row')}>
            <IconQuestionBold fill="#EBF0FF" width={16} height={16} />
            <Text
              style={[
                gStyles.text(12, '500', '#EBF0FF'),
                gStyles.marginLeft(4),
              ]}>
              Pusat Bantuan
            </Text>
          </View>
          <Text
            style={[
              gStyles.text(16, '700', '#fff'),
              gStyles.dimension(280, 40),
            ]}>
            Cara memulihkan kata sandi yang lupa
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderRadius: 4,
              alignSelf: 'stretch',
              alignItems: 'center',
              borderColor: '#2E3192',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderWidth: 1,
              marginTop: 16,
            }}>
            <Text style={gStyles.text(12, '500', '#2E3192')}>
              Lihat Selengkapnya
            </Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      id: 1,
      sentBy: 'sender',
      contentType: 'text',
      name: '',
      content: (
        <Text style={gStyles.text(14, '400', theme.textColor)}>
          Ada lagi yang bisa kami bantu?
        </Text>
      ),
    },
  ];

  useEffect(() => {
    console.log('chatHistory useEffect', chatHistory);
    if (chatHistory) {
      // //cek apakah di chatHistory ada mengandung title chatBotOptions, kalo ada, hilangkan di chatBotOptions
      const updatedChatBotOptions = chatBotOptions?.filter(bot => {
        return !chatHistory?.some(chat => chat?.chatBotOption === bot.title);
      });
      // console.log('updatedChatBotOptions', updatedChatBotOptions);
      setChatBotOptions(updatedChatBotOptions);
    }
  }, [chatHistory]);

  const [isModalPreviewVisible, setModalPreviewVisible] = useState(false);

  // Fungsi untuk membuka dan menutup modal
  const toggleModalPreview = () => {
    setModalPreviewVisible(!isModalPreviewVisible);
  };

  // useEffect(() => {
  //   if (image !== '' && image !== null) {
  //     // console.log('image', image);
  //     dispatch(setLoading(true));

  //     toggleModalPreview();
  //     // addAttachment(image);
  //   }
  // }, [image]);

  // useEffect(() => {
  //   if (singleFile !== '' && singleFile !== null) {
  //     console.log('singleFile', singleFile);
  //     dispatch(setLoading(true));

  //     toggleModalPreview();
  //   }
  // }, [singleFile]);

  useEffect(() => {
    if (attachment !== '' && attachment !== null) {
      console.log('attachment', attachment);
      // dispatch(setLoading(true));

      toggleModalPreview();
    }
  }, [attachment]);

  const addAttachment = useCallback(
    (prevChat, newFile, text) => {
      // dispatch(setLoading(true));
      sendChat(prevChat, text, false, [{...newFile, file_url: newFile?.uri}]);
      const field = new FormData();
      field.append('file', newFile);
      field.append('category', 'chat-files');
      axios
        .post(`${BASE_URL}/utility/upload-file`, field, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          console.log('resUpload', res);

          scrollToBottom();
          const file = [
            {
              filename: attachment?.name ?? 'Kirim Foto',
              file_url: res.data.data,
            },
          ];
          sendAttachmentMessage(
            data?.id,
            userInfo?.name,
            text,
            file,
            userInfo?.farmer_profile?.user_id,
          );
          setAttachmentText('');

          // dispatch(setLoading(false));
        })
        .catch(err => {
          console.log('err upload', err);
          const errMessage = getErrorResponse(err?.response?.data);
          if (err?.response?.status === 413) {
            dispatch(setMessage('File terlalu besar'));
          } else {
            dispatch(setMessage(errMessage ?? 'Terjadi Kesalahan'));
          }
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));

          setImage(null);
          setSingleFile(null);
          // dispatch(setLoading(false));
        });
    },
    [data],
  );
  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      setBottomPanelPopup({
        ...BottomPanelPopup,
        show: false,
      });
      // setSingleFile(res[0]);
      setAttachment(res[0]);
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  useEffect(() => {
    // console.log('chooseFromWhere document : ', chooseFromWhere);
    setChooseFromWhere(false);

    if (chooseFromWhere === 'gallery') {
      ImageCropPicker.openPicker({
        options: {
          waitAnimationEnd: false,
          includeExif: true,
          includeBase64: true,
          forceJpg: true,
          compressImageMaxWidth: 640,
          compressImageMaxHeight: 480,
          compressImageQuality: 0.75,
          mediaType: 'any',
        },
      })
        .then(async response => {
          // console.log('response: ', response);
          const uri = response.sourceURL || response.path;
          // const newImageUri = 'file:///' + uri.split('file:/').join('');
          const newImageUri =
            Platform.OS === 'ios' ? uri : 'file://' + response.path;
          // uri: Platform.OS === 'ios' ? uri.replace('file:///', '') : uri,
          const uriParts = uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
          let img = {
            name: response.filename || newImageUri.split('/').pop(),
            path: response.path,
            data: response.data,

            uri: newImageUri,
            type: `image/${fileType}`,
          };
          // const compressImage = await CompressImage.compress(img?.uri ?? uri, {
          //   //compress image
          //   compressionMethod: 'manual',
          //   quality: 0.5,
          // });
          setBottomPanelPopup({
            ...BottomPanelPopup,
            show: false,
          });

          // setImage({
          //   name: img.name,
          //   uri: compressImage,
          //   type: img.type,
          // });
          setAttachment({
            name: img.name,
            uri: img.uri,
            type: img.type,
          });
        })
        .catch(e => console.log('Error : ', e.message));
    } else if (chooseFromWhere === 'document') {
      // Opening Document Picker to select one file
      selectFile();
    } else if (chooseFromWhere === 'camera') {
      navigation.navigate('CameraDocument', {
        setChooseFromWhere,
        setImage,
      });
      setBottomPanelPopup({
        show: false,
        data: {},
        title: 'Pilih Dari',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chooseFromWhere]);

  const renderChatBot = useCallback(
    (prevChat, option) => {
      console.log('prevChat', prevChat);
      console.log('option', option);

      faqs.map(faq => {
        console.log('faq', faq);
        const msg = {
          user_id: 0,
          id: 0,
          sentBy: 'Bot',
          message: faq.answer,
          name: 'Bot',
          created_at: new Date(),
        };

        switch (option) {
          case faq.question:
            console.log('faq.question', faq.question);

            setTimeout(() => dispatch(setChatHistory([...prevChat, msg])), 100);
            break;

          case 'Lupa Kata Sandi':
            dispatch(setChatHistory([...prevChat, ...lupaKataSandi]));
            break;

          default:
            break;
        }
      });
    },
    [faqs],
  );
  const sendChat = useCallback(
    (prevChat, chat, chatBot = false, files = null) => {
      // State may not be updated correctly here without dependencies
      // console.log('files', files);
      // console.log('userInfo', userInfo);
      const msg = {
        user_id: userInfo?.farmer_profile?.user_id,
        id: 0,
        sentBy: userInfo?.name,
        message: chat,
        chatBotOption: chat,
        name: userInfo?.name,
        content: chat,
        files: files,
        offer_id: 0,
        coupon_id: 0,
      };

      // console.log('prevChat', prevChat);
      // console.log('chatHistory', chatHistory);
      // console.log('chat', chat);
      // console.log('test');
      const updatedChat = [...prevChat, msg];
      // console.log('updatedChat', updatedChat);
      dispatch(setChatHistory(updatedChat));
      // console.log('chatHistory', chatHistory);
      if (chatBot) {
        msg.created_at = new Date();
        renderChatBot(updatedChat, chat, faqs);
      }
    },
    [faqs],
  );

  useEffect(() => {
    console.log('newChat', newChat);
    //  console.log('userInfo', userInfo);

    let updatedChat = [...chatHistory, newChat];
    updatedChat = updatedChat.filter(obj => obj?.created_at);
    console.log('updatedChat', updatedChat);
    dispatch(setChatHistory(updatedChat));
    scrollToBottom();
    let namaLawanChat = newChat?.message?.substr(0, newChat?.name?.length);

    if (newChat && namaLawanChat === newChat?.name) {
      console.log('namaLawanChat', namaLawanChat);
      setData({...data, sender_profile: {name: namaLawanChat}});
    }
  }, [newChat]);

  const openPanel = panel => {
    setBottomPanelPopup({
      show: true,
      data: {},
      title: panel,
      type: panel === 'Lampirkan Penawaran' ? 'full' : '',
    });

    setPanelFor(panel);
    Keyboard.dismiss();
  };
  const handleSubmitMessage = prevChat => {
    // Handle text submission here
    console.log('userInfo di submit message', userInfo);
    sendChat(prevChat, chatMessage);
    const message = {
      contentMessage: chatMessage,
      offerId: 0,
      couponId: 0,
    };
    sendMessage(
      data?.id,
      userInfo?.name,
      message,
      userInfo?.farmer_profile?.user_id,
    );
    scrollToBottom();
    // Keyboard.dismiss();
    // Reset text input
  };
  const [pageFAQ, setPageFAQ] = useState(1);
  const [lastPageFAQ, setLastPageFAQ] = useState(1);
  const changePageFAQ = isNext => {
    console.log('isNext', isNext);
    if (isNext) {
      setPageFAQ(pageFAQ + 1);
    } else {
      setPageFAQ(pageFAQ - 1);
    }
  };

  useEffect(() => {
    console.log('pageFAQ', pageFAQ);
    getListPusatBantuan('', pageFAQ);
  }, [pageFAQ]);

  const getListPusatBantuan = (search = '', page = 1) => {
    dispatch(setLoading(true));
    // console.log('getListPusatBantuan', search);
    API.get(
      `master/faq?page=${page}&limit=3&sort=order_number&search=${search}`,
    )
      .then(res => {
        console.log('res list pusat bantuan', res);
        if (res?.meta?.http_status === 200) {
          setFaqs(res.data.faqs);
          setLastPageFAQ(res.meta.last_page);
        } else {
          console.log(
            'res?.response?.data?.errors',
            res?.response?.data?.errors,
          );
          const errMessage = getErrorResponse(res?.response?.data?.errors);
          // console.log('err response', errMessage);
          dispatch(setMessage(errMessage));
          dispatch(setMessageType('error'));
          dispatch(setAlert(true));
        }
        dispatch(setLoading(false));
      })
      .catch(err => {
        console.log(err);
        dispatch(setLoading(false));
      });
  };
  const [clickedKupon, setClickedKupon] = useState(null);
  const handleClikPakaiKupon = c => {
    dispatch(setLoading(true));
    API.get(`farmer/offer/special-price/${c?.coupon_id}`)
      .then(res => {
        console.log('res detail harga khusus', res);
        // if (res?.meta?.http_status === 200) {
        // setFaqs(res.data.faqs);
        // setDetail(res.data);
        setPanelFor('Kupon');
        setClickedKupon(res.data);
        setBottomPanelPopup({...BottomPanelPopup, show: true});
        dispatch(setLoading(false));
        // }
      })
      .catch(err => {
        dispatch(setLoading(false));
        console.log(err);
      });
  };
  const _renderHargaKhususAtauPenawaran = useCallback(
    c => {
      // console.log('chatttt', c);
      if (c?.sentBy !== 'Bot') {
        if (c?.coupon_id && c?.coupon_id !== 0 && c?.files === null) {
          //get harga khusus
          return (
            <HargaKhusus
              data={c}
              navigation={navigation}
              onPress={() => handleClikPakaiKupon(c)}
            />
          );
        } else if (c?.offer_id && c?.offer_id !== 0 && c?.files === null) {
          //get penawaran
          return <Penawaran data={c} navigation={navigation} />;
        } else {
          <Text style={gStyles.text(13, '400', '#313447')}>loading...</Text>;
        }
      } else {
        <Text style={gStyles.text(13, '400', '#313447')}>loading...</Text>;
      }
    },
    [chatHistory],
  );

  const cancelCall = () => {
    setBottomPanelPopup({show: false});
  };
  const handleCall = async () => {
    navigation.navigate('Panggilan', {
      data: {...data?.sender_profile, chat_room_id: data?.id}, //ini harus ngirim id, tapi sender_profilenya gada id kalo belum back
      cancel: cancelCall,
    });
  };

  const cancel = () => {
    setBottomPanelPopup({show: false});
  };
  const pakaiKupon = async () => {
    await dispatch(getOfferNumber())
      .then(res => {
        console.log('res handleBuatPenawaran', res);
        dispatch(setSelectedKupon(clickedKupon));

        if (res.success) {
          navigation.navigate('BuatPenawaran');
        } else if (res.message) {
          Alert.alert(res.message);
        } else {
          cancel();
        }
      })
      .catch(err => {
        console.log('err', err);
        Alert.alert(err?.message);
      });
  };

  return waitingAdmin === false ? (
    <>
      <Modal
        visible={isModalPreviewVisible}
        transparent={true}
        onRequestClose={toggleModalPreview}>
        <View style={styles.modalContainer}>
          {/* <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleModalPreview}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity> */}
          {attachment?.type === 'image' ||
          attachment?.type === 'image/png' ||
          attachment?.type === 'image/jpg' ||
          attachment?.type === 'image/jpeg' ? (
            <View style={styles.imageModalWrapper}>
              <TouchableOpacity
                onPress={toggleModalPreview}
                style={styles.imageModalClose}>
                <IconClose fill="red" width={15} height={15} />
              </TouchableOpacity>

              <Image
                source={{uri: attachment?.uri}}
                style={styles.previewImage}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.docModalWrapper}>
              <TouchableOpacity
                onPress={toggleModalPreview}
                style={styles.docModalClose}>
                <IconClose fill="red" width={15} height={15} />
              </TouchableOpacity>
              <IconDocument fill="#fff" width={55} height={55} />
              <Text
                style={[
                  gStyles.text(14, '400', '#313447'),
                  gStyles.textAlign('center'),
                  gStyles.marginTop(15),
                ]}>
                {attachment?.name}
              </Text>
            </View>
          )}
          {
            // kalo tidak ada name, berarti diklik dari chat, bukan ambil dari gallery
            attachment?.name ? (
              <View
                style={[
                  gStyles.row_center3,
                  {position: 'absolute', bottom: 0, backgroundColor: 'white'},
                ]}>
                <TextInput
                  placeholder="Tulis pesan Anda"
                  name="pesan"
                  placeholderTextColor={'#687083'}
                  autoCorrect={false}
                  onChangeText={value => setAttachmentText(value)}
                  value={attachmentText}
                  textAlignVertical="top"
                  multiline={true}
                  blurOnSubmit={true}
                  style={[gStyles.chatField, {color: 'black', flex: 1}]}
                  returnKeyType="send"
                  onSubmitEditing={value => {
                    addAttachment(chatHistory, attachment, attachmentText);
                    toggleModalPreview();
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    addAttachment(chatHistory, attachment, attachmentText);
                    toggleModalPreview();
                  }}>
                  <Text
                    style={[
                      gStyles.text(14, '500', '#2E3192'),
                      gStyles.marginRight(20),
                    ]}>
                    Kirim
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        </View>
      </Modal>
      <RoomChatComponent
        theme={theme}
        navigation={navigation}
        route={route}
        chat={data}
        chatMessage={chatMessage}
        chatHistory={chatHistory}
        dispatch={dispatch}
        chatBotOptions={chatBotOptions}
        chatWithBot={chatWithBot}
        setChatWithBot={setChatWithBot}
        openPanel={openPanel}
        userInfo={userInfo}
        singleFile={singleFile}
        handleSubmitMessage={handleSubmitMessage}
        scrollViewRef={scrollViewRef}
        setAttachment={setAttachment}
        _renderHargaKhususAtauPenawaran={_renderHargaKhususAtauPenawaran}
        fadeAnim={fadeAnim}
        fadeAnimBot={fadeAnimBot}
      />

      {BottomPanelPopup.show && (
        <BottomPanel
          radius={12}
          clickOutsideToClosePanel
          height={BottomPanelPopup.type === 'full' ? '100%' : 'auto'}
          withHeader={
            panelFor === 'Call' || panelFor === 'Kupon' ? false : true
          }
          showCloseBtn
          animate
          positionAnimatePop={BottomPanelPopup.type === 'full' ? -1000 : -200}
          durationPop={BottomPanelPopup.type === 'full' ? 800 : 300}
          title={BottomPanelPopup.title}
          closePanel={() => setBottomPanelPopup({show: false})}
          content={
            panelFor === 'Upload File' ? (
              <PickAttachment
                closePanel={() => setBottomPanelPopup({show: false})}
                setChooseFromWhere={setChooseFromWhere}
              />
            ) : panelFor === 'Call' ? (
              <ModalComponent
                handleSubmit={handleCall}
                cancel={cancelCall}
                title="Telepon Admin Talasi?"
                desc="Operator Anda mungkin mengenakan biaya untuk panggilan telepon ini."
                textBtnSubmit="Iya"
                textBtnCancel="Tidak"
              />
            ) : panelFor === 'Kupon' ? (
              <ModalComponent
                handleSubmit={pakaiKupon}
                cancel={cancel}
                title="Pakai Harga Khusus Untuk Penawaran Baru?"
                desc="Harga Khusus ini hanya bisa digunakan untuk Penawaran Baru."
                textBtnSubmit="Iya"
                textBtnCancel="Tidak"
              />
            ) : (
              <ListPenawaran
                room={data}
                userInfo={userInfo}
                closePanel={() => setBottomPanelPopup({show: false})}
              />
            )
          }
        />
      )}
    </>
  ) : (
    <LoadingScreen
      title="Harap Tunggu Sebentar"
      desc="Anda akan segera terhubung dengan Admin kami."
    />
  );
};

export default RoomChat;

const styles = StyleSheet.create({
  //image style
  thumbnail: {
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  imageModalWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fff',
    flex: 0.3,

    // borderWidth: 2,
    width: '80%',
  },
  imageModalClose: {
    display: 'flex',
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 40,
    position: 'absolute',
    top: -10,
    right: -10,
  },
  docModalWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    flex: 0.3,
    borderRadius: 15,
    padding: 20,
    paddingVertical: 30,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
  },
  docModalClose: {
    display: 'flex',

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 40,
    position: 'absolute',
    top: -10,
    right: -10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  cardBody: {
    display: 'flex',
    marginVertical: 12,
  },
  cardBodyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 16,
  },
  boxWrapper: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: '#F5F6F7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardBodyContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});

const ListPenawaran = React.memo(({room, userInfo, closePanel}) => {
  const [list, setList] = useState(null);
  const [Params, setParams] = useState({
    page: 1,
    limit: 999999,
    status: statusQuery(),
  });

  useEffect(() => {
    loadListTransaksi();
  }, []);

  const loadListTransaksi = () => {
    const page = Params.page ? '&page=' + Params.page : '';
    const limit = Params.limit ? '&limit=' + Params.limit : '';
    // const status = Params.status ? '&status=' + Params.status : '';
    const status = '&status=Penawaran Baru,Baru,Survey,Verifikasi,Persetujuan,Disetujui,PO Selesai,PR Selesai,Persiapan,Pengiriman,Diterima,Penerimaan,Selesai Terima,Siap Bayar';

    // let type = index === 0 ? 'active' : 'finish';
    API.get(`farmer/offer/list?${page}${limit}${status}&sort=created_at-`)
      .then(res => {
        console.log('res get penawaran', res);
        if (res?.meta?.http_status === 200) {
          setList(res.data.offers);
        }
      })
      .catch(err => {
        console.log('err get list transaksi', err);
      });
  };

  const onPress = offer_id => {
    sendOfferMessage(
      room?.id,
      userInfo?.name,
      offer_id,
      userInfo?.farmer_profile?.user_id,
    );
    closePanel();
  };

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: '#fff',
        },
      ]}>
      <ScrollView
        style={{
          padding: 16,
        }}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        {list?.map((penawaran, i) => (
          <CardTransaksi
            key={i}
            no={penawaran.offer_number}
            date={penawaran.offer_date}
            totalPrice={penawaran.total_price_offer}
            products={penawaran.offer_commodities}
            status={penawaran.status}
            onPress={() => onPress(penawaran.id)}
          />
        ))}
      </ScrollView>
      <Gap height={16} />
    </View>
  );
});
