/*
 * The constructor for a lyrics fetcher. This is the interface that code will
 * use to create a lyrics fetcher. This way the fetching is independent of the
 * display.
 */
function LyricFetcher() {
  this.baseLyricsURL = "http://lyric-api.herokuapp.com/api/find";
}


/*
 * Get the song lyrics for a given song.
 *
 * Args:
 *  artist - The artist name.
 *  song - The song name.
 *  done - The callback if the request succeeds. Song lyrics are provided as the
 *         parameter.
 *  fail - The callback if the request fails. Either there is an error that the
 *         API provides, or the request never even got there.
 *  always - All callback that always runs, if success or fail.
 */
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


/*
 * Provides a URL from the given components in the list. The components are
 * joined with '/', and duplicate '/'s are removed.
 *
 * Args:
 *  comps - The components to join together.
 *
 * Returns:
 *  The joined url.
 */
function _urljoin(comps) {
  return comps.join('/').replace(/\/{2,}/, "/");
}
