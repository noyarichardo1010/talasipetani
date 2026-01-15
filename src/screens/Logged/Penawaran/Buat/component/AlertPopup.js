import {View, Text, Image} from 'react-native';
import React from 'react';
import styles from '../../styles';
import {gStyles} from '../../../../../utils/styles';
import {Button} from '../../../../../components';
import {AlertSubmit, AlertVerifying, AlertDraft} from '../../../../../assets';

const AlertPopUp = ({
  navigation,
  setBottomPanelPopup,
  BottomPanelPopup,
  onPress = {},
  reData,
  goBack,
}) => {
  if (BottomPanelPopup.content === 'leave') {
    return (
      <View style={[styles.cardNoBorder, {marginBottom: 0}]}>
        <View>
          <Text style={gStyles.text(16, '700', '#313447')}>
            Tinggalkan Halaman ?
          </Text>
          <Text
            style={[gStyles.text(14, '400', '#797B8A'), {marginVertical: 10}]}>
            Perubahan pada halaman ini tidak akan disimpan.
          </Text>
        </View>
        <View style={[gStyles.row_center, {marginTop: 10}]}>
          <Button
            title="Tidak"
            type="outline"
            style={gStyles.btnSecondaryOutline}
            textStyle={gStyles.btnSecondaryOutlineText}
            onPress={() => setBottomPanelPopup({show: false})}
          />
          <Button
            title="Ya"
            type="full"
            style={gStyles.btnSecondary}
            textStyle={gStyles.btnSecondaryText}
            onPress={goBack}
          />
        </View>
      </View>
    );
  }

  if (BottomPanelPopup.content === 'komoditiDelete') {
    return (
      <View style={[styles.cardNoBorder, {marginBottom: 10}]}>
        <View>
          <Text style={gStyles.text(16, '700', '#313447')}>
            Hapus komoditi ?
          </Text>
          <Text
            style={[gStyles.text(14, '400', '#797B8A'), {marginVertical: 10}]}>
            Kamu yakin akan menghapus komoditi {BottomPanelPopup.data.name} ?
          </Text>
        </View>
        <View style={[gStyles.row_center, {marginTop: 10}]}>
          <Button
            title="Tidak"
            type="outline"
            style={gStyles.btnSecondaryOutline}
            textStyle={gStyles.btnSecondaryOutlineText}
            onPress={() => setBottomPanelPopup({show: false})}
          />
          <Button
            title="Ya"
            type="full"
            style={gStyles.btnSecondary}
            textStyle={gStyles.btnSecondaryText}
            onPress={onPress}
          />
        </View>
      </View>
    );
  }
  if (BottomPanelPopup.content === 'komoditiWithKuponDelete') {
    return (
      <View style={[styles.cardNoBorder, {marginBottom: 10}]}>
        <View>
          <Text style={gStyles.text(16, '700', '#313447')}>
            Hapus komoditi ?
          </Text>
          <Text
            style={[gStyles.text(14, '400', '#797B8A'), {marginVertical: 10}]}>
            Ada kupon harga khusus. Kamu yakin akan menghapus komoditi{' '}
            {BottomPanelPopup.data.name} ?
          </Text>
        </View>
        <View style={[gStyles.row_center, {marginTop: 10}]}>
          <Button
            title="Tidak"
            type="outline"
            style={gStyles.btnSecondaryOutline}
            textStyle={gStyles.btnSecondaryOutlineText}
            onPress={() => setBottomPanelPopup({show: false})}
          />
          <Button
            title="Ya"
            type="full"
            style={gStyles.btnSecondary}
            textStyle={gStyles.btnSecondaryText}
            onPress={onPress}
          />
        </View>
      </View>
    );
  }

  if (BottomPanelPopup.content === 'submit') {
    return (
      <View style={[styles.cardNoBorder, gStyles.col_2, {marginBottom: 10}]}>
        <Image source={AlertSubmit} style={{margin: 16}} />
        <Text style={gStyles.text(20, '700', '#313447')}>
          Penawaran Berhasil Dikirim {reData && 'Ulang'}
        </Text>
        <Text
          style={[
            gStyles.text(14, '400', '#797B8A'),
            {marginTop: 8, marginBottom: 16, textAlign: 'center'},
          ]}>
          Pantau terus status penawaran Anda melalui menu Transaksi.
        </Text>
        <Button
          title={'Lihat Transaksi'}
          onPress={() => navigation.navigate('TransactionScreen', {new: true})}
          type="full"
          style={[styles.button, {width: '100%', marginBottom: 12}]}
          textStyle={styles.buttonText}
        />
        <Button
          title={'Kembali Ke Beranda'}
          onPress={() => navigation.navigate('HomeScreen')}
          // type="full"
          style={[styles.button, {width: '100%'}]}
          textStyle={styles.buttonText}
        />
      </View>
    );
  }
  if (BottomPanelPopup.content === 'draft') {
    return (
      <View style={[styles.cardNoBorder, gStyles.col_2, {marginBottom: 10}]}>
        <Image source={AlertDraft} style={{margin: 16}} />
        <Text
          style={[gStyles.text(20, '700', '#313447'), {textAlign: 'center'}]}>
          Penawaran Berhasil Ditambahkan ke Keranjang
        </Text>
        <Text
          style={[
            gStyles.text(14, '400', '#797B8A'),
            {marginTop: 8, marginBottom: 16, textAlign: 'center'},
          ]}>
          Cek kembali penawaran yang akan dikirim melalui menu Keranjang.
        </Text>
        <Button
          title={'Lihat Keranjang'}
          onPress={() => {
            setBottomPanelPopup({show: false});
            navigation.navigate('Cart');
          }}
          type="full"
          style={[styles.button, {width: '100%', marginBottom: 12}]}
          textStyle={styles.buttonText}
        />
        <Button
          title={'Kembali Ke Beranda'}
          onPress={() => navigation.navigate('HomeScreen')}
          style={[styles.button, {width: '100%'}]}
          textStyle={styles.buttonText}
        />
      </View>
    );
  }
  if (BottomPanelPopup.content === 'invalidCommoditie') {
    return (
      <View style={[styles.cardNoBorder, gStyles.col_2, {marginBottom: 10}]}>
        <Image source={AlertVerifying} style={{margin: 16}} />
        <Text style={gStyles.text(20, '700', '#313447')}>
          Tidak bisa memilih komoditi ini
        </Text>
        <Text
          style={[
            gStyles.text(14, '400', '#797B8A'),
            {marginTop: 8, marginBottom: 16, textAlign: 'center'},
          ]}>
          Anda menggunakan kupon harga khusus komoditi tertentu
        </Text>
        <View style={[gStyles.row_center, {marginTop: 10}]}>
          <Button
            title="OK"
            type="full"
            style={gStyles.btnSecondary}
            textStyle={gStyles.btnSecondaryText}
            onPress={() => setBottomPanelPopup({show: false})}
          />
        </View>
      </View>
    );
  }
  if (BottomPanelPopup.content === 'changeKomoditi') {
    return (
      <View style={[styles.cardNoBorder, {marginBottom: 10}]}>
        <View>
          <Text style={gStyles.text(16, '700', '#313447')}>
            Ganti Komoditi ?
          </Text>
          <Text
            style={[gStyles.text(14, '400', '#797B8A'), {marginVertical: 10}]}>
            Kupon harga khusus digunakan untuk komoditi ini, yakin ingin
            mengganti?
          </Text>
        </View>
        <View style={[gStyles.row_center, {marginTop: 10}]}>
          <Button
            title="Tidak"
            type="outline"
            style={gStyles.btnSecondaryOutline}
            textStyle={gStyles.btnSecondaryOutlineText}
            onPress={() => setBottomPanelPopup({show: false})}
          />
          <Button
            title="Ya"
            type="full"
            style={gStyles.btnSecondary}
            textStyle={gStyles.btnSecondaryText}
            onPress={onPress}
          />
        </View>
      </View>
    );
  }
  return null;
};

export default AlertPopUp;
