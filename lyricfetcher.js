function _urljoin(l) {
  return l.join('/');
}

function LyricFetcher() {
  this.baseLyricsURL = "http://lyric-api.herokuapp.com/api/find";
}

LyricFetcher.prototype.getLyrics = function(artist, song, done, fail, always) {
  var encodedArtist = encodeURIComponent(artist);
  var encodedSong = encodeURIComponent(song);

  var url = _urljoin([this.baseLyricsURL, encodedArtist, encodedSong]);

  $.get(url).done(function(data) {
    if (data.err == "none")
      done(data.lyric);
    else
      fail();
  }).fail(fail).always(always);
}
