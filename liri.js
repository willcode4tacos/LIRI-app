require('dotenv').config()
var keys = require('./keys');

var fs = require('fs');
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var command = process.argv[2];
var query = process.argv[3];
var nodeArgs = process.argv;
var myQuery="";
var getThisSong= "";


var appendToFile = function(data){

    fs.appendFile('log.txt', data+'\n', function(err){
        if (err) {
            console.log(err);
        } 
    });
};

// Concert Function //
function concertThis() {

    var artist = query
    var concertQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    console.log(concertQueryURL);

    request(concertQueryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            concerts.forEach(function (concert) {
                console.log("");
                console.log("Venue: " + concert.venue.name);
                console.log("Country: " + concert.venue.country);
                console.log("City: " + concert.venue.city);
                console.log("Date and time: " + moment(concert.datetime).format('MMMM Do YYYY, h:mm:ss a'));
                console.log("");
            });
        }
    });

}


// Spotify Function //
function spotifySong(x){
    // console.log(`param is ${x}`);
    myQuery = query
    
    if(x ===getThisSong){
        myQuery = x;
        // console.log(`now myQuery: ${myQuery}`);
       
    } else if (myQuery === undefined ) {
        myQuery = 'The Sign';
        
        }
        
    var spotify = new Spotify(keys.spotify);  
    // var myQuery = query
    spotify.search({ type: 'track', query: myQuery, }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
     
        //console.log(data); 
        var info = data.tracks.items[0];
        var artistName  = JSON.stringify(info.artists[0].name);
        var songName = JSON.stringify(info.name);
        var albumName  = JSON.stringify(info.album.name);
        var trackUrl = JSON.stringify(info.external_urls.spotify);
        var logTextSpotify = `Artist(s) Name: ${artistName}\nSong Title: ${songName}\nListen Here: ${trackUrl}\nAlbum Name: ${albumName}`;

        console.log(logTextSpotify);
        
        appendToFile(logTextSpotify);
        
    });
 
};


// Movie Function //
function movieInfo(){
    var title = query
    if(title ===undefined){
        title="Mr. Nobody";
    };
    var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";


    request(queryURL, function (error, response, body) {

        if (error) {
            return console.log('Error occurred: ' + error);
        }
    
    
    var output = JSON.parse(body);
    var title =output.Title;
    var year = output.Year;
    var imbdRating=output.Ratings[0].Value;
    var rottenRating=output.Ratings[1].Value;
    var country= output.Country;
    var lang= output.Language;
    var plot= output.Plot;
    var actors = output.Actors;

    var movieData= (`Movie: ${title}\nMovie Year: ${year}\nIMDB Rating: ${imbdRating}\nRotten Tomatoes Rating: ${rottenRating}\nCountry where produced: ${country}\nLanguages: ${lang}\nPlot: ${plot}\nActors: ${actors}` );
        
    console.log(movieData);
    appendToFile(movieData);

    });
};


function getThis(){
    
    fs.readFile('./random.txt', 'utf8', function(err, data){
        if (err) throw err;
        // console.log(data);
        var randomFile = data.split(",");
        getThisSong = randomFile[1];
        getThisSong =JSON.parse(getThisSong);
  
        spotifySong(getThisSong);
        
    });
    
};

//Switch Statement//

switch (command){

    case 'concert-this':
        concertThis();
        break;

    case 'spotify-this-song':
        spotifySong()
        break;

    case 'movie-this':
        movieInfo()
        break;
    
    case 'do-what-it-says':
        getThis()
        break;
    
    default:
        
        console.log(`Please enter a command: \n• concert-this \n• spotify-this-song \n• movie-this \n• do-what-it-says`);
        
}
