import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../../../utils/helpers/number";
import { colors, gStyles } from "../../../utils/styles";

const { Container, Gap } = require("../../atoms");


const ItemTransaction = ({ transactionNumber, date, label, items, totalOffer }) => {
    return <View style={styles.card}>
        <View style={styles.top}>
            <View>
                <Text style={gStyles.textSmRegular}>{transactionNumber}</Text>
                <Gap height={4} />
                <Text style={gStyles.textSmRegular}>{date}</Text>
            </View>
            <Text style={[gStyles.textSmRegular, { color: colors.blue, padding: 4, backgroundColor: colors.softBlue, borderRadius: 8 }]}>{label}</Text>
        </View>
        <View style={styles.border} />
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={items}
            renderItem={(item) => {
                console.log(item);
                return <View style={styles.item}>
                    <Image source={{ uri: item.item?.image }} style={styles.image} resizeMode={'cover'} />
                    <Gap width={8} />
                    <View>
                        <Text style={[gStyles.textSmRegular, { color: colors.black }]}>{item.item?.name}</Text>
                        <View style={styles.item}>
                            <Text style={[gStyles.textSmRegular, { fontSize: 12 }]}>{item.item?.heavy} Kg</Text>
                            <Text style={[gStyles.textSmRegular, { fontSize: 16 }]}> • </Text>
                            <Text style={[gStyles.textSmRegular, { fontSize: 12 }]}>{formatCurrency(item.item?.price.toString())}</Text>
                        </View>
                    </View>
                    <Gap width={8} />
                </View>
            }}
            keyExtractor={(item) => item.id}
        />
        <View style={styles.border} />
        <View style={[styles.item, {justifyContent: 'space-between'}]}>
            <Text style={gStyles.textSmRegular}>Total Penawaran</Text>
            <Text style={[gStyles.textSmRegular, {color: colors.black}]}>{formatCurrency(totalOffer.toString())}</Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.neutral,
        padding: 12,
        marginVertical: 8
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    border: {
        width: '100%',
        height: 1,
        marginVertical: 12,
        backgroundColor: colors.neutral
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.neutral
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default ItemTransaction;