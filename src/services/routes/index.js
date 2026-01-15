/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUserToken} from '../redux/action';
import {StackAuthScreen, StackLoggedScreen} from './stack';

const Routes = () => {
  const {isLogin, token} = useSelector(reducer => reducer.global);
  const [userToken, setUserToken] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserToken()
      .then(tkn => {
        //ada tkn di async storage
        if (tkn) {
          // console.log('ada token', token);
          dispatch({type: 'SET_TOKEN', value: tkn});
          setTimeout(() => {
            setUserToken(true);
          }, 1000);
          // console.log('ada token: ', tkn);

          //check koneksi internetnya
        } else {
          console.log('kdada token');
          setUserToken(false);
        }
      })
      .catch(err => {
        console.log('token tak dapat: ');
        console.log(err);
        setUserToken(false);
      });
  }, [isLogin, token]);

  if (!userToken) {
    return <StackAuthScreen />;
  } else {
    return <StackLoggedScreen />;
  }
};

export default Routes;
