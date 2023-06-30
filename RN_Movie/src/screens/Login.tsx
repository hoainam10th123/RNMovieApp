import { Formik } from 'formik';
import * as yup from 'yup';
import { View, Image, TextInput, StyleSheet, Dimensions, Button, Text } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../paramsNavigation/rootStackParamList';
import Toast from 'react-native-toast-message';
import { loginAction } from '../redux/actions/userAction';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Signout } from '../redux/reducers/userReducer';
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { createHubConnection, stopHubConnetion } from '../redux/reducers/presenceHubReducer';


const mWidth = Dimensions.get('screen').width

const loginValidationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is Required'),
    password: yup
        .string()
        .required('Password is required'),
})

export default function Login() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const { loading, isLoggedIn, message, user } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()


    const signOut = () => {
        dispatch(Signout())
        dispatch(stopHubConnetion())
        navigation.navigate('Home')
    }

    const onSubmitLogin = (data: any) => {
        dispatch(loginAction(data))        
    }

    // su dung useEffect, de show loi khi call tu api, ko nen show toastr trong onSubmitLogin
    useEffect(() => {
        if (message !== '200' && message !== '') {
            Toast.show({
                type: 'error',
                text1: message,
            });
        } else if (message !== '') {
            navigation.navigate('Home')
            dispatch(createHubConnection(user!))
        }
    }, [message])

    const RootView = () => {
        if (isLoggedIn) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Icon name="checkcircle" size={80} color='green' />
                    <Text style={{ color: 'blue', fontSize: 30 }}>You are login</Text>
                    <Button title='Sign out' onPress={signOut} />
                </View>
            )
        } else {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image
                        style={{ height: 100, width: 120 }}
                        source={require('../../assets/images/logomovie.png')}
                    />

                    <View style={styles.form}>
                        <Formik
                            validationSchema={loginValidationSchema}
                            initialValues={{ username: '', password: '' }}
                            onSubmit={values => onSubmitLogin(values)}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                                <>
                                    <TextInput
                                        placeholder="Username"
                                        style={styles.input}
                                        onChangeText={handleChange('username')}
                                        onBlur={handleBlur('username')}
                                        value={values.username}
                                    />
                                    {(errors.username && touched.username) &&
                                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.username}</Text>
                                    }

                                    <TextInput
                                        placeholder="Password"
                                        style={styles.input}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        secureTextEntry={true}
                                    />
                                    {(errors.password && touched.password) &&
                                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
                                    }
                                    <Button onPress={handleSubmit} title="Login" disabled={!isValid} />
                                </>
                            )}
                        </Formik>
                    </View>
                </View>
            )
        }
    }

    return <RootView />
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        color: 'gray',
        width: mWidth - 20
    },
    form: {
        flexBasis: 'auto',
        flexGrow: 1,
    }
});