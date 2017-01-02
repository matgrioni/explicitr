var explicitWords = Object.freeze(['fuck', 'shit', 'nigga', 'nigger',
                                   'cunt', 'motherfucker', 'ass',
                                   'bitch', 'holy shit', 'whore']);

var SLIDE_ANIM_LENGTH = 500;

document.addEventListener('DOMContentLoaded', function() {
  var artistText = $('#artist');
  var songText = $('#song');
  var checkButton = $('#check');

  var resultsSection = $('#results-section');
  var results = $('#results');

  check.addEventListener('click', function() {
    var lyricsURL = azLyricsURL(artist.value, song.value);

    lines = []
    $.get(lyricsURL).done(function(data) {
      // Get the lyrics from the document object retrieved, and
      // replace all <br> occurences with new line characters.
      var doc = $(data);
      var lyrics = azLyricsFromDOM(doc);
      lyrics = lyrics.replace(/<br>/g, '\n').replace(/<.+>/g, '');

      // TODO: Two loops here when only one is needed.
      var explicitIndexes = explicitWords.reduce(function(acc, word) {
        return acc.concat(indexes(lyrics, word));
      }, []);

      if (explicitIndexes.length > 0) {
        explicitIndexes.forEach(function(index) {
          lines.push(containingLine(lyrics, index));
        });
      } else {
        lines.push('This song seems to be clean!');
      }
    }).fail(function() {
      lines.push('No such song. Check spelling');
    }).always(function() {
      results.slideUp(SLIDE_ANIM_LENGTH, function() {
        results.empty();

        lines.forEach(function(line) {
          addListItem(results, line);
        });

        results.slideDown(SLIDE_ANIM_LENGTH);
      });
    });
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
  var contentDiv = dom.find('.col-xs-12.col-lg-8.text-center')[0];

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
