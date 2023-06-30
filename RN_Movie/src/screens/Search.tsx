import { useState, memo } from 'react';
import { FlatList, View, TextInput, StyleSheet, TouchableOpacity, Image, Text, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import { searchMovie } from '../services/movieApi';
import { IMAGE_URL } from '../common/constanst';
import StarRating from "react-native-star-rating-widget";
import dateFormat from "dateformat";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../paramsNavigation/rootStackParamList';


type Props = {
    item: any;
}

export default function Search() {
    const mWidth = Dimensions.get('screen').width
    const [text, onChangeText] = useState('');
    const [searchData, setSearchData] = useState<any[]>([]);
    const [rating, setRating] = useState(0);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const onSubmit = async () => {
        const data = await searchMovie(text)
        setSearchData(data)
    }

    const ViewSearchResult = () => {
        if (searchData && searchData.length == 0) {
            return <Text>No result</Text>
        } else {
            return <FlatList
                data={searchData}
                renderItem={({ item }) => <ItemMemo item={item} />}
                keyExtractor={item => item.id}
            />
        }
    }

    const ItemMemo = memo(({ item }: Props) => (
        <TouchableOpacity onPress={()=>navigation.navigate('Detail', {id: item.id})}>
            <View style={{ padding: 5, 
                flexDirection: 'row', 
                alignItems: 'center', 
                borderWidth: 1, 
                borderColor:'blue' }}>
                <Image
                    style={{ height: 160, width: 110, borderRadius: 10 }}
                    source={{ uri: IMAGE_URL + item.poster_path }}
                    resizeMode='cover'
                />
                <View style={{ margin: 5, width: mWidth - 120 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
                    <Text>Release date: {dateFormat(item.release_date, "dd/mm/yyyy")}</Text>
                    <StarRating
                        rating={item.vote_average / 2}
                        onChange={setRating}
                    />
                </View>
            </View>
        </TouchableOpacity>
    ));

    return (
        <>
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeText}
                        value={text}
                        placeholder='Search movie'
                    />
                </View>
                <TouchableOpacity onPress={onSubmit}>
                    <Icon name="search1" size={40} />
                </TouchableOpacity>
            </View>

            <View>
                <ViewSearchResult />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 0.5,
        padding: 5,
        borderRadius: 15,
    },
    form: {
        flexBasis: 'auto',
        flexGrow: 1,
        paddingRight: 8,
    }
});