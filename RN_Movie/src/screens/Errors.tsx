import { Button, View, StyleSheet } from 'react-native'
import axios from "axios";
import { BASE_URL_MYSERVER } from '../common/constanst';
import { useState } from 'react';
import ValidationErrors from '../components/ValidationErrors';
import Toast from 'react-native-toast-message';

export default function Errors() {
    const getNotfound = async () => {
        try {
            const res = await axios.get(`${BASE_URL_MYSERVER}Errors/not-found`)
            console.log(res)
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: '404',
                text2: 'not found'
            });
        }

    }

    const getBadRequest = async () => {
        try {
            const res = await axios.get(`${BASE_URL_MYSERVER}Errors/bad-request`)
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: '400',
                text2: 'BadRequest'
            });
        }

    }

    const getServerError = async () => {
        try {
            const res = await axios.get(`${BASE_URL_MYSERVER}Errors/server-error`)
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: '500',
                text2: 'ServerError'
            });
        }
    }

    const getUnauthorised = async () => {
        try {
            const res = await axios.get(`${BASE_URL_MYSERVER}Errors/unauthorised`)
        } catch (e) {
            Toast.show({
                type: 'error',
                text1: '401',
                text2: 'ServerError'
            });
        }
    }

    const getValidationError = async () => {
        try {
            const res = await axios.post(`${BASE_URL_MYSERVER}Errors/validation-error`, {})
        } catch (e: any) {
            Toast.show({
                type: 'error',
                text1: '400',
                text2: e.response.data.message
            });
            console.log(e);
            setErrors(e.response.data.errors);
        }
    }

    const showToastr = () => {
        Toast.show({
            type: 'error',
            text1: '400',
            text2: 'Day la loi'
        });
    }

    const [errors, setErrors] = useState(null);
    return (
        <>
            <View>
                <Button title='not-found' onPress={getNotfound} />
                <Button title='bad-request' onPress={getBadRequest} />
                <Button title='server-error' onPress={getServerError} />
                <Button title='unauthorised' onPress={getUnauthorised} />
                <Button title='validation-error' onPress={getValidationError} />
                <Button title='show toastr' onPress={showToastr} />
            </View>
            {errors && <ValidationErrors errors={errors} />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 6
    }
});