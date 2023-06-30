import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useEffect, useState } from 'react'
import { suggestMoviesAction } from '../redux/actions/suggestMoviesAction'
import StarRating from "react-native-star-rating-widget";
import dateFormat from "dateformat";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../paramsNavigation/rootStackParamList';
import { IMAGE_URL } from '../common/constanst';
import { setMovies } from '../redux/reducers/presenceHubReducer';



type Props = {
    item: any;
}

export default function MovieSuggestions() {
    const mWidth = Dimensions.get('screen').width
    const [rating, setRating] = useState(0);
    const { loading, movies, hubConnection } = useAppSelector(state => state.presenceHub)
    const dispatch = useAppDispatch()
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        // call api run job, suggest movie AI
        dispatch(suggestMoviesAction())

        // nhan event tu signalR server khi job ket thuc
        if (hubConnection) {
            hubConnection.on('OnReceiveMovies', movies => {
                dispatch(setMovies(movies))
            })
        }

    }, [])

    const ViewRoot = () => {
        if (movies.length == 0) {
            return <Text>No result</Text>
        } else {
            return <FlatList
                data={movies}
                renderItem={({ item }) => <Item item={item} />}
                keyExtractor={item => item.id}
            />
        }
    }

    const Item = ({ item }: Props) => (
        <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: item.id })}>
            <View style={{
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'blue'
            }}>
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
    )

    return (
        <>
            {!loading && (
                <View style={styles.container}>
                    <ViewRoot />
                </View>
            )}

            {loading && <ActivityIndicator style={styles.centerLoaded} size="large" color="#0000ff" />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerLoaded: {
        flex: 1,
        justifyContent: 'center'
    }
});