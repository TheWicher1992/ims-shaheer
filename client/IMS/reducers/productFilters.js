import {
    INCREMENT_PROD_PAGE,
    PROD_RESET_BRAND,
    PROD_RESET_COLOUR,
    PROD_RESET_DATE,
    PROD_RESET_PRICE,
    PROD_RESET_QUANT,
    PROD_RESET_WARE,
    PROD_SET_BRAND,
    PROD_SET_COLOUR,
    PROD_SET_DATE,
    PROD_SET_PRICE,
    PROD_SET_QUANT,
    PROD_SET_WARE
} from '../actions/types'



const initialState = {
    page: 1,
    colour: '*',
    brand: '*',
    ware: '*',
    date: '*',
    quantity: '*',
    price: '*',
    sort: '*',
    sortBy: '*'
}



export default productFilterReducer = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT_PROD_PAGE:
            return {
                ...state, page: state.page + 1
            }
        case PROD_SET_BRAND:
            return {
                ...state, brand: action.payload
            }
        case PROD_RESET_BRAND:
            return {
                ...state, brand: '*'
            }
        case PROD_SET_COLOUR:
            return {
                ...state, colour: action.payload
            }
        case PROD_RESET_COLOUR:
            return {
                ...state, colour: '*'
            }
        case PROD_SET_DATE:
            return {
                ...state, date: action.payload
            }
        case PROD_RESET_DATE:
            return {
                ...state, date: '*'
            }
        case PROD_SET_PRICE:
            return {
                ...state, price: action.payload
            }
        case PROD_RESET_PRICE:
            return {
                ...state, price: '*'
            }
        case PROD_SET_WARE:
            return {
                ...state, ware: action.payload
            }
        case PROD_RESET_WARE:
            return {
                ...state, ware: '*'
            }
        case PROD_SET_QUANT:
            return {
                ...state, quantity: action.payload
            }
        case PROD_RESET_QUANT:
            return {
                ...state, quantity: '*'
            }
        default:
            return state
    }
}