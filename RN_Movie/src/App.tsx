/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from './components/NavBar';
import Detail from './screens/Detail';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from './paramsNavigation/rootStackParamList';
import MyDrawer from './components/MyDrawer';
import { Provider } from 'react-redux'
import { store } from './redux/store';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {

  return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Root">
            <Stack.Screen
              name="Root"
              component={MyDrawer} options={{
                header: (nav) => null
              }}
            />

            <Stack.Screen name="Detail" component={Detail} options={{
              headerTransparent: true,
              header: ({ navigation }) => <NavBar onBack={navigation.goBack} />
            }} />

          </Stack.Navigator>
        </NavigationContainer>

        <Toast />
      </Provider>
  );
}

export default App;
