/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {IconCloseCircle} from '../../../assets';
import styles from './styles';
import {gStyles} from '../../../utils/styles';

const BottomPanel = ({
  closePanel,
  title,
  withHeader = false,
  showCloseBtn = false,
  height = '25%',
  clickOutsideToClosePanel = false,
  content,
  radius = 16,
  position = 0,
  titleStyle = {},
  styleCustom = {},
  animate = false,
  animateType = '',
  durationPop = 300,
  positionAnimatePop = -200,
  shadowTitle = false,
  backgroundPanel = '#F5F6F7',
}) => {
  const popAnim = useRef(
    new Animated.Value(
      animate
        ? animateType === 'full'
          ? -1000
          : positionAnimatePop
        : position,
    ),
  ).current; // Initial value for opacity: 0
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(popAnim, {
      toValue: position,
      duration: animateType === 'full' ? 800 : durationPop,
      useNativeDriver: false,
    }).start();
  }, [popAnim, position]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, position]);

  return (
    <Animated.View style={[styles.wrapper, {opacity: fadeAnim}, styleCustom]}>
      {clickOutsideToClosePanel ? (
        <TouchableOpacity
          style={styles.top_section}
          onPress={() => closePanel()}
        />
      ) : (
        <View style={styles.top_section} onPress={() => closePanel()} />
      )}

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            height: height,
            borderTopLeftRadius: radius ? radius : 0,
            borderTopRightRadius: radius ? radius : 0,
            bottom: popAnim,
            backgroundColor: backgroundPanel,
          },
        ]}>
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
export default BottomPanel;
