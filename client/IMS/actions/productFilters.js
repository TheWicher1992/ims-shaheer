
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
} from './types'

export const incrementProductPage = () => dispatch => {
    dispatch({
        type: INCREMENT_PROD_PAGE
    })
}

//brand
export const setProdBrand = (brandID) => dispatch => {
    dispatch({
        type: PROD_SET_BRAND,
        payload: brandID
    })
}
export const resetProdBrand = () => dispatch => {
    dispatch({
        type: PROD_RESET_BRAND,
    })
}

//colour
export const setProdColour = (ColourID) => dispatch => {
    dispatch({
        type: PROD_SET_COLOUR,
        payload: ColourID
    })
}
export const resetProdColour = () => dispatch => {
    dispatch({
        type: PROD_RESET_COLOUR
    })
}

//date
export const setProdDate = (date) => dispatch => {
    dispatch({
        type: PROD_SET_DATE,
        payload: date
    })
}
export const resetProdDate = () => dispatch => {
    dispatch({
        type: PROD_RESET_DATE,
    })
}

//price
export const setProdPrice = (PriceID) => dispatch => {
    dispatch({
        type: PROD_SET_PRICE,
        payload: PriceID
    })
}
export const resetProdPrice = () => dispatch => {
    dispatch({
        type: PROD_RESET_PRICE,
    })
}

//quantity
export const setProdQuant = (QuantID) => dispatch => {
    dispatch({
        type: PROD_SET_QUANT,
        payload: QuantID
    })
}
export const resetProdQuant = () => dispatch => {
    dispatch({
        type: PROD_RESET_QUANT,
    })
}



//warehouse
export const setProdWare = (WareID) => dispatch => {
    dispatch({
        type: PROD_SET_WARE,
        payload: WareID
    })
}
export const resetProdWare = () => dispatch => {
    dispatch({
        type: PROD_RESET_WARE,
    })
}