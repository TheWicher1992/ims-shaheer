
import {
    ADMIN_LOGIN_SUCCESS,
    EMPLOYEE_LOGIN_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT
} from '../actions/types'

const initialState = {
    token: null,
    user: null,
    loading: true,
    isAuthenticated: false,
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const authReducer = async (state = initialState, action) => {
    console.log('payload-->', action.payload)

    switch (action.type) {
        case ADMIN_LOGIN_SUCCESS:
        case EMPLOYEE_LOGIN_SUCCESS:
            await AsyncStorage.setItem('token', action.payload)
            return {
                ...state, token: action.payload, isAuthenticated: true, loading: false
            }

        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
            }

        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            await AsyncStorage.removeItem('token')
            return {
                ...state, token: null, user: null, isAuthenticated: false, loading: false
            }
        default:
            return state
    }
}


export default authReducer