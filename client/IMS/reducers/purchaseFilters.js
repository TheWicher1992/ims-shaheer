import {
    INCREMENT_PURCHASE_PAGE,
    PURCHASE_SET_MAX_QUANT,
    PURCHASE_RESET_MAX_QUANT,
    PURCHASE_SET_MAX_TOTAL,
    PURCHASE_RESET_MAX_TOTAL,
    PURCHASE_SET_PRODUCT,
    PURCHASE_RESET_PRODUCT,
    PURCHASE_SET_CLIENT,
    PURCHASE_RESET_CLIENT,
    PURCHASE_SET_PAYMENT,
    PURCHASE_RESET_PAYMENT,
    PURCHASE_SET_DATE,
    PURCHASE_RESET_DATE
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

export default purchaseFilterReducer = (state = initalSate, action) => {
    switch (action.type) {
        case INCREMENT_PURCHASE_PAGE:
            return {
                ...state, page: state.page + 1
            }
        case PURCHASE_SET_MAX_QUANT:
            return {
                ...state, maxQuantity: action.payload
            }
        case PURCHASE_RESET_MAX_QUANT:
            return {
                ...state, maxQuantity: '*'
            }
        case PURCHASE_SET_MAX_TOTAL:
            return {
                ...state, maxTotal: action.payload
            }
        case PURCHASE_RESET_MAX_TOTAL:
            return {
                ...state, maxTotal: '*'
            }
        case PURCHASE_SET_PRODUCT:
            return {
                ...state, product: action.payload
            }
        case PURCHASE_RESET_PRODUCT:
            return {
                ...state, product: '*'
            }
        case PURCHASE_SET_CLIENT:
            return {
                ...state, client: action.payload
            }
        case PURCHASE_RESET_CLIENT:
            return {
                ...state, client: '*'
            }
        case PURCHASE_SET_PAYMENT:
            return {
                ...state, payment: action.payload
            }
        case PURCHASE_RESET_PAYMENT:
            return {
                ...state, payment: '*'
            }
        case PURCHASE_SET_DATE:
            return {
                ...state, date: action.payload
            }
        case PURCHASE_RESET_DATE:
            return {
                ...state, date: '*'
            }
        default:
            return state;
    }
}