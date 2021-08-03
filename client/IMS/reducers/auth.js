
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
    isAuthenticated: false
}


const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADMIN_LOGIN_SUCCESS:
        case EMPLOYEE_LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload)
            return {
                ...state, token: action.payload, isAuthenticated: true, loading: false
            }

        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false
            }

        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state, token: null, user: null, isAuthenticated: false, loading: false
            }
        default:
            return state
    }
}


export default authReducer