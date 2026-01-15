import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  IconCamera,
  IconDocumentText,
  IconGallery,
  InfoCircle,
} from '../../../assets';
import {gStyles} from '../../../utils/styles';

import {Button, Container} from '../../atoms';

const PickAttachment = ({
  closePanel,
  setChooseFromWhere,
  document = true,
  gallery = true,
  camera = false,
}) => {
  return (
    <View style={{flex: 1, paddingBottom: 60, backgroundColor: '#fff'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: 15,
          paddingHorizontal: 16,
        }}>
        {camera ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                setChooseFromWhere('camera');
              }}
              style={{
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <IconCamera fill="#2E3192" width={32} height={32} />
            </TouchableOpacity>
            <Text style={gStyles.text(14, '500', '#313447')}>Kamera</Text>
          </View>
        ) : null}
        {document ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                setChooseFromWhere('document');
              }}
              style={{
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <IconDocumentText fill="#2E3192" width={32} height={32} />
            </TouchableOpacity>
            <Text style={gStyles.text(14, '500', '#313447')}>Dokumen</Text>
          </View>
        ) : null}
        {gallery ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                setChooseFromWhere('gallery');
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 20,
              }}>
              <IconGallery fill="#2E3192" width={32} height={32} />
              <Text style={gStyles.text(14, '500', '#313447')}>Galeri</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default PickAttachment;
