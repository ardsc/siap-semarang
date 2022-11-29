import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Header, ListItem} from '@rneui/themed';
import {get} from 'siap/src/api';

class DetailPaketScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      paket: props.route.params.paket,
      bulan: [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ],
      progress: {
        realfisik: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        targetfisik: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        targetkeu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    };

    this.loadDetailPaket();
  }

  loadDetailPaket() {
    get({
      url: '/paket/' + this.state.paket.kode,
      success: data => {
        this.setState({
          loading: false,
          progress: {
            realfisik: Object.values(data.progress.realfisik),
            targetfisik: Object.values(data.progress.targetfisik),
            targetkeu: Object.values(data.progress.targetkeu),
          },
        });
      },
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Header
          leftComponent={{
            text: 'back',
            onPress: () => this.props.navigation.goBack(),
          }}
          centerComponent={{
            text: this.state.paket.kode + ' - ' + this.state.paket.urai,
          }}
        />
        <FlatList
          refreshing={this.state.loading}
          onRefresh={() => this.loadDetailPaket()}
          data={this.state.progress.realfisik}
          renderItem={({index, item}) => {
            return (
              <ListItem key={index} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{this.state.bulan[index]}</ListItem.Title>
                  <ListItem.Subtitle>
                    Realisasi Fisik: {this.state.progress.realfisik[index]}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    Target Fisik: {this.state.progress.targetfisik[index]}
                  </ListItem.Subtitle>
                  <ListItem.Subtitle>
                    Target Keuangan: {this.state.progress.targetkeu[index]}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

export default DetailPaketScreen;
