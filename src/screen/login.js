import React, {Component} from 'react';
import {Header, Input, Button} from '@rneui/themed';
import {freePost} from 'siap/src/api';
import auth_store, {setToken} from 'siap/src/store/auth';
import {ALERT_TYPE, Dialog, Toast} from 'react-native-alert-notification';
import {SafeAreaView} from 'react-native-safe-area-context';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  login() {
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
          // textBody: '',
        });

        auth_store.dispatch(setToken({token: data.token}));
      },
      error: message => {
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
      <SafeAreaView style={{flex: 1}}>
        <Header centerComponent={{text: 'Login'}} />
        <Input
          placeholder="Username"
          onChangeText={username => this.setState({username})}
        />
        <Input
          placeholder="Password"
          onChangeText={password => this.setState({password})}
          secureTextEntry={true}
        />
        <Button onPress={() => this.login()}>Submit</Button>
      </SafeAreaView>
    );
  }
}

export default LoginScreen;
