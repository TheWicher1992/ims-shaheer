import {
    INCREMENT_SALE_PAGE,
    SALE_SET_MAX_QUANT,
    SALE_RESET_MAX_QUANT,
    SALE_SET_MAX_TOTAL,
    SALE_RESET_MAX_TOTAL,
    SALE_SET_PRODUCT,
    SALE_RESET_PRODUCT,
    SALE_SET_CLIENT,
    SALE_RESET_CLIENT,
    SALE_SET_PAYMENT,
    SALE_RESET_PAYMENT,
    SALE_SET_DATE,
    SALE_RESET_DATE
} from '../actions/types'

const initalSate = {
    maxQuantity: '*',
    maxTotal: '*',
    page: 1,
    product: '*',
    client: '*',
    payment: "*",
    date: '*'
}

export default saleFilterReducer = (state = initalSate, action) => {
    switch (action.type) {
        case INCREMENT_SALE_PAGE:
            return {
                ...state, page: state.page + 1
            }
        case SALE_SET_MAX_QUANT:
            return {
                ...state, maxQuantity: action.payload
            }
        case SALE_RESET_MAX_QUANT:
            return {
                ...state, maxQuantity: '*'
            }
        case SALE_SET_MAX_TOTAL:
            return {
                ...state, maxTotal: action.payload
            }
        case SALE_RESET_MAX_TOTAL:
            return {
                ...state, maxTotal: '*'
            }
        case SALE_SET_PRODUCT:
            return {
                ...state, product: action.payload
            }
        case SALE_RESET_PRODUCT:
            return {
                ...state, product: '*'
            }
        case SALE_SET_CLIENT:
            return {
                ...state, client: action.payload
            }
        case SALE_RESET_CLIENT:
            return {
                ...state, client: '*'
            }
        case SALE_SET_PAYMENT:
            return {
                ...state, payment: action.payload
            }
        case SALE_RESET_PAYMENT:
            return {
                ...state, payment: '*'
            }
        case SALE_SET_DATE:
            return {
                ...state, date: action.payload
            }
        case SALE_RESET_DATE:
            return {
                ...state, date: '*'
            }
        default:
            return state;
    }
}