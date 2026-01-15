import React, {useEffect, useRef} from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Text, View} from 'react-native';
import {gStyles} from '../../../../utils/styles';

const GooglePlacesInput = ({
  region,
  setRegion,
  placeholder,
  containerStyle,
  inputTextStyle,
  rightButton,
  leftButton,
}) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText('');
  }, []);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      renderLeftButton={() => leftButton(ref.current)}
      renderRightButton={rightButton}
      placeholder={placeholder}
      textInputProps={{
        clearButtonMode: 'never',
      }}
      fetchDetails={true}
      GooglePlacesSearchQuery={{
        rankby: 'distance',
      }}
      renderRow={rowData => {
        // console.log('rowData', rowData);
        const title = rowData.structured_formatting.main_text;
        const address = rowData.structured_formatting.secondary_text;
        return (
          <View>
            <Text style={gStyles.text(14, '400', '#687083')}>
              {title} {address}
            </Text>
          </View>
        );
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        // console.log(data, details);
        setRegion({
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
          description: data?.description,
        });
      }}
      query={{
        key: 'AIzaSyDoejUQ6JR84D8Od0W-tBLlYURoi7mU27A',
        language: 'en',
        types: 'establishment',
        radius: 30000,
        location: `${region.latitude}, ${region.longitude}`,
      }}
      styles={{
        container: containerStyle,
        // listView: {backgroundColor: 'black'},
        // textInputContainer: {
        //   position: 'relative',
        // },
        textInput: {
          color: '#687083',
          fontSize: 14,
        },
        // predefinedPlacesDescription: {
        //   color: '#1faadb',
        // },
      }}
    />
  );
};

export default GooglePlacesInput;
