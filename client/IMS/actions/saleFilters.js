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
} from './types'



export const incrementSalePage = () => dispatch => {
    dispatch({
        type: INCREMENT_SALE_PAGE
    })
}

//max quant
export const setSaleMaxQuant = (maxQuant) => dispatch => {
    dispatch({
        type: SALE_SET_MAX_QUANT,
        payload: maxQuant
    })
}

export const resetSaleMaxQuant = () => dispatch => {
    dispatch({
        type: SALE_RESET_MAX_QUANT,
    })
}

//max total
export const setSaleMaxTotal = (maxTotal) => dispatch => {
    dispatch({
        type: SALE_SET_MAX_TOTAL,
        payload: maxTotal
    })
}

export const resetSaleMaxTotal = () => dispatch => {
    dispatch({
        type: SALE_RESET_MAX_TOTAL,
    })
}

//product
export const setSaleProduct = (Product) => dispatch => {
    dispatch({
        type: SALE_SET_PRODUCT,
        payload: Product
    })
}

export const resetSaleProduct = () => dispatch => {
    dispatch({
        type: SALE_RESET_PRODUCT,
    })
}

//client
export const setSaleClient = (client) => dispatch => {
    dispatch({
        type: SALE_SET_CLIENT,
        payload: client
    })
}

export const resetSaleClient = () => dispatch => {
    dispatch({
        type: SALE_RESET_CLIENT,
    })
}

//payment
export const setSalePayment = (payment) => dispatch => {
    dispatch({
        type: SALE_SET_PAYMENT,
        payload: payment
    })
}

export const resetSalePayment = () => dispatch => {
    dispatch({
        type: SALE_RESET_PAYMENT,
    })
}

//date
export const setSaleDate = (date) => dispatch => {
    dispatch({
        type: SALE_SET_DATE,
        payload: date
    })
}

export const resetSaleDate = () => dispatch => {
    dispatch({
        type: SALE_RESET_DATE,
    })
}