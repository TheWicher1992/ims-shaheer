import {
    ADMIN_LOGIN_SUCCESS,
    EMPLOYEE_LOGIN_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGOUT
} from '../actions/types'


export const login = (userName, password) => async dispatch => {

}


export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get(`/api/auth`)
        dispatch({
            type: USER_LOADED,
            payload: res.data.user
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}