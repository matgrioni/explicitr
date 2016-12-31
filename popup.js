var explicitWords = Object.freeze(['fuck', 'shit', 'nigga', 'nigger',
                                   'cunt', 'motherfucker', 'ass',
                                   'bitch', 'holy shit', 'whore']);

document.addEventListener('DOMContentLoaded', function() {
  var artistText = $('#artist');
  var songText = $('#song');
  var checkButton = $('#check');

  var resultsSections = $('.results-section');
  resultsSections.hide();
  var i = 0;
  var used = false;

  check.addEventListener('click', function() {
    var lyricsURL = azLyricsURL(artist.value, song.value);

    // TODO: Change HTTP request to jQuery usage.
    //$.get(lyricsURL, function(data) {
//
    //}, 'html');

    var http = new XMLHttpRequest();
    http.responseType = 'document';
    http.addEventListener('load', function() {
      var resultsSection = $(resultsSections.get(i));

      // Remove all prior results from the list.
      if (!used) {
        used = true;
        var results = resultsSection.find('ul');
        resultsSection.show();
      } else {
        i = (i + 1) % 2;
        var nextResultsSection = $(resultsSections.get(i));
        nextResultsSection.show();

        var results = nextResultsSection.find('ul');
        results.empty();
        resultsSection.animate({ 'marginLeft': '1000px' }, 3000, function() {
          nextResultsSection.css('margin-left', 0);
          resultsSection.hide();
        });
      }

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

function addListItem(list, text) {
  var entry = $('<li>');
  var textNode = document.createTextNode(text);

  entry.append(textNode);
  list.append(entry);
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

function urlifyArtist(artist) {
  r = /^[Tt]he |[,;:!\.\?"~%\(\)]/g
  return urlify(artist, r);
}

function urlifySong(song) {
  r = /[,;:!\.\?"~%\(\)]/g;
  return urlify(song, r);
}

function urlify(str, regex) {
  var newStr = str.trim().replace(regex, '').replace(/\s/g, '').toLowerCase();
  return newStr;
}

function azLyricsURL(artist, song) {
  return 'http://azlyrics.com/lyrics/' +
         urlifyArtist(artist) + '/' + urlifySong(song) + '.html';
}
