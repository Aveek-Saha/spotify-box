require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');
const { Octokit } = require("@octokit/rest");

const {
    CLIENT_ID: client_id,
    CLIENT_SECRET: client_secret,
    REFRESH_TOKEN: refresh_token,
    TYPE: type,
    GIST_ID: gistId,
    GH_TOKEN: githubToken,
    TIME_RANGE: time_range
} = process.env;

const octokit = new Octokit({
    auth: `token ${githubToken}`
});

var spotifyApi = new SpotifyWebApi({
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: refresh_token
});

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '…' : str;
};

async function updateGist(lines, des) {
    let gist;
    try {
      gist = await octokit.gists.get({ gist_id: gistId });
    } catch (error) {
      console.error(`Unable to get gist\n${error}`);
    }

    const filename = Object.keys(gist.data.files)[0];
  
    try {
      await octokit.gists.update({
        gist_id: gistId,
        description: `🎧 Spotify | ${des}`,
        files: {
          [filename]: {
              content: lines
          }
        }
      });
    } catch (error) {
      console.error(`Unable to update gist\n${error}`);
    }
  }


async function getTopTracks() {
    try {
        var topTracks = await spotifyApi.getMyTopTracks({ time_range: time_range, limit: 5 })
        var tracks = topTracks.body.items.map((track) => ({
            artist: track.artists.map((_artist) => _artist.name)[0],
            title: track.name
        }));

        var lines = [];
        tracks.forEach(track => {
            lines.push(` ▶ ${truncate(track.title + " ", 35).padEnd(35, '.')} 🎵 ${truncate(track.artist + " ", 16)}`)
        })
        return lines.join("\n");
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}

async function getTopArtists() {
    try {
        var topArtists = await spotifyApi.getMyTopArtists({ time_range: time_range, limit: 5 })
        var artists = topArtists.body.items.map((artist) => ({
            artist: artist.name,
            genres: artist.genres.slice(0, 2)
        }));

        var lines = [];
        artists.forEach(artist => {
            lines.push(` ▶ ${truncate(artist.artist + " ", 15).padEnd(15, '.')} 💽 ${truncate(artist.genres.join(", ") + " ", 40)}`)
        })
        return lines.join("\n");
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}


async function getRecentlyPlayed() {
    try {
        var recentlyPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 5 })
        var tracks = recentlyPlayed.body.items.map((play) => ({
            artist: play.track.artists.map((_artist) => _artist.name)[0],
            title: play.track.name
        }));

        var lines = [];

        tracks.forEach(track => {
            lines.push(` ▶ ${truncate(track.title + " ", 35).padEnd(35, '.')} 🎵 ${truncate(track.artist + " ", 16)}`)
        })

        return lines.join("\n");
        
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}

async function main() {
    try {
        var accessToken = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(accessToken.body['access_token']);

        var res;
        var des;
        if(type === 'recently-played') {
            res = await getRecentlyPlayed()
            des = "Recently Played"
        } else if (type === 'top-tracks') {
            res = await getTopTracks()
            des = "My Top Tracks"
        } else {
            res = await getTopArtists()
            des = "My Top Artists"
        }
        console.log(res);
        await updateGist(res, des)
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}



(async () => {
    await main();
})();
