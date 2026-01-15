import {Image} from 'react-native-compressor';
import {
  stat,
  readFileAssets,
  MainBundlePath,
} from 'react-native-fs';
import {Image as Img, Platform} from 'react-native';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import Marker from 'react-native-image-marker';

export const getImageSize = async image =>
  new Promise(resolve => {
    Img.getSize(image, (width, height) => {
      resolve({width, height});
    });
  });

export const getSizeFile = async path => {
  const filePath = path;
  // var filename = filePath.replace(/^.*[\\\/]/, '');
  // const statResult = await stat(filePath);
  const statResult = await stat(filePath);
  // console.log('statResult', statResult);
  return statResult.size;
};

function imageOrientation(width, height) {
  if (width > height) {
    return 'landscape';
  } else if (width < height) {
    return 'portrait';
  } else {
    return 'even';
  }
}

export const insertWatermark = async (img, width, height) => {
  // you can also add watermark to a photo with static images

  const orientation = imageOrientation(width, height);

  let watermarkPath =
    Platform.OS === 'android'
      ? await readFileAssets(`${orientation}-watermark.png`, 'base64')
      : await MainBundlePath(
          `src/assets/img/${orientation}-watermark.png`,
          'base64',
        );

  watermarkPath = `data:image/png;base64, ${watermarkPath}`;

  let resizedWatermark = await ImageResizer.createResizedImage(
    watermarkPath,
    width,
    height,
    'PNG',
    100,
    0,
    undefined,
    false,
    {
      mode: 'stretch',
      // onlyScaleDown: true,
    },
  ).catch(err => console.log('err resized watermark', err));
  // console.log('resizedWatermark', resizedWatermark);
  return Marker.markImage({
    src: img,
    markerSrc: resizedWatermark.uri,
    position: 'center', // topLeft, topCenter,topRight, bottomLeft, bottomCenter, bottomRight, center
    scale: 1,
    markerScale: 1,
    quality: 100,
  })
    .then(path => {
      console.log('path', path);
      return Platform.OS === 'android' ? 'file://' + path : path;
    })
    .catch(err => {
      console.log('err', err);
    });
};

export const resizeImage = async (path, fileName) => {
  const result = await Image.compress(path, {
    compressionMethod: 'manual',
    quality: 0.5,
  });

  // const fileSize = await getSizeFile(result);
  const {width, height} = await getImageSize(result); //get new width

  const img = await insertWatermark(result, width, height);

  return img;
};
