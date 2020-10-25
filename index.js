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

spotifyApi.refreshAccessToken().then((data) => {
        console.log('The access token has been refreshed!');

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.getMyTopTracks({time_range: "short_term", limit: 10})
        .then(function(data) {

            let topTracks = data.body.items.slice(0, 5).map((track) => ({
                artist: track.artists.map((_artist) => _artist.name)[0],
                title: track.name
              }));
            console.log(topTracks);

    }, (err) => {
        console.log('Something went wrong!', err);
    });
    },(err) => {

        console.log('Could not refresh access token', err);
    });



    // https://accounts.spotify.com/authorize?client_id=049c2b23b57c45579678799b71e5fb54&response_type=code&redirect_uri=http://localhost:5000/&scope=user-top-read