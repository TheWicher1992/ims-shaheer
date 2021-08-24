import {
    ADMIN_LOGIN_SUCCESS,
    EMPLOYEE_LOGIN_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT
} from '../actions/types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken';
import { useNavigation } from '@react-navigation/native';
import * as RootNavigation from '../navigation/RootNavigation';
import { uri } from '../api.json'
export const logout = (navigation) => dispatch => {
    console.log(navigation)
    navigation.navigate({ routeName: 'Login' })
    // navigation.navigate('AdminLogin')
    dispatch({
        type: LOGOUT
    })
}

export const login = (
    userName,
    password,
    navigation,
    type = 'admin',
    setAlertTitle,
    setAlertMsg,
    show,
    setLoading
) => async dispatch => {
    console.log('login')
    setLoading(true)

    try {
        let formData = {
            userName,
            password,
            type
        }
        const res = await axios.post(`${uri}/api/auth/login`, formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        dispatch({
            type: type === 'admin' ? ADMIN_LOGIN_SUCCESS : EMPLOYEE_LOGIN_SUCCESS,
            payload: res.data.token
        })
        dispatch(loadUser(navigation))
    } catch (error) {

        // const err = error.response.data.errors[0]
        setAlertTitle('Invalid Credentials!')
        setAlertMsg('Username or Password was incorrect.')
        show()
        console.log(error)
        dispatch({
            type: LOGIN_FAIL
        })

    }

    setLoading(false)


}


export const loadUser = (navigation) => async dispatch => {
    let token = await AsyncStorage.getItem('token')
    // const navigation = useNavigation()
    console.log('load')
    console.log('toke in ->', token)
    // if (token) {
    setAuthToken(token)
    // }
    console.log('header->', axios.defaults.headers.common['x-auth-token'])

    try {
        const res = await axios.get(`${uri}/api/auth`)
        dispatch({
            type: USER_LOADED,
            payload: res.data.user
        })

        console.log('USER TYPE', res.data.user.type)

        res.data.user.type === 'admin' ? navigation.navigate({ routeName: 'Dashboard' }) : navigation.navigate({ routeName: 'EmployeeDashboard' })
        // navigation.navigate({ routeName: 'main' })


    } catch (err) {
        console.log(err)
        dispatch({
            type: AUTH_ERROR
        })
    }
}