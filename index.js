'use strict'

const listenNotesApiKey = '117c42b9078743dc89b2323493dc967d';

const youtubeApiKey = 'AIzaSyDuI1rTVHwSXIsHEua0RWBpEqUQF3wsEU4';

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
// Sets the target of the "See more" links on the results page based on the user input
        $('#more-on-youtube').empty().append(`
            <a id="more-on-youtube-link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}" target="_blank">
                See more on YouTube</a>
        `)

        $('#more-on-listennotes').empty().append(`
            <a id="more-on-listennotes-link" href="https://www.listennotes.com/search/?q=${encodeURIComponent(searchTerm)}" target="_blank">
                See more on Listen Notes</a>
        `)


        // When user hits submit auto scroll down to results
        $("body, html").animate({ 
            scrollTop: $("#scroll-here").offset().top }, 800, 'swing');
    })
}

// When user clicks on link in footer, scroll back up to the search form
function scrollToTop() {
    $("#scroll-to-top").on("click", function(event) {
        event.preventDefault();

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
            $('#youtube-results-list').append(`
            <li>
                <p class="youtube-result-0">There was an Error. Try again later</p>
            </li>
            `)
        });   
}

// Displays the YouTube data from the API fetch request to the DOM
function displayYoutube(responseJson) {

    $('#youtube-results-list').empty();
//Takes care of alerting user of an error if there are no results found from Youtube
    if (responseJson.items.length === 0) {
        $('#youtube-results-list').append(`
            <li>
                <p class="youtube-result-0">No results found. Try another search.</p>
            </li>
        `)
    }

    for (let i = 0; i < responseJson.items.length; i++) {
        $('#youtube-results-list').append(`
            <li>
                <iframe src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  
                <h3><a class="channel-id" href="https://www.youtube.com/channel/${responseJson.items[i].snippet.channelId}"
                    target="_blank">${responseJson.items[i].snippet.title}</a></h3>
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
        q: searchTerm, 
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
            $('#podcast-results-list').append(`
            <li>
                <p class="podcast-result-0">There was an Error. Try again later</p>
            </li>
            `)
        });
}

// Displays the ListenNotes data from the API fetch request to the DOM
function displayPodcast(responseJson) {

    $('#podcast-results-list').empty();
//Takes care of alerting user of an error if there are no results found from Listen Notes
    if (responseJson.results.length === 0) {
        $('#podcast-results-list').append(`
            <li>
                <p class="podcast-result-0">No results found. Try to be more specific.</p>
            </li>
        `)
    }

    for (let n = 0; n < responseJson.results.length; n++) {
        $('#podcast-results-list').append(`
            <li>
                <img src="${responseJson.results[n].thumbnail}" alt="Podcast thumbnail">
                <h3><a class="channel-id" href="${responseJson.results[n].podcast_listennotes_url}" target="_blank">
                    ${responseJson.results[n].podcast_title_original}</a></h3>
                <h4 class="episode-title">${responseJson.results[n].title_original}</h4>
                <p class="listen-link-box"><a class="listen-link" href="${responseJson.results[n].listennotes_url}" target="_blank">Listen</a></p>
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




