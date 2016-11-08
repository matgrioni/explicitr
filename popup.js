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
      var lyrics = azLyricsFromDOM(http.response);

      var explicitIndexes = explicitWords.reduce(function(acc, word) {
        return acc.concat(indexes(lyrics, word));
      }, []);

      var contexts = explicitIndexes.map(function(index) {
        return lyrics.substring(index - 10, index + 10);
      });

      console.log(contexts);
    });
    http.open('GET', lyricsURL);
    http.send();
  });
});

function indexes(str, sub) {
  var found = []
  var index = 0;
  while (index < str.length - sub.length + 1) {
    var next = str.indexOf(sub, index);

    if (next != -1) {
      found.push(next);
      index = next + sub.length;
    } else {
      index++;
    }
  }

  return found;
}

function azLyricsFromDOM(dom) {
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
