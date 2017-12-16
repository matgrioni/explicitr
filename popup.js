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
    nodes = []

    results.slideUp(SLIDE_ANIM_LENGTH, function() {
      slideUpDone = true;
      
      if (requestDone)
        showResults(results, nodes);
    });

    var fetcher = new LyricFetcher();
    fetcher.getLyrics(artist.value, song.value, function(lyrics) {
      EXPLICIT_WORDS.forEach(function(word) {
        indexPairs(lyrics, word).forEach(function(indexPair) {
          var format = formattedContainingLine(lyrics, indexPair[0],
                                             indexPair[1]);
          var node = createBoldNode(format[0], format[1], format[2]);
          nodes.push(node);
        });
      });

      if (nodes.length == 0)
        nodes.push(createTextNode('This song seems to be clean!'));
    }, function() {
      nodes.push(createTextNode('Error. Check spelling or server is down.'));
    }, function() {
      requestDone = true;

      if (slideUpDone)
        showResults(results, nodes);
    });
  });
});


function indexPairs(str, sub) {
  var found = []
  var index = 0;
  while (index < str.length - sub.length + 1) {
    var next = str.indexOf(sub, index);

    if (next != -1) {
      found.push([next, next + sub.length]);
      index = next + sub.length;
    } else {
      index++;
    }
  }

  return found;
}

function createBoldNode(text, start, end) {
  var boldNode = document.createElement("b");
  var boldTextNode = document.createTextNode(text.slice(start, end));
  boldNode.append(boldTextNode);

  var priorNode = document.createTextNode(text.slice(0, start));
  var afterNode = document.createTextNode(text.slice(end));

  var span = document.createElement("span");
  span.append(priorNode);
  span.append(boldNode);
  span.append(afterNode);

  return span;
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function addListNode(list, node) {
  var entry = $('<li>');
  entry.append(node);
  list.append(entry);
}

function showResults(results, nodes) {
  results.empty();

  nodes.forEach(function(node) {
    addListNode(results, node);
  });

  results.slideDown(SLIDE_ANIM_LENGTH);
}

function formattedContainingLine(str, startIndex, endIndex) {
  var lineStartIndex = startIndex;
  while (lineStartIndex > -1 && str.charAt(lineStartIndex) !== '\n')
    lineStartIndex--;
  lineStartIndex++;

  var lineEndIndex = endIndex;
  while (lineEndIndex < str.length && str.charAt(lineEndIndex) !== '\n')
    lineEndIndex++;

  var subStartIndex = startIndex - lineStartIndex;
  var subEndIndex = endIndex - lineStartIndex;

  return [str.slice(lineStartIndex, lineEndIndex), subStartIndex, subEndIndex];
}
