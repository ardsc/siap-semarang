import {createSlice, configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const removeTokenSessions = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log('remove server', error);
  }
};

const setTokenSessions = async token => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.log('set sessions', error);
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
  },
  reducers: {
    removeToken: state => {
      state.token = null;

      removeTokenSessions();
    },
    setToken: (state, action) => {
      state.token = action.payload.token;

      setTokenSessions(state.token);
    },
  },
});

export const {setToken, removeToken} = authSlice.actions;

export default configureStore({
  reducer: authSlice.reducer,
});
