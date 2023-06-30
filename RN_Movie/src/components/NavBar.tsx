import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import { RootStackParamList } from "../paramsNavigation/rootStackParamList";


type Props = {
    main?: boolean
    onBack: () => void
}

export default function NavBar({ onBack, main = false }: Props) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    const navigateToSearch= ()=>{
        navigation.navigate('Search')
    }

    return (
        <SafeAreaView>
            {main ? (
                <View style={styles.mainNavbar}>                    
                    <Image
                        style={{height:70, width:90}}
                        source={require('../../assets/images/logomovie.png')}
                    />
                    <TouchableOpacity onPress={navigateToSearch}>
                        <Icon name="search1" size={45} color='white' />
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <TouchableOpacity onPress={onBack}>
                        <Icon name="back" size={45} color='white' />
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainNavbar:{
        flex:1, 
        flexDirection: 'row', 
        justifyContent:'space-between',
        padding: 10,
        alignItems: 'center'
    }
})