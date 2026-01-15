import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  IconDot,
  IconLeftArrow,
  IconThumbsDown,
  IconThumbsUp,
} from '../../../../assets';
import {AppBar} from '../../../../components';
import styles from '../style';
import {gStyles} from '../../../../utils/styles';

const TentangAplikasi = ({navigation}) => {
  const dispatch = useDispatch();
  const {theme} = useSelector(reducer => reducer.global);

  return (
    <View style={styles.container}>
      <AppBar
        appBarColor={theme.backgroundColor}
        navigation={navigation}
        headerTextColor={theme.textColor}
        hideRightContent
        iconLeft={
          <IconLeftArrow width={20} height={20} fill={theme.textColor} />
        }
        title="Tentang Aplikasi"
        borderBottom
        borderBottomColor={theme.textColor}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: theme.backgroundColor,
        }}>
        <View
          style={[
            styles.wrapper,
            {
              backgroundColor: theme.backgroundColor,
            },
          ]}>
          <Text
            style={[
              gStyles.text(16, '700', '#313447'),
              gStyles.marginBottom(12),
            ]}>
            Lobortis elit tellus risus amet id ut aliquam.
          </Text>
          <Text
            style={[
              gStyles.text(14, '400', '#313447'),
              gStyles.marginBottom(12),
              gStyles.flex(0.8),
            ]}>
            Net crank way blue we. Product performance resources net strategies
            create vendor. As hear metal goalposts goalposts base synchronise.
          </Text>
          <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Last too quick search must up reality so.
            </Text>
          </View>
          <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Alarming idea die pole decisions proceduralize dunder see the.
            </Text>
          </View>
          <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Innovation us commitment it's no-brainer win 2 algorithm up
              circle.
            </Text>
          </View>

          <View style={styles.listItem}>
            <IconDot
              fill="#313447"
              width={7}
              height={7}
              style={[gStyles.marginRight(7), gStyles.marginTop(7)]}
            />
            <Text style={[gStyles.text(14, '400', '#313447'), gStyles.flex(1)]}>
              Leverage synergy your time scope eod strategic vec quarter.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TentangAplikasi;
