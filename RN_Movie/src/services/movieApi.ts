import axios from 'axios';
import { MovieDetail } from '../models/movieDetail';
import { BASE_URL_MYSERVER } from '../common/constanst';
import { store } from '../redux/store';
import { createAsyncThunk } from '@reduxjs/toolkit';


const apiUrl = 'https://api.themoviedb.org/3';
const apiKey = '7fdafc43e8f6925ad7c272bae92aebc9';

export const getPopularMovies = async () => {
  const res = await axios.get(
    `${apiUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`,
  );
  return res.data.results;
};

export const getUpcomingMovies = async () => {
  const res = await axios.get(
    `${apiUrl}/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`,
  );
  return res.data.results;
};

export const getPopularTv = async () => {
  const res = await axios.get(
    `${apiUrl}/tv/popular?api_key=${apiKey}&language=en-US&page=1`,
  );
  return res.data.results;
};

export const getFamilyMovies = async () => {
  const res = await axios.get(
    `${apiUrl}/discover/movie?api_key=${apiKey}&with_genres=10751`,
  );
  return res.data.results;
};

export const getDetailMovie = async (id:number) => {
  const res = await axios.get<MovieDetail>(
    `${apiUrl}/movie/${id}?api_key=${apiKey}`,
  );
  return res.data;
};

//https://api.themoviedb.org/3/movie/2001?api_key=7fdafc43e8f6925ad7c272bae92aebc9&append_to_response=videos
// {
//   "vote_average": 6.691,
//   "vote_count": 1195,
//   "videos": {
//       "results": [
//           {
//               "iso_639_1": "en",
//               "iso_3166_1": "US",
//               "name": "We Own The Night (2007) Trailer #1 | Movieclips Classic Trailers",
//               "key": "vCXVToxZNB4",
//               "published_at": "2017-04-26T17:12:09.000Z",
//               "site": "YouTube",
//               "size": 1080,
//               "type": "Trailer",
//               "official": false,
//               "id": "5900dea392514155b500059a"
//           }
//       ]
//   }
// }
export const getDetailMovieWithTrailer = async (id:number) => {
  const res = await axios.get<MovieDetail>(
    `${apiUrl}/movie/${id}?api_key=${apiKey}&append_to_response=videos`,
  );
  return res.data;
};

export const searchMovie = async (query: string) => {
  const res = await axios.get(
    `${apiUrl}/search/movie?query=${query}&api_key=${apiKey}`,
  );
  return res.data.results;
};

export const suggestMoviesAi = async ()=>{
    const res = await axios.get(`${BASE_URL_MYSERVER}/movies/pridiction-movies`, { headers: {"Authorization" : `Bearer ${store.getState().user.user?.token}`} });
    return res.data;
}

export const suggestMoviesAiThunk = createAsyncThunk('movies/suggestMoviesAi',
  async () => {
    const res = await axios.get(`${BASE_URL_MYSERVER}/movies/pridiction-movies`, { headers: {"Authorization" : `Bearer ${store.getState().user.user?.token}`} });
    return res.data;
  }
)