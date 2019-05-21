'use strict'

const listenNotesApiKey = '117c42b9078743dc89b2323493dc967d';

const youtubeApiKey = 'AIzaSyDtfzdlcBrzEbC15WG2VRCvADNbTjDFlww';

const youtubeUrl = 'https://www.googleapis.com/youtube/v3/search';

const podcastUrl = 'https://listen-api.listennotes.com/api/v2/search';


// Waits for the search form to be submitted
function watchForm(){
    $('form').submit(function(event) {
        event.preventDefault();
        let searchTerm = $('.searchBox').val();

        getYoutube(searchTerm);

        getPodcast(searchTerm);

        $('main').removeClass('hidden');
    })
    
}

// Makes call to YouTube API to request data based on user input
function getYoutube(searchTerm, maxResults = 8) {
    const params = {
        part: 'snippet',
        q: searchTerm,
        key: youtubeApiKey,
        videoEmbeddable: 'true',
        type: 'video',
        maxResults
    };

    let queryString = convertToString(params);

    let finalYoutubeUrl = youtubeUrl + '?' + queryString;

    fetch(finalYoutubeUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } 
            throw new Error(response.statusMessage);
        })
        .then(responseJson => displayYoutube(responseJson))
        .catch(error => {
            alert(`An error occured: ${response.statusMessage}`)
        });    
}

// Displays the YouTube data from the API fetch request to the DOM
function displayYoutube(responseJson) {
    console.log(responseJson);

    for (let i = 0; i < responseJson.items.length; i++) {
        $('#youtube-results-list').append(`
            <li>
                <h3>${responseJson.items[i].snippet.title}</h3>
                <a href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}' target="_blank">
                    <img src="${responseJson.items[i].snippet.thumbnails.high.url}" alt="YouTube video thumbnail">
                </a>
                <p>${responseJson.items[i].snippet.description}</p>
            </li>
        `)
    };


}

// Makes call to ListenNotes API to request data based on user input
function getPodcast(searchTerm) {

    const options = {
        headers: new Headers({
          "X-ListenAPI-Key": listenNotesApiKey})
      };

    let params = {
        q: searchTerm   
    };
    
    let queryString = convertToString(params);

    let finalPodcastUrl = podcastUrl + '?' + queryString;

    fetch(finalPodcastUrl, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusMessage)
        })
        .then(responseJson => displayPodcast(responseJson))
        .catch(error => {
            alert(`An error occured: ${response.statusMessage}`)
        });
}

// Displays the ListenNotes data from the API fetch request to the DOM
function displayPodcast(responseJson) {
    console.log(responseJson)

    for (let n = 0; n < responseJson.results.length; i++) {
        
    }

}

// Converts query parameters from an object to a string
function convertToString(params) {
    let queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

$(watchForm);

