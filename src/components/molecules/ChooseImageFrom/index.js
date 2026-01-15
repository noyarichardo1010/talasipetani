import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {IconCamera, IconGallery} from '../../../assets';
import {useState} from 'react';
import {gStyles} from '../../../utils/styles';
let {width, height} = Dimensions.get('window');

const ChooseImageFrom = ({handleClose, setGalleryOrCamera, top}) => {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => handleClose(false)}>
      <View style={styles.top_section} />
      <View style={[styles.contentWrapper, {top: top}]}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>Pilih gambar...</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 25,
          }}>
          <TouchableOpacity
            onPress={() => {
              setGalleryOrCamera('camera');
            }}
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#CF1701',
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}>
            <IconCamera fill="#fff" width={25} height={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setGalleryOrCamera('gallery');
            }}
            style={{
              width: 50,
              height: 50,
              backgroundColor: '#CF1701',
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <IconGallery fill="#fff" width={25} height={25} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => handleClose(false)}
          style={{
            marginVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={gStyles.text(14, '400', '#313447')}>batal</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ChooseImageFrom;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  top_section: {
    position: 'relative',
    width: width,
    height: height,
    backgroundColor: '#092540',
    opacity: 0.25,
  },
  contentWrapper: {
    // height: '40%',
    position: 'absolute',
    // bottom: 0,
    width: width - 30,
    backgroundColor: '#F5F6F7',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CF1701',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 16,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 22,
  },
});
