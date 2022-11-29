import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header, ListItem} from '@rneui/themed';
import {get} from 'siap/src/api';
import auth_store, {removeToken} from 'siap/src/store/auth';

class PaketScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      tahun: 2022,
      halaman: 1,
      list: [],
      total: 0,
      last: true,
    };

    this.loadPaket();
  }

  loadPaket() {
    get({
      url: '/paket/' + this.state.tahun + '/' + this.state.halaman,
      success: data => {
        this.setState({
          loading: false,
          list: data.list,
          total: data.total,
          last: data.last,
        });
      },
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header
          centerComponent={{text: 'Paket'}}
          rightComponent={{
            text: 'logout',
            onPress: () => auth_store.dispatch(removeToken()),
          }}
        />
        <FlatList
          refreshing={this.state.loading}
          onRefresh={() => this.loadPaket()}
          data={this.state.list}
          renderItem={({index, item}) => {
            return (
              <ListItem
                key={index}
                bottomDivider
                onPress={() => {
                  this.props.navigation.navigate('detail_paket_screen', {
                    paket: item,
                  });
                }}>
                <ListItem.Content>
                  <ListItem.Title>
                    {item.kode} - {item.urai}
                  </ListItem.Title>
                  {/* <ListItem.Subtitle>Pagu: {item.pagu}</ListItem.Subtitle> */}
                </ListItem.Content>
              </ListItem>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

export default PaketScreen;
