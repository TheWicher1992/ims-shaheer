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
} from './types'



export const incrementPurchasePage = () => dispatch => {
    dispatch({
        type: INCREMENT_PURCHASE_PAGE
    })
}

//max quant
export const setPurchaseEMaxQuant = (maxQuant) => dispatch => {
    dispatch({
        type: PURCHASE_SET_MAX_QUANT,
        payload: maxQuant
    })
}

export const resetPurchaseMaxQuant = () => dispatch => {
    dispatch({
        type: PURCHASE_RESET_MAX_QUANT,
    })
}

//max total
export const setPurchaseMaxTotal = (maxTotal) => dispatch => {
    dispatch({
        type: PURCHASE_SET_MAX_TOTAL,
        payload: maxTotal
    })
}

export const resetPurchaseMaxTotal = () => dispatch => {
    dispatch({
        type: PURCHASE_RESET_MAX_TOTAL,
    })
}

//product
export const setPurchaseProduct = (Product) => dispatch => {
    dispatch({
        type: PURCHASE_SET_PRODUCT,
        payload: Product
    })
}

export const resetPurchaseProduct = () => dispatch => {
    dispatch({
        type: PURCHASE_RESET_PRODUCT,
    })
}

//client
export const setPurchaseClient = (client) => dispatch => {
    dispatch({
        type: PURCHASE_SET_CLIENT,
        payload: client
    })
}

export const resetPurchaseClient = () => dispatch => {
    dispatch({
        type: PURCHASE_RESET_CLIENT,
    })
}

//payment
export const setPurchasePayment = (payment) => dispatch => {
    dispatch({
        type: PURCHASE_SET_PAYMENT,
        payload: payment
    })
}

export const resetPurchasePayment = () => dispatch => {
    dispatch({
        type: PURCHASE_RESET_PAYMENT,
    })
}

//date
export const setPurchaseDate = (date) => dispatch => {
    dispatch({
        type: PURCHASE_SET_DATE,
        payload: date
    })
}

export const resetPurchaseDate = () => dispatch => {
    dispatch({
        type: PURCHASE_RESET_DATE,
    })
}