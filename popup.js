document.addEventListener('DOMContentLoaded', function() {
  var artistText = document.getElementById('artist');
  var songText = document.getElementById('song');
  var checkButton = document.getElementById('check');

  check.addEventListener('click', function() {
    var lyricsURL = metroLyricsURL(artist.value, song.value);
    console.log(lyricsURL);

    var http = new XMLHttpRequest();
    http.responseType = "document";
    http.open('GET', lyricsURL);
    http.send();

    var verses = Array.from(http.response.getElementsByClassName('verse'));
    var lyrics = verses.reduce(function(acc, elt) {
      return acc + elt.innerHtml;
    }, "");
  });
});

function urlify(str) {
  punct = /,;:!\.\?"~%\(\)/g
  var newStr = str.toLowerCase().trim().replace(/\s/g, '-').replace(punct, '');
  return newStr;
}

function metroLyricsURL(artist, song) {
  return 'metrolyrics.com/'
         + urlify(song) + '-lyrics-' + urlify(artist) + '.html';
}
