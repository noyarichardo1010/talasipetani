import {StyleSheet, Text, View, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

const Progress = ({step = 1, steps, height, backgroundColor, lineColor}) => {
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const reactive = useRef(new Animated.Value(-1000)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: reactive,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    reactive.setValue(-width + (width * step) / steps);
  }, [step, width]);

  return (
    <>
      <View
        onLayout={e => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
        style={[styles.wrapper, {height, backgroundColor}]}>
        <Animated.View
          style={[
            styles.line,
            {
              height,
              backgroundColor: lineColor,
              transform: [
                {
                  translateX: animatedValue,
                },
              ],
            },
          ]}
        />
      </View>
    </>
  );
};

export default Progress;

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  line: {
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
