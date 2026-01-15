/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Modal, Animated} from 'react-native';
import React from 'react';
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

const BottomPanelAnimated = ({
  closePanel,
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
}) => {
  return (
    <Animated.View
      style={[styles.wrapper, styleCustom]}
      entering={FadeIn}
      exiting={FadeOut.duration(500)}>
      {clickOutsideToClosePanel ? (
        <TouchableOpacity
          style={[styles.top_section, {opacity: 0.4}]}
          onPress={() => closePanel()}
        />
      ) : (
        <View
          style={[styles.top_section, {opacity: 0.4}]}
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
            bottom: position,
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
    </Animated.View>
  );
};
export default BottomPanelAnimated;
