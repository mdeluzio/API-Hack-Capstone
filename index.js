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

        $('main, #footer').removeClass('hidden');

        // When user hits submit auto scroll down to results
        $("body, html").animate({ 
            scrollTop: $("#scroll-here").offset().top }, 800, 'swing');
    })
    
}

// When user clicks on link in footer, scroll back up to the search form
function scrollToTop() {
    $("#scroll-to-top").on("click", function( e ) {
    
        e.preventDefault();

        $("body, html").animate({ 
        scrollTop: $("header").offset().top }, 800, 'swing');
    
    });
}

// Makes call to YouTube API to request data based on user input
function getYoutube(searchTerm, maxResults = 10) {
    const params = {
        part: 'snippet',
        q: searchTerm,
        key: youtubeApiKey,
        videoEmbeddable: 'true',
        type: 'video',
        safeSearch: 'strict',
        relevanceLanguage: 'en',
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

    $('#youtube-results-list').empty();

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
            alert(`An error occured`)
        });
}

// Displays the ListenNotes data from the API fetch request to the DOM
function displayPodcast(responseJson) {
    console.log(responseJson)

    $('#podcast-results-list').empty();

    for (let n = 0; n < responseJson.results.length; n++) {
        $('#podcast-results-list').append(`
            <li>
                <h3>${responseJson.results[n].podcast_title_original}</h3>
                <img src="${responseJson.results[n].thumbnail}" alt="Podcast thumbnail">
                <h4>${responseJson.results[n].title_original}</h4>
                <p>${responseJson.results[n].description_original.slice(0, 100)}...</p>
                <a href="${responseJson.results[n].listennotes_url}" target="_blank">Click to Listen</a>
            </li>
        `)
    };



}

// Converts query parameters from an object to a string
function convertToString(params) {
    let queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

$(watchForm);

$(scrollToTop);


