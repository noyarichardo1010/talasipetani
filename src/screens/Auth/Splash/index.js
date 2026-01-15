import React, {useEffect} from 'react';
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {BGSplash, Logo} from '../../../assets';
import {Container} from '../../../components';
import {getUserToken} from '../../../services/redux/action';

const {height} = Dimensions.get('window');

const Splash = ({navigation}) => {
  useEffect(() => {
    getUserToken()
      .then(token => {
        console.log('token', token);
        if (!token) {
          setTimeout(() => {
            navigation.replace('Login');
          }, 1000);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Container>
      <View style={styles.wrapper}>
        <ImageBackground
          source={BGSplash}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <Image source={Logo} style={styles.logo} />
        </ImageBackground>
      </View>
    </Container>
  );
};

export default Splash;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: height,
  },
  logo: {
    width: 172,
    height: 64,
  },
  backgroundImage: {
    width: '100%',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
