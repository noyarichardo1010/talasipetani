import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  BottomPanel,
  BottomPanelModal,
  Container,
  EmptyList,
  EmptyStateUpdateHariIni,
  Input,
  LoadingAnimated,
} from '../../../../../components';
import {gStyles} from '../../../../../utils/styles';
import {
  BoxIcon,
  IconCloseCircle,
  IconRightArrow,
  IconSearch,
} from '../../../../../assets';
import KomoditiAdd from './komoditiAdd';
import {useDispatch} from 'react-redux';
import {setAlert, setMessage, setMessageType} from '../../../../../services';
import API, {getErrorResponse} from '../../../../../services/api';
import {ImageProduct} from '../../../../../components/atoms/Product';
import AlertPopUp from './AlertPopup';

const KomoditiList = ({
  setBottomPanelPopup,
  setSelectedKomoditi,
  KommoditiListData,
  SelectedKomoditi,
  editable,
  IsLoading,
  setIsLoading,
  SelectedKupon,
}) => {
  const [ShowDetail, setShowDetail] = useState({
    show: false,
    data: null,
    type: 'full',
  });
  const [KomoditiShowList, setKomoditiShowList] = useState(KommoditiListData);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('editable', editable);
    if (editable) {
      // console.log('SelectedKomoditi', SelectedKomoditi);
      // console.log('KomoditiShowList', KomoditiShowList);
      let select = KomoditiShowList.find(
        komo => komo.id === editable.commoditie_id,
      );
      // console.log('select', select);
      if (select) {
        showDetailKomoditi(select);
      }
    }
  }, []);

  const showDetailKomoditi = val => {
    setShowDetail({
      show: true,
      content: 'addCommoditie',
      data: val,
      type: 'full',
    });
    // if (SelectedKupon && val.can_use) {
    //   setShowDetail({
    //     show: true,
    //     data: val,
    //     type: 'full',
    //   });
    // } else {
    //   if (!SelectedKupon) {
    //     setShowDetail({
    //       show: true,
    //       content: 'addCommoditie',
    //       data: val,
    //       type: 'full',
    //     });
    //   } else {
    //     setShowDetail({
    //       show: true,
    //       content: 'invalidCommoditie',
    //     });
    //   }
    // }
  };

  useEffect(() => {
    const backAction = () => {
      handleClosePanel();
      console.log('CLicked');
      // setIsLoading(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleClosePanel = () => {
    setBottomPanelPopup({show: false});
    setShowDetail({show: false});
  };

  useEffect(() => {
    console.log('SelectedKupon di list komoditi', SelectedKupon);
    console.log('KommoditiListData', KommoditiListData);

    if (SelectedKupon?.commoditie_detail) {
      const komoditiKupon = SelectedKupon.commoditie_detail;
      let result = KommoditiListData?.map(x => {
        //nanti ganti pake id, jika idnya udah sama
        let data = komoditiKupon.filter(
          f => f.commoditie_name === x.name && f.commoditie_id === x.id,
        );
        // console.log('data', data);
        return data[0] ? {...x, can_use: true} : x;
      });
      setKomoditiShowList(result);
      console.log('result', result);
    }
  }, [SelectedKupon, KommoditiListData]);
  //jika sudah menerapkan kupon harga khusu
  const handleAlertKomoditiCantUse = () => {};
  const handleSearch = text => {
    console.log('text', text);
    if (text && KommoditiListData.length > 0) {
      let fill = KommoditiListData.filter(data => {
        const itemName = data.name ? data.name.toLowerCase() : '';
        const textName = text.toLowerCase();

        return itemName.indexOf(textName) > -1;
        // if(itemName)
      });
      console.log('fill', fill);

      setKomoditiShowList(fill);
    } else {
      setKomoditiShowList(KommoditiListData);
    }
  };
  // console.log('KommoditiListData', KommoditiListData);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <LoadingAnimated visible={IsLoading} /> */}
      <View style={[gStyles.contentHeader, gStyles.shadowTitle]}>
        <TouchableOpacity onPress={() => setBottomPanelPopup({show: false})}>
          <IconCloseCircle fill={'#9AA2B1'} width={24} height={24} />
        </TouchableOpacity>
        <Input
          style={{marginLeft: 8, width: '92%', height: 40}}
          placeholder={'Cari komoditi'}
          onChangeText={val => handleSearch(val)}
        />
        <TouchableOpacity style={{position: 'absolute', right: 30}}>
          <IconSearch fill={'#CBCCD1'} width={20} height={20} />
        </TouchableOpacity>
      </View>
      <Container style={{padding: 8}}>
        {KomoditiShowList ? (
          KomoditiShowList?.map((val, i) => (
            <TouchableOpacity
              onPress={() => showDetailKomoditi(val)}
              key={i}
              style={[
                gStyles.row_center2,
                {
                  borderBottomColor: '#E3E3E5',
                  borderBottomWidth: 1,
                  margin: 12,
                  marginTop: 0,
                  padding: 10,
                  paddingBottom: 15,
                  // backgroundColor: '#E3E3E5',
                },
              ]}>
              <View style={gStyles.row_center}>
                <View style={[gStyles.boxIcon, {marginRight: 12}]}>
                  {/* <BoxIcon width={35} height={35} /> */}
                  <ImageProduct
                    url={val?.commoditie_photo}
                    style={[
                      gStyles.dimension('100%', '100%'),
                      {borderRadius: 40},
                    ]}
                  />
                </View>
                <View style={{width: '90%', paddingLeft: 12, paddingRight: 12}}>
                  {/* {val?.can_use === true ? null : SelectedKupon ===
                    null ? null : (
                    <Text style={gStyles.text(9, '500', 'red')}>
                      Tidak bisa memilih ini
                    </Text>
                  )} */}
                  <Text style={gStyles.text(14, '500', '#313447')}>
                    {val.name}
                  </Text>
                  {val.commoditie_varians?.length > 0 ? (
                    <Text
                      style={gStyles.text(
                        12,
                        '400',
                        '#93959E',
                      )}>{`${val.commoditie_varians?.length} Varian`}</Text>
                  ) : null}
                </View>
              </View>
              <IconRightArrow fill={'#93959E'} width={15} height={15} />
            </TouchableOpacity>
          ))
        ) : (
          <EmptyList
            title="Ganti warehouse"
            desc="Tidak ada komoditi di warehouse ini"
            type="full"
          />
        )}
      </Container>
      {ShowDetail.show && (
        <BottomPanelModal
          radius={12}
          height={ShowDetail.type === 'full' ? '100%' : 'auto'}
          withHeader={
            ShowDetail.content === 'invalidCommoditie' ||
            ShowDetail.content === 'changeKomoditi'
              ? false
              : true
          }
          showCloseBtn
          title={editable ? 'Ubah Komoditi' : 'Tambah Komoditi'}
          styleCustom={{zIndex: 5}}
          closePanel={() => handleClosePanel()}
          shadowTitle
          content={
            ShowDetail.content === 'invalidCommoditie' ? (
              <AlertPopUp
                setBottomPanelPopup={setShowDetail}
                BottomPanelPopup={ShowDetail}
              />
            ) : (
              <KomoditiAdd
                data={ShowDetail?.data}
                closePanel={() => handleClosePanel()}
                setSelectedKomoditi={setSelectedKomoditi}
                SelectedKomoditi={SelectedKomoditi}
                setShowDetail={setShowDetail}
                editable={editable}
                IsLoading={IsLoading}
                setIsLoading={setIsLoading}
                SelectedKupon={SelectedKupon}
              />
            )
          }
        />
      )}
    </View>
  );
};

export default KomoditiList;
