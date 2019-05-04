import React from 'react';
import { LinearGradient } from 'expo';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { StyleSheet, Image, Text, TouchableOpacity, View, FlatList, ScrollView, Dimensions, Animated, RefreshControl } from 'react-native';
import Playlist from './Playlist';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      refreshing: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'PLAYLISTS',
      headerTitleStyle: {
        fontWeight: 'bold',
        letterSpacing: 2,
      },
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{ marginRight: 12 }}
        >
          <AntDesign name='user' size={24} />
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 2000,
    }).start();
  }

   _onRefresh = async () => {
    const { access_token, refresh_token } = this.props.auth;
    const { id: user_id } = this.props.user.profile;
    this.setState({ refreshing: true });
    await this.props.fetchPlaylists(access_token, refresh_token, user_id);
    this.setState({ refreshing: false });
  }

  renderRefreshControl = () => (
    <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
  )

  render() {
    let { fadeAnim } = this.state;
    return (
      <Animated.View style={[{ ...this.props.style, opacity: fadeAnim, }, styles.container]}>
        <View style={styles.playlistContainer}>
          <LinearGradient colors={['white', '#ffffff00']} style={styles.gradientTop} />
          {this.props.playlists.length ?
            <FlatList
              data={this.props.playlists}
              contentContainerStyle={styles.playlists}
              showsVerticalScrollIndicator={false}
              refreshControl={this.renderRefreshControl()}
              numColumns={2} renderItem={({ item, index }) => {
                return (
                  <Playlist item={item} index={index} name={item.name} count={item.trackCount} thumbnail={item.thumbnail} />
                )
              }}>
            </FlatList>
            :
            <ScrollView
              contentContainerStyle={styles.playlists}
              refreshControl={this.renderRefreshControl()}
            >
              <Image style={styles.createPlaylist} source={require('../assets/home/playlist.png')} />
              <Text style={styles.titleText}>CREATE YOUR FIRST PLAYLIST</Text>
              <Text style={styles.infoText}>Start by tapping the {<MaterialCommunityIcons name='play' size={14} />} button.</Text>
            </ScrollView>
          }
          <LinearGradient colors={['#ffffff00', 'white']} style={styles.gradientBottom} />
        </View>
        <TouchableOpacity style={styles.startButton} activeOpacity={0.9} onPress={() => alert('Let\'s get this bread')}>
          <MaterialCommunityIcons name='play' size={64} style={{ color: '#fff' }} />
        </TouchableOpacity>
        <Text style={styles.start}>START</Text>
        <View style={styles.oval} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    letterSpacing: 2,
  },
  createPlaylist: {
    width: 240,
    height: 262,
    marginTop: 24,
    marginBottom: 40
  },
  playlists: {
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  playlistContainer: {
    height: '70%',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  createContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradientTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 24,
    zIndex: 999
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    zIndex: 999
  },
  startButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 50,
    width: 100,
    height: 100,
    backgroundColor: '#7ae48c',
    bottom: Dimensions.get('window').width / 4.3,
    zIndex: 999,
    shadowOffset: { width: 0, height: 2, },
    shadowColor: 'grey',
    shadowOpacity: 0.5,
  },
  start: {
    position: 'absolute',
    fontSize: 16,
    letterSpacing: 2,
    bottom: Dimensions.get('window').width / 7.5,
    zIndex: 999
  },
  oval: {
    position: 'absolute',
    bottom: -1 * Dimensions.get('window').width * 1.65,
    width: Dimensions.get('window').width * 2,
    height: Dimensions.get('window').width * 2,
    borderRadius: Dimensions.get('window').width,
    borderWidth: 0.5,
    borderColor: 'rgba(128,128,128,0.1)',
    backgroundColor: 'rgba(245,245,245,0.5)',
  },
});