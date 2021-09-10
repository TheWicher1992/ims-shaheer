import { combineReducers } from 'redux'
import auth from './auth'
import productFilterReducer from './productFilters'
import saleFilterReducer from './saleFilters'
import purchaseFilterReducer from './purchaseFilters'
import stockFilters from './stockFilters'

export default combineReducers({
    auth,
    productFilters: productFilterReducer,
    saleFilters: saleFilterReducer,
    purchaseFilters: purchaseFilterReducer,
    stockFilters: stockFilters
})
