import {View, Image, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Box, IconLoading} from '../../../assets';

const ImageProduct = ({url, style}) => {
  const [ImageUrl, setImageUrl] = useState(null);
  const [LoadImage, setLoadImage] = useState(true);
  const [ImageError, setImageError] = useState(false);

  // console.log('url', url);
  useEffect(() => {
    // console.log('url', url);
    checkUrlImage();
  }, [url]);

  function checkUrlImage() {
    if (url) {
      if (url.length > 0) {
        const photoUrl = url[0]?.photo_url;
        if (photoUrl) {
          // console.log('photo_url', photoUrl);
          // setImageUrl(
          //   'https://minio-api.codr-staging.id:9000/talasi-staging/assets/uploads/commoditie photo/28_20231003171332.jpg',
          // );
          setImageUrl(photoUrl);
          setImageError(false);
        } else {
          setImageError(true);
        }
      } else {
        setImageError(true);
      }
    } else {
      setImageError(true);
    }
    setLoadImage(false);
  }
  if (!url) {
    return <Image source={Box} style={[styles.image, style]} />;
    // return <Text>test</Text>;
  }
  return (
    <Image
      key={ImageUrl}
      source={
        LoadImage
          ? IconLoading
          : ImageError
          ? Box
          : ImageUrl
          ? {
              uri: ImageUrl,
            }
          : Box
      }
      onLoad={() => {
        // console.log('loaded image!');
      }}
      onLoadStart={() => {
        // console.log('load starting');
      }}
      onError={err => {
        setImageError(true);
        console.log('err', err);
      }}
      style={[styles.image, style]}
    />
  );
};

export default ImageProduct;

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    // zIndex: 2,
    // elevation: 2,
  },
});
