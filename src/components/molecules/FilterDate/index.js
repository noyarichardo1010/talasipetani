import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {RadioButtons} from '../../atoms';
import {gStyles} from '../../../utils/styles';
import {IconClose, IconDown, IconRightArrow} from '../../../assets';
import {useState} from 'react';
import {
  format_tanggal_indo,
  tahun_bulan_tanggal,
} from '../../../utils/helpers/date';
let {height, width} = Dimensions.get('window');
import DatePicker from 'react-native-date-picker';

const today = tahun_bulan_tanggal(new Date());

const FilterDate = ({
  setFilterShowed,
  value,
  setValue,
  filterDateOptions,
  handleChangeFilterDate,
  start_date,
  end_date,
}) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [whichFieldDateShow, setWhichFieldDateShow] = useState('');
  const handleChange = val => {
    setValue(val);
    if (val !== 'Periode Tanggal') {
      setFilterShowed('');
    }
  };

  const showDatePicker = field => {
    setWhichFieldDateShow(field);
    // console.log('field', field);
    setShowCompleted(!showCompleted);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setFilterShowed('')}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setFilterShowed('')}>
            <IconClose fill={'#9AA2B1'} width={17} height={17} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tanggal</Text>
        </View>
        <View style={gStyles.col}>
          {filterDateOptions.map((obj, index) => (
            <React.Fragment key={index}>
              <RadioButtons
                option={obj}
                setOption={val => handleChange(val)}
                selected={value}
                radioButtonBorderColor="#BEBFC2"
                radioButtonSize={22}
                selectedRadioButtonColor="#fff"
                selectedRadioButtonBorderColor="#C20102"
                optionTextStyling={{
                  fontSize: 14,
                  color: '#1E1E1F',
                  fontWeight: '600',
                }}
                type="row-reverse"
                key={obj}
              />
              {index === filterDateOptions.length - 1 ? null : (
                <View style={gStyles.line('#DCDDE0', 1)} />
              )}
            </React.Fragment>
          ))}
          {value === 'Periode Tanggal' ? (
            <>
              <View style={styles.dateContainer}>
                <View style={styles.fromDateWrapper}>
                  <Text style={styles.chooseDateTitle}>Dari</Text>

                  <TouchableOpacity
                    style={[
                      styles.chooseDateBTN('#fff'),
                      showCompleted &&
                        whichFieldDateShow === 'start_date' && {
                          backgroundColor: '#eee',
                        },
                    ]}
                    onPress={() => showDatePicker('start_date')}>
                    <View style={styles.dateWrapper}>
                      <Text style={gStyles.text(14, '400', '#1E1E1F')}>
                        {start_date
                          ? format_tanggal_indo(new Date(start_date))
                          : '1 Juli 2022'}
                      </Text>
                      {showCompleted && whichFieldDateShow === 'start_date' ? (
                        <IconDown width={10} height={10} fill={'#aaa'} />
                      ) : (
                        <IconRightArrow width={10} height={10} fill={'#aaa'} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.toDateWrapper}>
                  <Text style={styles.chooseDateTitle}>Sampai</Text>

                  <TouchableOpacity
                    style={[
                      styles.chooseDateBTN('#fff'),
                      showCompleted &&
                        whichFieldDateShow === 'end_date' && {
                          backgroundColor: '#eee',
                        },
                    ]}
                    onPress={() => showDatePicker('end_date')}>
                    <View style={styles.dateWrapper}>
                      <Text style={gStyles.text(14, '400', '#1E1E1F')}>
                        {end_date
                          ? format_tanggal_indo(new Date(end_date))
                          : new Date()}
                      </Text>
                      {showCompleted && whichFieldDateShow === 'end_date' ? (
                        <IconDown width={10} height={10} fill={'#aaa'} />
                      ) : (
                        <IconRightArrow width={10} height={10} fill={'#aaa'} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                {showCompleted && (
                  <DatePicker
                    date={
                      whichFieldDateShow === 'start_date'
                        ? new Date(start_date)
                        : new Date(end_date)
                    }
                    // date={new Date()}
                    onDateChange={val =>
                      handleChangeFilterDate(
                        whichFieldDateShow,
                        tahun_bulan_tanggal(val),
                      )
                    }
                    mode="date"
                    androidVariant="nativeAndroid"
                    maximumDate={
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 2,
                        new Date().getDate(),
                      )
                    }
                    textColor={'#000'}
                    style={styles.datePicker}
                  />
                )}
              </View>
            </>
          ) : (
            <View style={styles.dateContainer}>
              <View style={styles.fromDateWrapper}>
                <Text style={styles.chooseDateTitle}>Dari</Text>
                <View style={styles.chooseDateBTN('#F5F6F7')}>
                  <Text style={gStyles.text(14, '400', '#8C8D8F')}>
                    1 Juli 2022
                  </Text>
                </View>
              </View>
              <View style={styles.toDateWrapper}>
                <Text style={styles.chooseDateTitle}>Sampai</Text>
                <View style={styles.chooseDateBTN('#F5F6F7')}>
                  <Text style={gStyles.text(14, '400', '#8C8D8F')}>
                    {format_tanggal_indo(new Date())}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default FilterDate;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: '#092540',
    opacity: 0.25,
  },
  container: {
    height: '90%',
    position: 'absolute',
    bottom: -25,
    width: width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 6,
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#092540',
    marginLeft: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  chooseDateTitle: {fontWeight: '600'},
  chooseDateBTN: backgroundColor => {
    return {
      marginTop: 6,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderColor: '#DCDDE0',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: backgroundColor,
    };
  },
  fromDateWrapper: {flex: 1, marginRight: 7},
  toDateWrapper: {flex: 1, marginLeft: 7},
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePicker: {
    marginBottom: 30,
    backgroundColor: '#fff',
    alignSelf: 'center',
    shadowColor: '#111',
  },
});
