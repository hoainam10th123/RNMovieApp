import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState, store } from '../store'
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { HUB_URL } from "../../common/constanst";
import { IUser } from "../../models/user";
import { suggestMoviesAiThunk } from "../../services/movieApi";

interface MoviesState {
    loading: boolean
    movies: any[]
    hubConnection: HubConnection | null
    message: string
}

const initialState: MoviesState = {
    loading: false,
    movies: [],
    hubConnection: null,
    message: ''
}

export const movieSlice = createSlice({
    name: 'hubs/presence',
    initialState,
    reducers: {
        resquest: (state) => {
            state.loading = true
        },
        setMovies: (state, action: PayloadAction<any>) => {
            state.loading = false
            state.movies = action.payload
        },
        setErrorMessage: (state, action: PayloadAction<string>)=>{
            state.message = action.payload
        },
        createHubConnection: (state, action: PayloadAction<IUser>) => {
            state.hubConnection = new HubConnectionBuilder()
                .withUrl(HUB_URL + 'presence', {
                    accessTokenFactory: () => action.payload.token
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            state.hubConnection.start().catch(error => console.error('Error establishing the connection: ', error));
        },
        stopHubConnetion: (state) => {
            state.hubConnection?.stop().catch(error => console.error('Error stopping connection: ', error));
        }
    },
    // extraReducers(builder) {
    //     builder.addCase(suggestMoviesAiThunk.pending, (state, { payload }) => {
    //         state.loading = true
    //     }).addCase(suggestMoviesAiThunk.rejected, (state, action) => {

    //     }).addCase(suggestMoviesAiThunk.fulfilled, (state, action) => {

    //     })
    // }
})

export const { resquest, setMovies, setErrorMessage, createHubConnection, stopHubConnetion } = movieSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.presenceHub

export default movieSlice.reducer