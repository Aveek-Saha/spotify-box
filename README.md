<p align="center">
  <img width="450" src="https://user-images.githubusercontent.com/31800695/95853311-d40d3400-0d72-11eb-86f5-460d4214001c.png">
  <h3 align="center">spotify-box</h3>
  <p align="center">🎧 Update a pinned gist to show your top Spotify tracks/artists</p>
</p>

---

> 📌✨ For more pinned-gist projects like this one, check out: https://github.com/matchai/awesome-pinned-gists

# Setup

## Prep work

### GitHub

1. Create a new public GitHub Gist. (https://gist.github.com/)
1. Create an access token with the `gist` scope and copy it. (https://github.com/settings/tokens/new)

### Spotify

1. Go to the Spotify Developer Dashboard and log in. (https://developer.spotify.com/dashboard/)
1. Create an app with a name and description.
1. Copy the `Client ID` and `Client secret`.
1. Click on edit settings and add `http://localhost:5000/` as a redirect URI.
1. In your browser enter this URL and replace <client_id> in this url: 
    ```
    https://accounts.spotify.com/authorize?client_id=<client_id>
    &response_type=code&redirect_uri=http://localhost:5000/&scope=user-top-read
    ```
1. After this you should see an url like this in your address bar: `http://localhost:5000/?code=<code>`. Copy this code query parameter.
1. Use this website to generate a base 64 string of the form `client_id:client_secret`. (https://www.base64encode.org/)
1. In a terminal, run the following command and use the base 64 encoded string and code from the previous steps.

    ```command
    curl -H "Authorization: Basic <base 64 str>" -d grant_type=authorization_code -d code=<code> 
    -d redirect_uri=http://localhost:5000/ https://accounts.spotify.com/api/token 
    ```
1. A JSON response containing a `refresh_token` will be returned. Copy this value.

## Project setup

1. Fork this repo
1. Go to the repo **Settings > Secrets**
1. Add the following environment variables:
   - **GH_TOKEN:** The GitHub access token generated above.
   - **GIST_ID:** The ID portion from your gist url: `https://gist.github.com/Aveek-Saha/`**`8335e85451541072dd25fda601129f7d`**.
   - **CLIENT_ID:** Your Spotify `client_id`.
   - **CLIENT_SECRET:** Your Spotify `client_secret`.
   - **REFRESH_TOKEN:** The `refresh_token` generated.
   - **TYPE:** The type of data generated on the gist. Can be one of `top_tracks`, `top_artists` or `recently_played`.
   - **TIME_RANGE:** The time frame for computing `top_tracks` or `top_artists`. Can be one of `long_term`, `medium_term` or `short_term`.

## Credits
This code was inspired by [@matchai's bird-box](https://github.com/matchai/bird-box).
