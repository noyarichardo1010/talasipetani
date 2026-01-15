import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {IconClose, IconSuccess} from '../../../assets';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

let {width} = Dimensions.get('window');

const CustomAlert = ({
  type = 'success',
  text,
  alertType = 'top',
  closeIcon,
  handleClose,
  timeClose = 6000,
}) => {
  useEffect(() => {
    setTimeout(() => {
      handleClose();
    }, timeClose);
  }, []);
  // console.log('text', text);
  return (
    // <Animated.View
    //   style={{position: 'relative'}}
    //   entering={FadeIn}
    //   exiting={FadeOut}>
    <>
      {alertType === 'top'
        ? Array.isArray(text) && text.length > 0
          ? text.map((msg, i) => (
              <View
                style={[
                  styles.containerTop,
                  {top: i === 0 ? 0 : (i + 1) * 45 - 45},
                ]}
                key={i}>
                <View style={styles.wrapperTop}>
                  {type === 'success' ? (
                    <View style={styles.iconSuccess}>
                      <IconSuccess width={15} height={15} fill={'#2AB95E'} />
                    </View>
                  ) : (
                    <View style={styles.iconFailed}>
                      <IconClose width={15} height={15} fill={'#C20102'} />
                    </View>
                  )}
                  <Text style={styles.textTop}>{msg}</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <IconClose width={17} height={17} fill={'#8C8D8F'} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          : text && (
              <View style={styles.containerTop}>
                <View style={styles.wrapperTop}>
                  {type === 'success' ? (
                    <View style={styles.iconSuccess}>
                      <IconSuccess width={15} height={15} fill={'#2AB95E'} />
                    </View>
                  ) : (
                    <View style={styles.iconFailed}>
                      <IconClose width={15} height={15} fill={'#C20102'} />
                    </View>
                  )}
                  <Text style={styles.textTop}>{text}</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <IconClose width={17} height={17} fill={'#8C8D8F'} />
                  </TouchableOpacity>
                </View>
              </View>
            )
        : Array.isArray(text) && text.length > 0
        ? text.map((msg, i) => (
            <TouchableOpacity
              style={[
                styles.containerBottom,
                {bottom: i === 0 ? 0 : (i + 1) * 35 - 35},
              ]}
              onPress={handleClose}
              key={i}>
              <View
                style={[
                  styles.wrapperBottom,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {backgroundColor: type === 'success' ? '#149617' : '#C20102'},
                ]}>
                <Text style={styles.textBottom}>{msg}</Text>
                {closeIcon ? (
                  <TouchableOpacity onPress={handleClose}>
                    <IconClose width={17} height={17} fill={'#8C8D8F'} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
        : text && (
            <TouchableOpacity
              style={styles.containerBottom}
              onPress={handleClose}>
              <View
                style={[
                  styles.wrapperBottom,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {backgroundColor: type === 'success' ? '#149617' : '#C20102'},
                ]}>
                <Text style={styles.textBottom}>{text}</Text>
                {closeIcon ? (
                  <TouchableOpacity onPress={handleClose}>
                    <IconClose width={17} height={17} fill={'#8C8D8F'} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
      {/* // </Animated.View> */}
    </>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  wrapper: {position: 'relative'},
  containerTop: {
    position: 'absolute',
    top: 0,
    width: width,
    zIndex: 9999,
  },
  containerBottom: {
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  wrapperTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 16,
  },
  wrapperBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  iconSuccess: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconFailed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTop: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    fontWeight: '400',
    color: '#1E1E1F',
  },
  textBottom: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
  },
});
