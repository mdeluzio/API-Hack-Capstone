//'use strict'

const listenNotesApiKey = '117c42b9078743dc89b2323493dc967d';

const youtubeApiKey = 'AIzaSyDtfzdlcBrzEbC15WG2VRCvADNbTjDFlww';

const youtubeUrl = 'https://www.googleapis.com/youtube/v3/search';



// Waits for the search form to be submitted
function watchForm(){
    $('form').submit(function(event) {
        event.preventDefault();
        let searchTerm = $('.searchBox').val();

        getYoutube(searchTerm);
    })
    
}

// Makes call to YouTube API to request data based on user input
function getYoutube(searchTerm, maxResults=25) {
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
}

// Makes call to ListenNotes API to request data based on user input
function getPodcast() {
    
}

// Displays the ListenNotes data from the API fetch request to the DOM
function displayPodcast() {

}

// Converts query parameters from an object to a string
function convertToString(params) {
    let queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

$(watchForm);

