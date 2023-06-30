import Home from '../screens/Home';
import Search from '../screens/Search';
import MovieSuggestions from '../screens/MovieSuggestions';
import Login from '../screens/Login';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Error from '../screens/Errors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAppSelector } from '../redux/hooks';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  const {isLoggedIn} = useAppSelector(state => state.user)

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          drawerIcon: ({ focused, size }) => (
            <Icon
                name="home"
                size={size}
                color={focused ? '#7cc' : '#ccc'}
              />
          ),
        }}
      />
      <Drawer.Screen name="Search" component={Search} />

      <Drawer.Screen name="Movie Suggestions" options={{unmountOnBlur: true}} component={MovieSuggestions} />    
            
      <Drawer.Screen name="Login" component={Login} options={{
        title:isLoggedIn ? 'Logout':'Login'
      }} />
      <Drawer.Screen name="Errors" component={Error} />
    </Drawer.Navigator>
  );
}