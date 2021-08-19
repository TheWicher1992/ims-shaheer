import { combineReducers } from 'redux'
import auth from './auth'
import productFilterReducer from './productFilters'


export default combineReducers({
    auth, productFilters: productFilterReducer
})
