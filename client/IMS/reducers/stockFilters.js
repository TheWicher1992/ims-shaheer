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
} from '../actions/types'

const initialState = {
  product: ['*'],
  ware: ['*'],
  stock: '*'
}


export default stockFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCK_SET_PRODUCT:
      return {
        ...state, product: [...state.product, action.payload]
      }
    case STOCK_REMOVE_PRODUCT:
      return {
        ...state, product: [...state.product.filter(id => id !== action.payload)]
      }
    case STOCK_RESET_PRODUCT:
      return {
        ...state, product: ['*']
      }
    case STOCK_SET_WARE:
      return {
        ...state, ware: [...state.ware, action.payload]
      }
    case STOCK_REMOVE_WARE:
      return {
        ...state, ware: [...state.ware.filter(id => id !== action.payload)]
      }
    case STOCK_RESET_WARE:
      return {
        ...state, ware: ['*']
      }
    case STOCK_SET_QUANT:
      return { ...state, stock: action.payload }
    case STOCK_RESET_QUANT:
      return { ...state, stock: '*' }
    case STOCK_CLEAR_ALL:
      return {
        product: ['*'],
        ware: ['*'],
        stock: '*'
      }

    default:
      return state;
  }
}
