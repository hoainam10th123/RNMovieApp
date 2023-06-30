import React, { useEffect, useState } from 'react';
import { getFamilyMovies, getPopularMovies, getPopularTv, getUpcomingMovies } from '../services/movieApi';
import { Dimensions, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { IMAGE_URL } from '../common/constanst';
import List from '../components/List';
import { SliderBox } from 'react-native-image-slider-box';
import Error from '../components/Error';

const dimentions = Dimensions.get('screen')

export default function Home() {
  const [moviesImg, setMoviesImg] = useState<string[]>([]);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [popularTv, setPopularTv] = useState<any[]>([]);
  const [familyMovies, setFamilyMovies] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  

  const getDataMovies = () => {
    return Promise.all([
      getUpcomingMovies(),
      getPopularMovies(),
      getPopularTv(),
      getFamilyMovies()
    ])
  }

  useEffect(() => {
    getDataMovies().then(([
      upcomingMoviesData,
      popularMovies,
      popularTv,
      familyMovies
    ]) => {
      const movieArray: string[] = []
      upcomingMoviesData.forEach(element => {
        movieArray.push(IMAGE_URL + element.poster_path)
      });
      setMoviesImg(movieArray)
      setPopularMovies(popularMovies)
      setPopularTv(popularTv)
      setFamilyMovies(familyMovies)
    }).catch(error => {
      console.error(error)
      setError(true)
    })
      .finally(() => {
        // tat load
        setLoaded(true)
      })
  }, []);

  return (
    <>
      {loaded && !error && (
        <ScrollView>
          {moviesImg && (
            <View style={styles.container}>
              <SliderBox
                autoplay={true}
                circleLoop={true}
                sliderBoxHeight={dimentions.height / 1.5}
                images={moviesImg}
                dotStyle={styles.sliderStyle} />
            </View>
          )}

          {popularMovies && (
            <View style={styles.carousel}>
              <List title='Popular movies' content={popularMovies} />
            </View>
          )}

          {popularTv && (
            <View style={styles.carousel}>
              <List title='Popular TV show' content={popularTv} />
            </View>
          )}

          {familyMovies && (
            <View style={styles.carousel}>
              <List title='Family Movies' content={familyMovies} />
            </View>
          )}
        </ScrollView>
      )}
      {!loaded && (<ActivityIndicator style={styles.centerLoaded} size="large" color="#0000ff" />)}
      {error && (<Error />)}
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sliderStyle: {
    height: 0
  },
  carousel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerLoaded: {
    flex: 1,
    justifyContent: 'center'
  }
});