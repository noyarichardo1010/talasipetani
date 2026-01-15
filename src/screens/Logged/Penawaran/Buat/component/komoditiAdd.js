import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styles from '../../styles';
import {gStyles} from '../../../../../utils/styles';
import {
  Button,
  Container,
  Dropdown,
  Input,
  RadioButtons,
  GradeItem,
  Select,
  LoadingAnimated,
  BottomPanelModal,
} from '../../../../../components';
// import { ScrollView } from 'react-native-gesture-handler';
import API, {getErrorResponse} from '../../../../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAlert,
  setMessage,
  setMessageType,
  _handleAlertMessage,
  setSelectedKupon,
} from '../../../../../services';
import {delimiterFormat} from '../../../../../utils/helpers/number';
import {ImageProduct} from '../../../../../components/atoms/Product';
import {getGradeStyle} from '../../../../../utils/helpers/text';
import DecimalInput from '../../../../../components/atoms/Form/DecimalInput';
import {assignBooleanValue} from '../../../../../utils/helpers/array';
import AlertPopUp from './AlertPopup';

const KomoditiAdd = ({
  data,
  closePanel,
  setSelectedKomoditi,
  setShowDetail,
  editable = false,
  SelectedKomoditi,
  IsLoading,
  setIsLoading,
  SelectedKupon,
}) => {
  const {alert, message, messageType} = useSelector(reducer => reducer.global);
  const [ShowAll, setShowAll] = useState(false);
  const [showFieldNewVariant, setShowFieldNewVariant] = useState(false);
  const [Submit, setSubmit] = useState(true);
  const [detail, setDetail] = useState(data);
  const dispatch = useDispatch();
  const [Note, setNote] = useState('');
  const [Quantity, setQuantity] = useState(0);
  const [displayValue, setDisplayValue] = useState('');
  const [farmerPrice, setFarmerPrice] = useState(0);
  const [displayValueFarmerPrice, setDisplayValueFarmerPrice] = useState('');
  const [dataEdit, setDataEdit] = useState(editable);
  const [SubTotal, setSubTotal] = useState(0);
  const [variants, setVariants] = useState([]);
  const [SelectedGrade, setSelectedGrade] = useState(null);
  const [gradesList, setGradesList] = useState([]);
  const [variantId, setVariantId] = useState(false);

  const [variantName, setVariantName] = useState('');
  const [gradeName, setGradeName] = useState('');

  const [showAlertChangeKomoditi, setShowAlertChangeKomoditi] = useState({
    show: false,
    data: null,
  });

  const deleteValue = () => {
    setVariantId(false);
    setShowFieldNewVariant(false);
    setShowAll(true);
    setVariantName('');
  };

  const showAlertChange = val => {
    setShowAlertChangeKomoditi({
      show: true,
      content: 'changeKomoditi',
      data: val,
    });
  };
  useEffect(() => {
    // console.log('getDetailKomoditi');
    getDetailKomoditi();
  }, []);

  useEffect(() => {
    const backAction = () => {
      closePanel();
      // setIsLoading(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    // console.log('editable', editable);
    if (variantId && variantId !== 0) {
      //jika variant id berisi
      setShowAll(true);
      setShowFieldNewVariant(false);
      const list_market_price = detail?.market_price?.list_market_price;
      let variantGrades = list_market_price?.filter(
        (o, i) => o.commoditie_variant_id === variantId,
      );
      // console.log('list_market_price', list_market_price);
      // console.log('variantGrades 1', variantGrades);

      if (variantGrades) {
        // Mapping Buat di Radio button harus ada Option
        variantGrades =
          variantGrades.length > 0
            ? variantGrades.map(varian => ({
                ...varian,
                unit: detail?.unit ?? 'Kg',
                option: varian.grade_id,
              }))
            : [];

        variantGrades.push({
          grade_id: 0,
          option: 0,
          title: 'Grade Lainnya',
          grade_name: null,
          unit: null,
          price: null,
        });
        // console.log('variantGrades ', variantGrades);
        setGradesList(variantGrades);

        if (editable) {
          fetchDataEditable(variantGrades);
        }
      }
    } else {
      if (variantId === 0) {
        if (
          editable &&
          editable?.commoditie_variant_id === 0 &&
          editable?.commoditie_variant_name === ''
        ) {
          setShowAll(false);
          setShowFieldNewVariant(true);
          setSelectedGrade(editable?.grade_id);
        } else {
          setShowAll(false);
          setShowFieldNewVariant(true);
          setSelectedGrade(0);
        }
      } else {
        // console.log('detaillll', detail);
        const list_market_price = detail?.market_price?.list_market_price;
        // console.log('list_market_price', list_market_price);
        let variantGrades = list_market_price?.filter(
          (o, i) => o.commoditie_variant_id === 0,
        );

        if (variantGrades) {
          // Mapping Buat di Radio button harus ada Option
          console.log('variantGrades', variantGrades);

          variantGrades =
            variantGrades.length > 0
              ? variantGrades.map(varian => ({
                  ...varian,
                  unit: detail?.unit ?? 'Kg',
                  option: varian.grade_id,
                }))
              : [];
          // console.log('variantGrades 2', variantGrades);
          variantGrades.push({
            grade_id: 0,
            option: 0,
            title: 'Grade Lainnya',
            grade_name: null,
            unit: null,
            price: null,
          });
          setGradesList(variantGrades);
          if (editable) {
            fetchDataEditable(variantGrades);
          }
        }
      }
    }
  }, [variantId]);

  useEffect(() => {
    if (editable) {
      setFarmerPrice(editable?.unit_price);
      setSubTotal(editable?.subtotal);
      let dispValueQty =
        editable.quantity === ''
          ? editable.quantity
          : delimiterFormat(editable.quantity, '.');
      // console.log('dispValueQty', dispValueQty);
      setDisplayValue(dispValueQty);
      setQuantity(parseFloat(editable?.quantity));
      setGradeName(editable?.grade_name);
      setVariantName(editable?.commoditie_variant_name);
      let dispValue =
        editable?.unit_price === ''
          ? editable?.unit_price
          : delimiterFormat(editable?.unit_price, '.');
      setDisplayValueFarmerPrice(dispValue);
      setNote(editable?.note);
    }
  }, [editable]);

  const getDetailKomoditi = () => {
    setIsLoading(true);
    API.get(`farmer/offer/commoditie-detail/${data.id}`)

      // API.post(`farmer/offer/commoditie-detail-v2/`,{
      //   warehouse_id: ,
      //   commoditie_id: data.id,
      // })
      .then(async res => {
        console.log('res get detail komoditi', data.id, res);
        if (res?.meta?.http_status === 200) {
          setDetail(res.data);
          const dt = res.data.commoditie.commoditie_varians;

          // =========== Variants ===========
          const options = [];
          for (let i = 0; i < dt.length; i++) {
            options.push({id: dt[i].id, value: dt[i].id, label: dt[i].name});
          }
          options.push({
            id: 0,
            value: 0,
            label: 'Varian Lainnya',
          });
          options.sort((a, b) =>
            a.label.toUpperCase() > b.label.toUpperCase() ? 1 : -1,
          );
          // console.log('options', options);
          setVariants(options);

          // =========== Grades ===========
          const list_market_price = res?.data?.market_price?.list_market_price;
          // console.log('list_market_price', list_market_price);

          let gradeVariantID0 = list_market_price?.filter(
            (o, i) => o.commoditie_variant_id === 0,
          );
          // console.log('gradeVariantID0', gradeVariantID0);

          if (res.data?.commoditie?.commoditie_varians?.length === 0) {
            //jika tidak ada variant, tampilkan grade dengan commoditie_variant_id === 0,
            gradeVariantID0 = gradeVariantID0.map(varian => ({
              ...varian,
              option: varian.grade_id,
            }));
            // console.log('gradeVariantID0', gradeVariantID0);
            gradeVariantID0.push({
              grade_id: 0,
              option: 0,
              title: 'Grade Lainnya',
              grade_name: null,
              unit: null,
              price: null,
            });
            setGradesList(gradeVariantID0);
            setShowAll(true);
          }
          if (editable?.commoditie_id === res?.data?.commoditie?.id) {
            setVariantId(parseInt(editable.commoditie_variant_id));

            if (editable) {
              setDataEdit({
                ...dataEdit,
                commoditie_variant_id: editable?.commoditie_variant_id,
                commoditie_variant_name: editable?.commoditie_variant_name,
                check: true,
              }); //agar statenya berubah, fix bug nama varian ketika ubah komoditi
            }
          }
        } else {
          dispatch(_handleAlertMessage(res));
        }
        setIsLoading(false);
      })
      .catch(err => {
        const response = getErrorResponse(err?.response?.data?.errors);
        dispatch(
          _handleAlertMessage(
            err,
            'error',
            response ?? 'Gagal Mendapatkan Detail Komoditi',
          ),
        );
        setIsLoading(false);
      });
  };

  // =======================================

  const fetchDataEditable = async listGrade => {
    // console.log('===== fetchDataEditable =====', editable);
    if (editable) {
      let gradeId = parseInt(editable?.grade_id);
      // let findGrade = gradesList.find(grade => grade.grade_id === gradeId);
      let findGrade = listGrade.find(grade => grade.grade_id === gradeId);
      // console.log('findGrade2', findGrade2);
      setSelectedGrade(findGrade);
      // let value = editable.quantity?.split('.').join('');
      // console.log('valueeee', value);

      // let valid = /^[0-9]*$/.test(value) || editable.quantity === '';
      // return {
      //   valid: valid,
      //   value: editable.quantity === '' ? editable.quantity : delimiterFormat(value, '.'),
      // };
      let dispValue =
        editable.quantity === ''
          ? editable.quantity
          : delimiterFormat(editable.quantity, '.');
      // console.log('dispValue', dispValue);
      setDisplayValue(dispValue);
      setQuantity(parseFloat(editable.quantity?.replace(',', '.')));
      setNote(editable.note);
      setSubTotal(editable.subtotal);
      setShowAll(true);
    }
  };

  // =======================================

  useEffect(() => {
    let setIsSubmitted = handlerValidation();
    setSubmit(setIsSubmitted);
  }, [variantId, SelectedGrade, Quantity, farmerPrice]);

  const handlerValidation = () => {
    console.log('SelectedGrade', SelectedGrade);

    // if (!variantId) return true;
    if (!SelectedGrade?.price && !farmerPrice) {
      return true;
    }
    if (Quantity === 0) {
      return true;
    }
    return false;
  };

  // useEffect(() => {
  //   let total = 0;
  //   // console.log('selectedGraeeede', SelectedGrade);
  //   if (SelectedGrade && SelectedGrade?.price !== null) {
  //     total = Quantity * SelectedGrade?.price;
  //     // console.log('tooootal', total);
  //     // console.log('Quantity', Quantity);

  //     setSubTotal(total);
  //   }
  // }, [SelectedGrade, Quantity]);

  useEffect(() => {
    let total = 0;
    if (farmerPrice && farmerPrice > 0) {
      console.log('farmerPrice', farmerPrice);
      total = Quantity * farmerPrice;
      // console.log('totalllll', total);
      // console.log('Quantity', Quantity);
      // console.log('farmerPrice', farmerPrice);

      setSubTotal(total);
    } else {
      if (SelectedGrade && SelectedGrade?.price !== null) {
        total = Quantity * SelectedGrade?.price;
        // console.log('tooootal', total);
        // console.log('Quantity', Quantity);

        setSubTotal(total);
      }
    }
  }, [farmerPrice, SelectedGrade, Quantity]);

  const handleSubmit = () => {
    setIsLoading(true);
    const variant_name = variants?.find(v => v.id === variantId)?.label;
    let formdata = {
      _id: editable ? editable._id : Math.random().toString(36).substring(2, 8),
      // parentId: data.id,
      sku: SelectedGrade?.sku,
      commoditie_photo: detail?.commoditie?.commoditie_photo,
      commoditie_id: detail?.market_price.commoditie_id,
      commoditie_variant_id: SelectedGrade?.commoditie_variant_id
        ? SelectedGrade?.commoditie_variant_id
        : variantId === false
        ? 0
        : variantId,
      commoditie_variant_name: SelectedGrade?.commoditie_variant_name
        ? SelectedGrade?.commoditie_variant_name
        : variantName,
      grade_id: SelectedGrade?.grade_id ? SelectedGrade.grade_id : 0,
      grade_name: SelectedGrade?.grade_name
        ? SelectedGrade.grade_name
        : gradeName,
      quantity: parseFloat(Quantity),
      unit: detail?.commoditie?.unit ?? 'kg',
      unit_price:
        farmerPrice && farmerPrice > 0 ? farmerPrice : SelectedGrade?.price,

      is_farmer_price: farmerPrice && farmerPrice > 0 ? true : false,
      subtotal: SubTotal,
      note: Note,
      name:
        variantId !== 0 && variant_name
          ? `${detail?.commoditie.name} - ${variant_name}`
          : variantName !== ''
          ? `${detail?.commoditie.name} - ${variantName}`
          : SelectedGrade?.variant_name === 'Tanpa Variant' ||
            SelectedGrade?.variant_name === '' ||
            variantId === false ||
            variantName === ''
          ? `${detail?.commoditie.name} - Tanpa Variant`
          : SelectedGrade?.variant_name !== ''
          ? `${detail?.commoditie.name} - ${SelectedGrade.variant_name}`
          : `${detail?.commoditie.name} - Tanpa Variant`,
    };

    // console.log('variants', variants);
    // console.log('variantId', variantId);
    // console.log('variant_name', variant_name);
    // console.log('variantName', variantName);
    // console.log('formData', formdata);
    // console.log('SelectedGrade', SelectedGrade);
    console.log('farmerPrice', farmerPrice);
    if (editable) {
      setSelectedKomoditi(prev =>
        prev.map(pre => {
          if (pre._id === formdata._id) {
            // console.log('formdata', formdata);
            return formdata;
          }
          return pre;
        }),
      );

      dispatch(setMessage('Komoditi Berhasil Diubah'));
    } else {
      const isKomoditiAdded = SelectedKomoditi.map(item =>
        formdata?.grade_name === item.grade_name &&
        formdata?.grade_id === item.grade_id &&
        formdata?.commoditie_id === item.commoditie_id &&
        formdata?.commoditie_variant_id === item.commoditie_variant_id
          ? true
          : false,
      );
      console.log('isKomoditiAdded', isKomoditiAdded);
      const result = isKomoditiAdded.some(added => added === true);
      if (result) {
        dispatch(setMessage('Komoditi Sudah Ditambahkan Sebelumnya'));
      } else {
        if (!formdata.unit_price || formdata.unit_price === 0) {
          Alert.alert('Harga belum di isi', 'Mohon masukan harga komoditi');
        } else {
          setSelectedKomoditi(prev => [...prev, formdata]);
          dispatch(setMessage('Komoditi Berhasil Ditambahkan'));
        }
      }
    }
    dispatch(setMessageType('success'));
    dispatch(setAlert(true));
    setTimeout(() => {
      closePanel();
    }, 200);
    setIsLoading(false);
  };

  useEffect(() => {
    //meng
    console.log('dataEdit', dataEdit);
    if (
      dataEdit?.commoditie_variant_id !== 0 &&
      dataEdit?.commoditie_variant_name !== ''
    ) {
      //berarti kosong, Tanpa Variantt
      console.log('dataEdit Kosong', dataEdit);
      deleteValue();
    }
  }, [dataEdit]);

  const _renderGrades = useCallback(() => {
    return (
      <View style={[gStyles.col, {marginTop: 10}]}>
        <Text style={gStyles.text(14, '400', '#313447')}>Grade</Text>
        <View style={[gStyles.col]}>
          {gradesList?.length > 0 ? (
            gradesList.map((grade, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.card,
                  gStyles.row_center3,
                  {
                    borderColor:
                      SelectedGrade?.grade_id === grade.grade_id
                        ? '#2E3192'
                        : '#E3E3E5',
                  },
                ]}
                onPress={() => {
                  setFarmerPrice(0);
                  setDisplayValueFarmerPrice(0);
                  if (grade.grade_id === 0) {
                  }
                  setSelectedGrade(grade);
                }}>
                {/* {console.log('grade', grade)} */}
                <RadioButtons
                  key={i}
                  styleTouchButton={[
                    gStyles.row_center3,
                    {
                      width: 25,
                    },
                  ]}
                  option={grade}
                  showOption={false}
                  setOption={val => setSelectedGrade(grade)}
                  selected={SelectedGrade?.grade_id}
                  radioButtonBorderColor="#BEBFC2"
                  selectedRadioButtonColor="#fff"
                  selectedRadioButtonBorderColor="#2E3192"
                  radioButtonSize={18}
                />
                {grade.grade_id === 0 ? (
                  <Text
                    style={[
                      {marginLeft: 8},
                      gStyles.text(14, '500', '#313447'),
                    ]}>
                    {grade.title}
                  </Text>
                ) : (
                  <>
                    <GradeItem
                      grade={grade?.grade_name}
                      gradeColor={`${getGradeStyle(i)}`}
                    />
                    <Text
                      style={[
                        {marginLeft: 8},
                        gStyles.text(14, '500', '#313447'),
                      ]}>
                      Rp. {delimiterFormat(grade?.price)}{' '}
                    </Text>
                    <Text style={gStyles.text(14, '400', '#313447')}>
                      / {grade?.unit ?? 'Kg'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={[
                gStyles.textCenter,
                gStyles.marginVertical(10),
                gStyles.text(14, '400', '#313447'),
              ]}>
              Grade tidak ditemukan
            </Text>
          )}
        </View>
      </View>
    );
  }, [gradesList, SelectedGrade]);

  const _renderQtyAndNotes = () => {
    return (
      <>
        <View style={[gStyles.col, {marginTop: 10}]}>
          <Text style={gStyles.text(14, '400', '#313447')}>Kuantitas</Text>
          <View style={gStyles.row_center2}>
            {/* <Input
                      style={{width: '70%'}}
                      placeholder={'0'}
                      keyboardType="numeric"
                      value={displayValue}
                      values={Quantity}
                      defaultValue={editable ? Quantity.toString() : Quantity}
                      // onChangeText={val =>
                      //   // setQuantity(val === '' ? 0 : parseInt(val))
                      //   setQuantity(removeNonNumeric(val))
                      // }
                      onChangeText={text => onChangeInput(text)}
                      // onChangeText={value =>
                      //   handleChange('no_ktp', removeNonNumeric(value))
                      // }
                    /> */}
            <DecimalInput
              value={displayValue}
              onChangeText={onChangeInput}
              onChangeDisplayText={setDisplayValue}
              style={{width: '70%'}}
            />
            <Input
              style={{minWidth: 80, width: '28%'}}
              disabled={true}
              value={detail?.commoditie?.unit ?? 'Kilogram'}
              editable={false}
            />
          </View>
        </View>

        <View style={[gStyles.col, {marginVertical: 10}]}>
          <Text style={gStyles.text(14, '400', '#313447')}>Catatan</Text>
          <Input
            placeholder={'Masukan catatan bila ada'}
            maxLength={150}
            multiline
            numberOfLines={4}
            editable
            textAlignVertical={'top'}
            value={Note}
            onChangeText={val => setNote(val)}
          />
          <Text style={{alignSelf: 'flex-end', padding: 5}}>
            {Note.length} / 150
          </Text>
        </View>
      </>
    );
  };

  const _renderNewGrade = (showLabel = true) => {
    return (
      <>
        <View style={[gStyles.col]}>
          {showLabel ? (
            <Text
              style={[
                gStyles.text(14, '400', '#313447'),
                gStyles.marginVertical(5),
              ]}>
              Grade
            </Text>
          ) : null}
          <Input
            style={gStyles.inputField}
            placeholder={'Masukan nama grade'}
            value={gradeName}
            onChangeText={val => setGradeName(val)}
          />
          <View style={gStyles.marginVertical(5)} />
          <View
            style={[
              gStyles.position('relative'),
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <DecimalInput
              placeholder={'Rp  0'}
              value={displayValueFarmerPrice}
              onChangeText={onChangeFarmerPrice}
              onChangeDisplayText={setDisplayValueFarmerPrice}
              style={gStyles.inputField}
            />
            <Text style={[gStyles.position('absolute'), {right: 10}]}>/Kg</Text>
          </View>
        </View>
      </>
    );
  };

  const onChangeInput = text => {
    let value = text.split('.').join('');

    let valid = /^[0-9]*$/.test(value) || text === '';
    // return {
    //   valid: valid,
    //   value: text === '' ? text : delimiterFormat(value, '.'),
    // };
    let dispValue = text === '' ? text : delimiterFormat(value, '.');
    // console.log('value', value);
    // console.log('dispValue', dispValue);
    // let quantityCheck = value;
    let quantityCheck = Number.isNaN(value) ? 0 : value;
    setDisplayValue(dispValue);
    setQuantity(parseFloat(value.replace(',', '.')));

    return quantityCheck;
  };
  const onChangeFarmerPrice = text => {
    let value = text.split('.').join('');

    let valid = /^[0-9]*$/.test(value) || text === '';
    // return {
    //   valid: valid,
    //   value: text === '' ? text : delimiterFormat(value, '.'),
    // };
    let dispValue = text === '' ? text : delimiterFormat(value, '.');

    let valueCheck = Number.isNaN(value) ? 0 : value;
    setDisplayValueFarmerPrice(dispValue);
    setFarmerPrice(parseFloat(value.replace(',', '.')));

    return valueCheck;
  };

  const changeKomoditi = () => {
    dispatch(setSelectedKupon(null));
    setShowDetail({show: false});
  };
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: '#fff',
        },
      ]}>
      <LoadingAnimated visible={IsLoading} />
      {!IsLoading && (
        <KeyboardAvoidingView behavior={'height'}>
          <ScrollView
            style={{
              padding: 16,
            }}
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={[styles.card, gStyles.row_center2]}>
              <View style={gStyles.row_center3}>
                <View style={[gStyles.boxIcon, {marginRight: 12}]}>
                  {/* <BoxIcon width={35} height={35} /> */}
                  <ImageProduct
                    url={detail?.commoditie?.commoditie_photo}
                    style={[
                      gStyles.dimension('100%', '100%'),
                      {borderRadius: 40},
                    ]}
                  />
                </View>
                <View style={[gStyles.col, {width: '60%'}]}>
                  <Text style={gStyles.text(14, '500', 'black')}>
                    {detail?.commoditie?.name}
                  </Text>
                  {detail?.commoditie?.commoditie_varians?.length > 0 ? (
                    <Text style={gStyles.text(12, '400', '#313447')}>
                      {detail?.commoditie?.commoditie_varians?.length} Varian
                    </Text>
                  ) : null}
                </View>
              </View>
              <Button
                title={'Ganti'}
                textStyle={[gStyles.btnSecondaryText, {fontSize: 14}]}
                paddingVertical={10}
                style={{width: 70}}
                onPress={() => {
                  //check apakah ada kupon harga khusus
                  // console.log('SelectedKupon', SelectedKupon);
                  // console.log('detail', detail);
                  if (SelectedKupon) {
                    let komoditiWithKupon =
                      SelectedKupon?.commoditie_detail?.map(
                        kmdt => kmdt?.commoditie_id === detail?.commoditie?.id,
                      );

                    komoditiWithKupon = assignBooleanValue(komoditiWithKupon);

                    if (komoditiWithKupon) {
                      showAlertChange();
                      // setShowAlertChangeKomoditi(true);
                    } else {
                      setShowDetail({show: false});
                    }
                  } else {
                    setShowDetail({show: false});
                  }
                }}
              />
            </View>
            {/* {detail?.commoditie?.commoditie_varians?.length > 0 ? ( */}
            <Select
              value={variantId}
              setValue={setVariantId}
              data={variants}
              placeholder="Pilih varian"
              label="Varian"
              searchable
              deleteValue={deleteValue}
            />
            {/* ) : null} */}

            {showFieldNewVariant && (
              <>
                <Input
                  placeholder={'Masukan nama varian'}
                  value={variantName}
                  style={[gStyles.inputField, {marginBottom: 15}]}
                  onChangeText={val => setVariantName(val)}
                />
                {_renderNewGrade()}
                {_renderQtyAndNotes()}
              </>
            )}
            {ShowAll && (
              <>
                {_renderGrades()}
                {SelectedGrade?.grade_id !== 0 ? (
                  <View style={[gStyles.col, {marginTop: 10}]}>
                    <Text style={gStyles.text(14, '400', '#313447')}>
                      Harga Penawaran{' '}
                      <Text style={gStyles.text(14, '200', '#313447')}>
                        (Opsional)
                      </Text>
                    </Text>
                    <View
                      style={[
                        gStyles.position('relative'),
                        {
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        },
                      ]}>
                      <DecimalInput
                        placeholder={'Rp  0'}
                        value={displayValueFarmerPrice}
                        onChangeText={onChangeFarmerPrice}
                        onChangeDisplayText={setDisplayValueFarmerPrice}
                        style={gStyles.inputField}
                      />
                      <Text style={[gStyles.position('absolute'), {right: 10}]}>
                        /Kg
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: '#F5F6F7',
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      padding: 8,
                      marginTop: -8,
                    }}>
                    {_renderNewGrade(false, gradeName, displayValueFarmerPrice)}
                  </View>
                )}
                {_renderQtyAndNotes()}
              </>
            )}
            <View
              style={[
                styles.koreksi,
                gStyles.row_center2,
                {width: '100%', marginVertical: 15, padding: 12},
              ]}>
              <Text style={{color: 'black'}}>Total Harga</Text>
              <Text style={{color: 'black'}}>
                Rp. {delimiterFormat(SubTotal)}
              </Text>
            </View>
            <Button
              title={'Simpan'}
              style={{marginBottom: 60}}
              textStyle={gStyles.btnSecondaryText}
              onPress={() => handleSubmit()}
              type="full"
              isDisabled={Submit}
            />
          </ScrollView>
          {showAlertChangeKomoditi.show && (
            <BottomPanelModal
              radius={12}
              height="auto"
              withHeader={false}
              showCloseBtn
              title={'Ganti Komoditi?'}
              styleCustom={{zIndex: 5}}
              closePanel={() => setShowAlertChangeKomoditi({show: false})}
              shadowTitle
              content={
                <AlertPopUp
                  setBottomPanelPopup={setShowAlertChangeKomoditi}
                  BottomPanelPopup={showAlertChangeKomoditi}
                  onPress={changeKomoditi}
                />
              }
            />
          )}
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default KomoditiAdd;
