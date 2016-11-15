var explicitWords = Object.freeze(['fuck', 'shit', 'nigga', 'nigger',
                                   'cunt', 'motherfucker', 'ass',
                                   'bitch', 'holy shit', 'whore']);

document.addEventListener('DOMContentLoaded', function() {
  var artistText = document.getElementById('artist');
  var songText = document.getElementById('song');
  var checkButton = document.getElementById('check');

  var resultsSection = document.getElementById('results-section');
  var results = document.getElementById('results');

  hideElement(resultsSection);
  check.addEventListener('click', function() {
    var lyricsURL = azLyricsURL(artist.value, song.value);

    var http = new XMLHttpRequest();
    http.responseType = 'document';
    http.addEventListener('load', function() {
      // Remove all prior results from the list.
      showElement(resultsSection, 'block');
      clearList(results);

      if (http.status == 404)
        addListItem(results, 'No such song. Check spelling');

      // Get the lyrics from the document object retrieved, and
      // replace all <br> occurences with new line characters.
      var lyrics = azLyricsFromDOM(http.response);
      lyrics = lyrics.replace(/<br>/g, '\n').replace(/<.+>/g, '');

      // TODO: Two loops here when only one is needed.
      var explicitIndexes = explicitWords.reduce(function(acc, word) {
        return acc.concat(indexes(lyrics, word));
      }, []);

      if (explicitIndexes.length > 0) {
        explicitIndexes.forEach(function(index) {
          var context = containingLine(lyrics, index);
          addListItem(results, context);
        });
      } else {
        addListItem(results, 'This song seems to be clean!');
      }
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

function hideElement(elem) {
  elem.style.display = 'none';
}

function showElement(elem, dispType='block') {
  elem.style.display = dispType;
}

function clearList(list) {
  while (list.firstChild)
    list.removeChild(list.firstChild);
}

function addListItem(list, text) {
  var entry = document.createElement('li');
  var textNode = document.createTextNode(text);

  entry.appendChild(textNode);
  list.appendChild(entry);
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
