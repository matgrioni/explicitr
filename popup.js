var explicitWords = Object.freeze(['fuck', 'shit', 'nigga', 'nigger',
                                   'cunt', 'motherfucker', 'ass',
                                   'bitch', 'holy shit', 'whore']);

document.addEventListener('DOMContentLoaded', function() {
  var artistText = document.getElementById('artist');
  var songText = document.getElementById('song');
  var checkButton = document.getElementById('check');

  var results = document.getElementById('results');

  check.addEventListener('click', function() {
    var lyricsURL = azLyricsURL(artist.value, song.value);

    var http = new XMLHttpRequest();
    http.responseType = 'document';
    http.addEventListener('load', function() {
      // Remove all prior results from the list.
      while (results.firstChild)
        results.removeChild(results.firstChild);

      // Get the lyrics from the document object retrieved, and
      // replace all <br> occurences with new line characters.
      var lyrics = azLyricsFromDOM(http.response);
      lyrics = lyrics.replace(/<br>/g, '\n').replace(/<.+>/g, '');

      var explicitIndexes = explicitWords.reduce(function(acc, word) {
        return acc.concat(indexes(lyrics, word));
      }, []);

      explicitIndexes.forEach(function(index) {
        var context = lyrics.substring(index - 10, index + 10);
        var entry = document.createElement('li');
        entry.appendChild(document.createTextNode(context));

        results.appendChild(entry);
      });
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

function containingLine(str, index) {
  var startIndex = index;
  while (startIndex > -1 && str.charAt(startIndex) !== '\n')
    startIndex--;
  startIndex++;

  var endIndex = index;
  while (endIndex < str.length && str.charAt(endIndex) !== '\n')
    endIndex++;

  return str.slice(startIndex, endIndex);
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
