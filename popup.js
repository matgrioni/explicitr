var SLIDE_ANIM_LENGTH = 500;
var ENTER_KEY = 13;

$(document).ready(function() {
  var artistText = $('#artist');
  var songText = $('#song');
  var checkButton = $('#check');

  var resultsSection = $('#results-section');
  var results = $('#results');

  artistText.on('keyup', function(e) {
    if (e.keyCode == ENTER_KEY)
      checkButton.click();
  });

  songText.on('keyup', function(e) {
    if (e.keyCode == ENTER_KEY)
      checkButton.click();
  });

  checkButton.on('click', function() {
    var slideUpDone = false;
    var requestDone = false;
    lines = []

    results.slideUp(SLIDE_ANIM_LENGTH, function() {
      slideUpDone = true;
      
      if (requestDone)
        showResults(results, lines);
    });

    var fetcher = new LyricFetcher();
    fetcher.getLyrics(artist.value, song.value, function(lyrics) {
      EXPLICIT_WORDS.forEach(function(word) {
        indexes(lyrics, word).forEach(function(index) {
          lines.push(containingLine(lyrics, index));
        });
      });

      if (lines.length == 0)
        lines.push('This song seems to be clean!');
    }, function() {
      lines.push('Error. Check spelling or server is down.');
    }, function() {
      requestDone = true;

      if (slideUpDone)
        showResults(results, lines);
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

function addListItem(list, text) {
  var entry = $('<li>');
  var textNode = document.createTextNode(text);

  entry.append(textNode);
  list.append(entry);
}

function showResults(results, items) {
  results.empty();

  items.forEach(function(item) {
    addListItem(results, item);
  });

  results.slideDown(SLIDE_ANIM_LENGTH);
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
