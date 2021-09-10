
import {
  STOCK_REMOVE_PRODUCT,
  STOCK_RESET_PRODUCT,
  STOCK_SET_PRODUCT,
  STOCK_REMOVE_WARE,
  STOCK_RESET_WARE,
  STOCK_SET_WARE,
  STOCK_RESET_QUANT,
  STOCK_SET_QUANT,
  STOCK_CLEAR_ALL
} from './types'


export const setSTOCKEMaxQuant = (maxQuant) => dispatch => {
  dispatch({
    type: STOCK_SET_QUANT,
    payload: maxQuant
  })
}

export const resetSTOCKMaxQuant = () => dispatch => {
  dispatch({
    type: STOCK_RESET_QUANT,
  })
}

export const clearSTOCKFilters = () => dispatch => {
  dispatch({
    type: STOCK_CLEAR_ALL
  })
}


export const setSTOCKWare = (WareID) => dispatch => {
  dispatch({
    type: STOCK_SET_WARE,
    payload: WareID
  })
}
export const resetSTOCKWare = () => dispatch => {
  dispatch({
    type: STOCK_RESET_WARE,
  })
}
export const removeSTOCKWare = (WareID) => dispatch => {
  dispatch({
    type: STOCK_REMOVE_WARE,
    payload: WareID
  })
}



export const setSTOCKProduct = (Product) => dispatch => {
  dispatch({
    type: STOCK_SET_PRODUCT,
    payload: Product
  })
}
export const removeSTOCKProduct = (Product) => dispatch => {
  dispatch({
    type: STOCK_REMOVE_PRODUCT,
    payload: Product
  })
}
export const resetSTOCKProduct = () => dispatch => {
  dispatch({
    type: STOCK_RESET_PRODUCT,
  })
}

