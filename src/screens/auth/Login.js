import React, {useEffect, useState} from 'react'
import {TouchableOpacity, StyleSheet, View, Image} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import { Block } from "galio-framework";
// import Logo from '../components/Logo'
// import Header from '../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import { userValidator } from '../../helpers/userValidator'
import { showMessage, hideMessage } from "react-native-flash-message";
import { passwordValidator } from '../../helpers/passwordValidator'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actions from '../../state/actions'
import { connect, useDispatch, useSelector } from "react-redux";
import { createStore } from 'redux'
import userReducers from "../../state/reducers/userReducers";
import helpers from "../../store/helper";
import { config } from '../../../config'

function LoginScreen({ navigation }) {
    // const dispatch = useDispatch()
  const [username, setUsername] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
    const [error, setError] = useState({ value: false})
    const [islogin, setIslogin] = useState({ value: false })
    const [name, setName] = useState({ value: ''})

  const onLoginPressed = () => {
    const usernameError = userValidator(username.value)
    const passwordError = passwordValidator(password.value)

    if (usernameError || passwordError) {
      setUsername({ ...username, error: usernameError })
      setPassword({ ...password, error: passwordError })
      return
    }

      let formdata = new FormData();
      formdata.append("username", username.value)
      formdata.append("password", password.value)
      var requestOptions = {
          method: 'POST',
          redirect: 'follow',
          body: formdata
      };
      fetch( config() + "auth/login", requestOptions)
          .then(response => response.json())
          .then(result => {
              if (result.error) {
                  setError({ value: true });
              } else {
                  helpers.updateState(updateUser(result.token))
                  // store.dispatch(updateUser(result.token))
                  setUsername({value: ''});
                  setPassword({value: ''});
                  setError({ value: false });
                  setIslogin({ value: true})
                  setName({value: result.user.username})
                  showMessage({
                      message: "????ng nh???p th??nh c??ng",
                      type: "success",
                  });
                  navigation.navigate('Home');
              }
          })
          .catch(error =>  {
                console.log('error', error)
              }
          );
  }

  const updateUser = (token) => {
      return {
          data: token,
          type: 'UPDATE_USER',
      }
  }

    const saveToken = async (token) => {
        try {
            await AsyncStorage.setItem('token', token, function () {
                console.log(getUserToken())
            })
        } catch (error) {
            console.log(error.message);
        }
    };

    const getUserToken = async () => {
        let token = '';
        try {
            token = await AsyncStorage.getItem('token');
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
        return token;
    }

  return (
      <Background>
          {
              (error.value) ? (
                      <Text style={styles.loginError}>T??i kho???n ho???c m???t kh???u kh??ng ch??nh x??c</Text>
              ) : (
                  <Text></Text>
              )
          }
          <TextInput
              label="T??i kho???n"
              returnKeyType="next"
              value={username.value}
              onChangeText={(text) => setUsername({ value: text, error: '' })}
              error={!!username.error}
              errorText={username.error}
              autoCapitalize="none"
          />
          <TextInput
              label="M???t kh???u"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: '' })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
          />
          <View style={styles.forgotPassword}>
              <TouchableOpacity
                  onPress={() => navigation.navigate('ForgotPassword')}
              >
                  <Text style={styles.forgot}>Qu??n m???t kh???u?</Text>
              </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={onLoginPressed}>
              ????ng nh???p
          </Button>
          <View style={styles.row}>
              <Text>B???n ch??a c?? t??i kho???n? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.link}>????ng k??</Text>
              </TouchableOpacity>
          </View>
      </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
    loginError: {
      color: "#FF0000"
    },
    imageContainer: {
        borderRadius: 3,
        elevation: 1,
        overflow: 'hidden'
    },
    nameStyle: {
      fontSize: 20
    }
})

const mapStateToProps = (state) => {
    return {
        user: state.userReducers
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateToken: (token) => {
            dispatch(actions.updateUser(token))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
