/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Modal, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {IconCloseCircle} from '../../../assets';
import styles from './styles';
import {gStyles} from '../../../utils/styles';

import {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';
// import {useBackHandler} from '@react-native-community/hooks';

const BottomPanelModal = ({
  closePanel = () => {},
  title,
  withHeader = false,
  showCloseBtn = false,
  height = '25%',
  clickOutsideToClosePanel = false,
  content,
  radius = 16,
  titleStyle = {},
  styleCustom = {},
  shadowTitle = false,
  backgroundPanel = '#F5F6F7',
  position = 0,
  animate = true,
  positionAnimatePop = -200,
  durationPop = 300,
  noTransparent = false,
}) => {
  const popAnim = useRef(
    new Animated.Value(
      animate ? (height === '100%' ? -1000 : positionAnimatePop) : position,
    ),
  ).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(popAnim, {
      toValue: position,
      // duration: animateType === 'full' ? 800 : durationPop,
      duration: height === '100%' ? 500 : durationPop,
      useNativeDriver: false,
    }).start();
  }, [popAnim, position]);

  // useBackHandler(() => closePanel());

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={() => closePanel()}
      style={[styles.wrapper, styleCustom]}>
      {clickOutsideToClosePanel ? (
        <TouchableOpacity
          style={[styles.top_section, {opacity: noTransparent ? 0 : 0.4}]}
          onPress={() => closePanel()}
        />
      ) : (
        <View
          style={[styles.top_section, {opacity: noTransparent ? 0 : 0.4}]}
          onPress={() => closePanel()}
        />
      )}

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            height: height,
            borderTopLeftRadius: radius ? radius : 0,
            borderTopRightRadius: radius ? radius : 0,
            backgroundColor: backgroundPanel,
            // bottom: position,
            bottom: popAnim,
          },
        ]}
        entering={SlideInDown.duration(height === '100%' ? 600 : 400)}
        exiting={SlideOutDown.duration(400)}>
        {withHeader ? (
          <View
            style={[
              gStyles.contentHeader,
              shadowTitle ? gStyles.shadowTitle : null,
            ]}>
            {showCloseBtn ? (
              <TouchableOpacity onPress={() => closePanel()}>
                <IconCloseCircle fill={'#9AA2B1'} width={24} height={24} />
              </TouchableOpacity>
            ) : null}
            {title ? (
              <Text style={[styles.contentTitle, titleStyle]}>{title}</Text>
            ) : null}
          </View>
        ) : null}
        {content}
      </Animated.View>
    </Modal>
  );
};
export default BottomPanelModal;
