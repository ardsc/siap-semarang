import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import {Input, Button} from '@rneui/themed';
import {freePost} from 'siap/src/api';
import auth_store, {setToken} from 'siap/src/store/auth';
import {ALERT_TYPE, Dialog, Toast} from 'react-native-alert-notification';
import {SafeAreaView} from 'react-native-safe-area-context';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      username: '',
      password: '',
    };
  }

  login() {
    this.setState({loading: true});
    freePost({
      url: '/login',
      data: {
        username: this.state.username,
        password: this.state.password,
      },
      success: data => {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Login Success',
        });
        this.setState({loading: false});

        auth_store.dispatch(setToken({token: data.token}));
      },
      error: message => {
        this.setState({loading: false});

        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Login Error',
          textBody: message,
        });

        this.setState({password: ''});
      },
    });
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Input
            placeholder="Username"
            onChangeText={username => this.setState({username})}
          />
          <Input
            placeholder="Password"
            onChangeText={password => this.setState({password})}
            secureTextEntry={true}
          />
          <Button loading={this.state.loading} onPress={() => this.login()}>
            Submit
          </Button>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Button size="sm" onPress={() => this.login()}>
            Login with QR Code
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

export default LoginScreen;
