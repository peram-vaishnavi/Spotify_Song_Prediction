document.addEventListener("DOMContentLoaded", function() {
    let songsData = "";
    let player;
    let deviceId;

    function fetchSongs() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer BQC2dffbAgB_WIJNvKE-fu_E62pQM9QnzdgLZGHevw43zBe806MEps2wUqcbEq51MBcy9hYTtqtB4jr6cxVRGlvuC7_fz7Oo024bEQr7ohGgiTB_sUXXKi9Q_o1HExGbQZmibtVFPW7LyZMGZtuqNPJ8y_mdToO5WAH99VEZCjswNC9X8WYsDjOIPR4NBbHkfcymU0MNNJ3QZJz3c6ZXJGNAdPFcysz397cqJyKQAdkVjtAE1M4QmTV_QGPo16n3dOyFVRZkJPmkIL7lVrd7");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                songsData = result.items;
                displaySongs(songsData);
            })
            .catch((error) => console.error('Error:', error));
    }

    function displaySongs(songs) {
        const songsList = document.getElementById("songs-list");
        songsList.innerHTML = ""; // Clear existing content

        songs.forEach((song) => {
            const songCard = document.createElement("div");
            songCard.className = "card";
            songCard.innerHTML = `
                <img src="${song.album.images[0].url}" alt="Song Cover">
                <div class="song-details">
                    <h3>${song.name}</h3>
                    <p>${song.artists.map(artist => artist.name).join(', ')}</p>
                </div>
            `;
            songCard.addEventListener("click", () => playSong(song));
            songsList.appendChild(songCard);
        });
    }

    function playSong(song) {
        const songBar = document.getElementById("song-bar");
        const songCover = document.getElementById("song-cover");
        const songTitle = document.getElementById("song-title");
        const songArtist = document.getElementById("song-artist");

        songCover.src = song.album.images[0].url;
        songTitle.textContent = song.name;
        songArtist.textContent = song.artists.map(artist => artist.name).join(', ');

        songBar.style.display = "flex";

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [song.uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer BQC2dffbAgB_WIJNvKE-fu_E62pQM9QnzdgLZGHevw43zBe806MEps2wUqcbEq51MBcy9hYTtqtB4jr6cxVRGlvuC7_fz7Oo024bEQr7ohGgiTB_sUXXKi9Q_o1HExGbQZmibtVFPW7LyZMGZtuqNPJ8y_mdToO5WAH99VEZCjswNC9X8WYsDjOIPR4NBbHkfcymU0MNNJ3QZJz3c6ZXJGNAdPFcysz397cqJyKQAdkVjtAE1M4QmTV_QGPo16n3dOyFVRZkJPmkIL7lVrd7`
            },
        }).catch(error => console.error('Error playing song:', error));
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb('BQC2dffbAgB_WIJNvKE-fu_E62pQM9QnzdgLZGHevw43zBe806MEps2wUqcbEq51MBcy9hYTtqtB4jr6cxVRGlvuC7_fz7Oo024bEQr7ohGgiTB_sUXXKi9Q_o1HExGbQZmibtVFPW7LyZMGZtuqNPJ8y_mdToO5WAH99VEZCjswNC9X8WYsDjOIPR4NBbHkfcymU0MNNJ3QZJz3c6ZXJGNAdPFcysz397cqJyKQAdkVjtAE1M4QmTV_QGPo16n3dOyFVRZkJPmkIL7lVrd7'); }
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            deviceId = device_id;
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.connect();
    };

    function togglePlay() {
        player.togglePlay();
    }

    fetchSongs();
});

