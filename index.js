require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');

const {
    CLIENT_ID: client_id,
    CLIENT_SECRET: client_secret,
    REFRESH_TOKEN: refresh_token
} = process.env;

var spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: refresh_token
});


async function getTopTracks() {
    try {
        var accessToken = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(accessToken.body['access_token']);
        var topTracks = await spotifyApi.getMyTopTracks({ time_range: "medium_term", limit: 5 })
        var tracks = topTracks.body.items.map((track) => ({
            artist: track.artists.map((_artist) => _artist.name)[0],
            title: track.name
          }));
          console.log(tracks);
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}

async function getTopArtists() {
    try {
        var accessToken = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(accessToken.body['access_token']);
        var topArtists = await spotifyApi.getMyTopArtists({ time_range: "medium_term", limit: 5 })
        var artists = topArtists.body.items.map((artist) => ({
            artist: artist.name,
            popularity: artist.popularity
          }));
          console.log(artists);
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}


async function getRecentlyPlayed() {
    try {
        var accessToken = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(accessToken.body['access_token']);
        var recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 })
        var tracks = recentlyPlayed.body.items.map((play) => ({
            artist: play.track.artists.map((_artist) => _artist.name)[0],
            title: play.track.name
          }));
          console.log(tracks);
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}


(async () => {
    await getRecentlyPlayed();
})();


// https://accounts.spotify.com/authorize?client_id=049c2b23b57c45579678799b71e5fb54&response_type=code&redirect_uri=http://localhost:5000/&scope=user-top-read