import {configureStore} from '@reduxjs/toolkit';
import auToken from '../slices/auToken';

const rootReducer = {
  auToken,
}

const store = configureStore({
  reducer: rootReducer
})

export default store