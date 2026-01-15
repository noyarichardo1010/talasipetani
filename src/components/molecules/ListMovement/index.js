import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IconCircle, IconRightArrow, IconShipFill} from '../../../assets';
import {gStyles} from '../../../utils/styles';

const ListMovement = ({
  theme,
  onPress,
  status,
  price,
  vesselCode,
  vesselName,
  shipCode,
  shipName,
  destinationToName,
  destinationFromCode,
  destinationFromName,
  isWithDelayService,
  time,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.lmBtn}>
      <View
        style={[styles.lmWrapper, {backgroundColor: theme.backgroundColor}]}>
        <View
          style={[
            styles.lmCircleLeft,
            {backgroundColor: theme.secondaryBackgroundColor},
          ]}
        />
        <View
          style={[
            styles.lmCircleRight,
            {backgroundColor: theme.secondaryBackgroundColor},
          ]}
        />

        <View
          style={[
            styles.lmBorderDashedWrapper,
            {borderColor: theme.iconColor},
          ]}>
          <View
            style={[
              styles.lmBorderDashed,
              {backgroundColor: theme.backgroundColor},
            ]}
          />
        </View>
        <View style={styles.lmContentWrapper}>
          <View style={styles.lmContentTitle}>
            <Text
              style={[gStyles.text(18, '500', theme.headerBackgroundColor)]}>
              (RPG)
            </Text>
            <Text style={[gStyles.text(14, '400', theme.iconColor)]}>
              Rumpiang
            </Text>
          </View>
          <View style={styles.lmContentTitleCenter}>
            <View
              style={[
                styles.lmContentTitleLine,
                {
                  borderTopColor: theme.statusBarColor,
                },
              ]}
            />
            <View style={styles.lmContentTitleRightArrow}>
              <IconRightArrow
                width={12}
                height={12}
                fill={theme.statusBarColor}
              />
            </View>
            <View style={styles.lmContentTitleShip}>
              <IconShipFill
                width={20}
                height={20}
                fill={theme.statusBarColor}
              />
            </View>
            <View style={styles.lmContentTitleDescWrapper}>
              <View style={styles.lmContentTitleDesc}>
                <Text style={[gStyles.text(12, 'normal', theme.iconColor)]}>
                  Pandu
                </Text>
                <IconCircle width={6} height={6} fill={theme.iconColor} />
                <Text style={[gStyles.text(12, 'normal', theme.iconColor)]}>
                  20:00
                </Text>
              </View>
              {isWithDelayService ? (
                <Text style={[gStyles.text(10, '400', theme.iconColor)]}>
                  + jasa tunda
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.lmContentTitle}>
            <Text
              style={[gStyles.text(18, '500', theme.headerBackgroundColor)]}>
              (AYR)
            </Text>
            <Text style={[gStyles.text(14, '400', theme.iconColor)]}>
              B. Anyar
            </Text>
          </View>
        </View>

        <View style={styles.lmContentBodyWrapper}>
          <View style={styles.lmContentBodyLeft}>
            <Text
              style={[gStyles.text(18, '500', theme.headerBackgroundColor)]}>
              VN
            </Text>
            <Text style={[gStyles.text(14, '400', theme.iconColor)]}>
              Vessel Name
            </Text>
          </View>

          <View style={styles.lmContentBodyRight}>
            <Text
              style={[gStyles.text(18, '500', theme.headerBackgroundColor)]}>
              BN
            </Text>
            <Text style={[gStyles.text(14, '400', theme.iconColor)]}>
              Barge Name
            </Text>
          </View>
        </View>
        <View style={styles.lmContentFooterWrapper}>
          <View style={styles.lmContentFooter}>
            <View style={styles.lmPrice}>
              <Text style={[gStyles.text(14, '600', theme.statusBarColor)]}>
                {price ?? 'Rp. xxx.xxx'}
              </Text>
              <Text style={[gStyles.text(10, '400', theme.iconColor)]}>
                total service fee
              </Text>
            </View>
            <View
              style={[
                styles.lmStatus,
                {
                  backgroundColor:
                    status === 'done'
                      ? theme.bgSuccessColor
                      : status === 'waiting'
                      ? theme.bgWaitingColor
                      : status === 'canceled' || status === 'declined'
                      ? theme.bgErrorColor
                      : theme.bgWaitingColor,
                },
              ]}>
              <Text
                style={[
                  gStyles.text(14, '600', theme.textSuccessColor),
                  gStyles.capitalize,
                ]}>
                {status ?? 'status'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListMovement;

const styles = StyleSheet.create({
  lmBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  lmWrapper: {
    width: '95%',
    height: 170,

    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2.22,

    elevation: 1,
  },
  lmCircleLeft: {
    position: 'absolute',
    width: 25,
    height: 25,
    left: -12.5,
    borderRadius: 25,
    bottom: 45,
  },
  lmCircleRight: {
    position: 'absolute',
    right: -12.5,
    width: 25,
    height: 25,
    borderRadius: 25,
    bottom: 45,
  },
  lmBorderDashedWrapper: {
    height: 1,
    width: '90%',
    borderRadius: 1,
    borderWidth: 1,

    borderStyle: 'dashed',
    zIndex: 0,
    position: 'absolute',
    bottom: 55,
    left: 15,
  },
  lmBorderDashed: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 1,
    zIndex: 1,
  },
  lmContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  lmContentTitle: {display: 'flex', alignItems: 'center'},
  lmContentTitleCenter: {
    display: 'flex',
    flex: 0.75,
    position: 'relative',
    top: 15,
  },
  lmContentTitleLine: {borderTopWidth: 1},
  lmContentTitleShip: {position: 'absolute', left: '43.5%', top: -12},
  lmContentTitleRightArrow: {position: 'absolute', right: -5.5, top: -5.5},
  lmContentTitleDescWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: -12,
  },
  lmContentTitleDesc: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  lmContentBodyWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  lmContentBodyLeft: {display: 'flex', alignItems: 'flex-start'},
  lmContentBodyRight: {display: 'flex', alignItems: 'flex-end'},
  lmContentFooterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  lmContentFooter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  lmPrice: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  lmStatus: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});
