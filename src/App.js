import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth_store, {setToken} from 'siap/src/store/auth';
import {ThemeProvider, createTheme} from '@rneui/themed';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from 'siap/src/screen/login';
import PaketScreen from 'siap/src/screen/paket';
import DetailPaketScreen from './screen/detail_paket';

const theme = createTheme({
  components: {
    Button: {
      raised: true,
    },
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading_session: true,
      authenticated: false,
    };

    this.reloadSessions();
  }

  componentDidMount() {
    this.unsubscribe = auth_store.subscribe(() => {
      let state = auth_store.getState();

      if (null != state.token) {
        this.setState({authenticated: true, loading: false});
      } else {
        this.setState({authenticated: false, loading: false});
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async reloadSessions() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        auth_store.dispatch(setToken({token: token}));
      } else {
        this.setState({loading: false});
      }
    } catch (error) {
      console.log('get sessions', error);
    }
  }

  render() {
    if (this.state.loading) {
      // splash screen
    } else {
      if (this.state.authenticated) {
        const Stack = createNativeStackNavigator();

        return (
          <AlertNotificationRoot>
            <SafeAreaProvider>
              <ThemeProvider theme={theme}>
                <NavigationContainer>
                  <Stack.Navigator
                    initialRouteName="paket_screen"
                    screenOptions={{headerShown: false}}>
                    <Stack.Screen name="paket_screen" component={PaketScreen} />
                    <Stack.Screen
                      name="detail_paket_screen"
                      component={DetailPaketScreen}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </ThemeProvider>
            </SafeAreaProvider>
          </AlertNotificationRoot>
        );
      } else {
        return (
          <AlertNotificationRoot>
            <SafeAreaProvider>
              <ThemeProvider theme={theme}>
                <LoginScreen />
              </ThemeProvider>
            </SafeAreaProvider>
          </AlertNotificationRoot>
        );
      }
    }
  }
}

export default App;
