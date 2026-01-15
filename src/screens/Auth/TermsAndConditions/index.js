import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {gStyles} from '../../../utils/styles';
import {textTermsAndConditions} from './dummy';
import {Button} from '../../../components';
import HTMLView from 'react-native-htmlview';

const TermsAndConditions = ({style, confirm, loading}) => {
  const {theme} = useSelector(reducer => reducer.global);

  const onPressAgreeBtn = () => {
    confirm();
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: theme.secondaryBackgroundColor,
        }}>
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.secondaryBackgroundColor,
            },
          ]}>
          <Text style={gStyles.text(20, '700', theme.textColor)}>
            Syarat & Ketentuan
          </Text>
          <View style={gStyles.marginVertical(8)} />
          <HTMLView value={textTermsAndConditions} stylesheet={styles} />
          {/* <Text style={gStyles.text(14, '400', theme.textColor)}>
            {textTermsAndConditions}
          </Text> */}
        </View>
      </ScrollView>
      <>
        <View style={[styles.borderTop, {boxShadow: theme.textColor}]} />
        <View
          style={[
            gStyles.padding(16),
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          <Text style={gStyles.text(14, '400', theme.textColor)}>
            Dengan menekan tombol di bawah ini berarti saya{' '}
            <Text style={gStyles.text(14, '700', theme.textColor)}>
              sudah membaca dan menyetujui
            </Text>{' '}
            Syarat & Ketentuan yang berlaku.
          </Text>
          <View style={gStyles.marginTop(12)} />
          <Button
            title="Setuju dan Buat Akun"
            onPress={() => onPressAgreeBtn()}
            type="full"
            isDisabled={loading}
            loading={loading}
            style={
              loading
                ? {
                    color: 'gray',
                    backgroundColor: '#CBCCD1',
                  }
                : {}
            }
          />
        </View>
      </>
    </View>
  );
};

export default React.memo(TermsAndConditions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    padding: 16,
  },
  borderTop: {
    height: 3.5,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  btnAgree: {
    paddingVertical: 13,
    borderRadius: 4,
    width: '100%',
    backgroundColor: '#2A378E',
  },
  btnAgreeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
   // HTML Converter
   h4: {
    color: '#313447',
    fontWeight: '500',
    fontSize: 16,
    margin: 0,
    padding: 0,
    
  },
   p: {
    color: '#313447',
    fontSize: 14,
    margin: 0,
    padding: 0,
    textAlign: 'justify',
  },
  span: {
    paddingLeft: 10,
    textAlign: 'justify',
    color: '#313447',
    fontSize: 14,
  },
  b: {fontWeight: '700'},
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
