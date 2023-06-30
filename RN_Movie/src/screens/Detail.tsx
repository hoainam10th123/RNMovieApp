
import { RouteProp, useRoute } from "@react-navigation/native";
import { Modal, ActivityIndicator, Image, ScrollView, StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useEffect, useState } from 'react';
import { getDetailMovieWithTrailer } from "../services/movieApi";
import { MovieDetail } from "../models/movieDetail";
import { IMAGE_URL, placeholder } from "../common/constanst";
import StarRating from "react-native-star-rating-widget";
import dateFormat from "dateformat";
import PlayButton from "../components/PlayButton";
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from 'react-native-vector-icons/AntDesign';
import PipModule from "../modules/piPModule";

type ParamList = {
    Detail: { id: number };
};

export default function Detail() {
    const height = Dimensions.get('screen').height
    const width = Dimensions.get('screen').width
    const [modalVisible, setModalVisible] = useState(false);
    const [movie, setMovie] = useState<MovieDetail>()
    const [loaded, setLoaded] = useState(false)
    const [rating, setRating] = useState(0);
    const route = useRoute<RouteProp<ParamList, 'Detail'>>()
    const { id } = route.params

    useEffect(() => {
        getDetailMovieWithTrailer(id).then(data => {
            setMovie(data)
            setLoaded(true)
        })
    }, [id])

    return (
        <>
            {movie && loaded && (
                <ScrollView>
                    <Image
                        style={{ height: height / 2.5 }}
                        source={movie.poster_path ? { uri: IMAGE_URL + movie.poster_path } : placeholder}
                        resizeMode='cover'
                    />
                    <View style={styles.container}>
                        <View style={{ position: 'absolute', top: -28, right: 40 }}>
                            {/* <PlayButton handlePress={() => setModalVisible(true)} /> */}
                            <PlayButton handlePress={() => PipModule.playVideoEvent(movie.videos.results[0].key)} />
                        </View>
                        <Text style={styles.movieTitle}>{movie.title}</Text>
                        {movie.genres && (
                            <View style={styles.genresContainer}>
                                {movie.genres.map((item, index) => (
                                    <Text style={styles.genres} key={index}>{item.name}</Text>
                                ))}
                            </View>
                        )}
                        <StarRating
                            rating={movie.vote_average / 2}
                            onChange={setRating}
                        />
                        <Text style={styles.overview}>{movie.overview}</Text>
                        <Text style={styles.release_date}>
                            Release date: {dateFormat(movie.release_date, "shortDate")}
                        </Text>

                        <Modal animationType="slide" visible={modalVisible}>
                            <View style={styles.container}>
                                {movie.videos.results.length > 0 ?
                                    <YoutubePlayer
                                        height={height / 3}
                                        width={width}
                                        play={true}
                                        videoId={movie.videos.results[0].key}
                                    />
                                    : <Text>No video trailer</Text>}

                                <Pressable
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Icon name="closecircle" size={50} />
                                </Pressable>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            )}
            {!loaded && (<ActivityIndicator style={styles.centerLoaded} size="large" color="#0000ff" />)}
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
    },
    movieTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10
    },
    genresContainer: {
        flexDirection: 'row',
        alignContent: 'center'//can giua theo chieu doc container chua  o ngoai
    },
    genres: {
        margin: 4,
        fontWeight: 'bold'
    },
    overview: {
        padding: 15
    },
    release_date: {
        fontWeight: 'bold'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
});