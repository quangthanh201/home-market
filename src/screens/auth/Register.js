import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
// import Logo from '../components/Logo'
// import Header from '../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import { userValidator } from '../../helpers/userValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { emailValidator } from "../../helpers/emailValidator";
import {showMessage} from "react-native-flash-message";
import { config } from '../../../config'

export default function Register({ navigation }) {
    const [username, setUsername] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [email, setEmail] = useState({ value: '', error: '' })
    const [error, setError] = useState({ value: false})

    const onLoginPressed = () => {
        const usernameError = userValidator(username.value)
        const passwordError = passwordValidator(password.value)

        if (usernameError || passwordError) {
            setUsername({ ...username, error: usernameError })
            setPassword({ ...password, error: passwordError })
            return
        }
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'Dashboard' }],
        // })

        let formdata = new FormData();
        formdata.append("username", username.value)
        formdata.append("password", password.value)
        formdata.append("email", email.value)
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            body: formdata
        };
        fetch( config() + "auth/signup", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    setError({ value: true });
                } else {
                    setUsername({value: ''});
                    setPassword({value: ''});
                    setEmail({value: ''})
                    setError({ value: false });
                    showMessage({
                        message: "????ng k?? th??nh c??ng",
                        type: "success",
                    });
                    navigation.navigate('Login')
                }
            })
            .catch(error =>  {

                }
            );
    }

    return (
        <Background>
            {
                (error.value) ? (
                    <Text style={styles.loginError}>T??i kho???n ???? t???n t???i</Text>
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
            <Button mode="contained" onPress={onLoginPressed}>
                ????ng k??
            </Button>
            <View style={styles.row}>
                <Text>B???n ???? c?? t??i kho???n? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>????ng nh???p</Text>
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
    }
})
