var explicitWords = Object.freeze(['fuck', 'shit', 'nigga', 'nigger',
                                   'cunt', 'motherfucker', 'ass',
                                   'bitch', 'holy shit', 'whore']);

document.addEventListener('DOMContentLoaded', function() {
  var artistText = document.getElementById('artist');
  var songText = document.getElementById('song');
  var checkButton = document.getElementById('check');

  check.addEventListener('click', function() {
    var lyricsURL = azLyricsURL(artist.value, song.value);

    var http = new XMLHttpRequest();
    http.responseType = 'document';
    http.addEventListener('load', function() {
      var lyrics = lyricsDiv(http.response);

      var explicit = explicitWords.reduce(function(acc, elt) {
        return acc || lyrics.includes(elt);
      }, false);

      alert(explicit);
    });
    http.open('GET', lyricsURL);
    http.send();
  });
});

function lyricsDiv(dom) {
  var contentDiv = dom.getElementsByClassName('col-xs-12 col-lg-8 text-center')[0];

  var index = 8;
  var child = contentDiv.children[index];
  while (child.nodeName != "DIV" && !child.innerHTML) {
    index++;
    child = contentDiv.children[index];
  }

  return child.innerHTML;
}

function urlify(str) {
  punct = /[,;:!\.\?"~%\(\)]/g
  var newStr = str.toLowerCase().trim().replace(/\s/g, '').replace(punct, '');
  return newStr;
}

function azLyricsURL(artist, song) {
  return 'http://azlyrics.com/lyrics/' +
         urlify(artist) + '/' + urlify(song) + '.html';
}
