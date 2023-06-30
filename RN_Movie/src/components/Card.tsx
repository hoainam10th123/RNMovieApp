import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IMAGE_URL, placeholder } from "../common/constanst";
import { memo } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../paramsNavigation/rootStackParamList";



type Props = { item: any };

const CardMemo = memo(function Card({ item }: Props) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const navigateOnPress = () => {
        navigation.navigate('Detail', { id: item.id })
    }

    return (
        <TouchableOpacity onPress={navigateOnPress}>
            <View style={styles.container}>
                <Image
                    style={{ height: 200, width: 120, borderRadius: 10 }}
                    source={item.poster_path ? { uri: IMAGE_URL + item.poster_path } : placeholder}
                    resizeMode='cover'
                />
                <View style={styles.moneName}>
                    <Text style={{ color: 'white', fontSize: 20 }}>{item.title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 5,
        alignItems: 'center',
        height: 200,
    },
    moneName: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default CardMemo;