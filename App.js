import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { composeWithDevTools } from 'redux-devtools-extension'
import AuthLoadingScreen from './containers/AuthLoadingScreenContainer';
import Login from './containers/LoginContainer';
import GenreSelect from './containers/GenreSelectContainer';
import museReducer from './reducers/museReducer';


const persistConfig = {
  key: 'root14',
  storage,
};
const persistedReducer = persistReducer(persistConfig, museReducer);
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
const persistor = persistStore(store);


const AppStack = createStackNavigator({
  GenreSelect,
});
const AuthStack = createStackNavigator({
  Login,
});

const Navigation = createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default class App extends React.Component {
  renderLoading = () => (
    <View style={styles.container}>
      <ActivityIndicator size='large' />
    </View>
  )
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={this.renderLoading()} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
