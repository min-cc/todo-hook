import {createSlice} from '@reduxjs/toolkit';

const auToken = createSlice({
  name : 'auToken',
  initialState: '',
  reducers: {
    // actions
    getToken: (state, action) =>{ 
      state = action.payload
      console.log(state);
    }
  }
})

const { reducer, actions} = auToken
export const {getToken} = actions
export default reducer