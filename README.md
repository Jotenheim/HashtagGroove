# HashtagGroove
Twitter semantic analysis with spotify integration

# Concept
Type in a hashtag and a spotify playlist is created. The application that parses incoming tweets using semantic analysis and generates a value between 0 and 1. This value is passed to Spotify's recommendation service which generates a song with a similar "Vibe" or "Emotional Weight".

The result is a playlist that reflects the mood of the mentions of the hashtag over time. This was created using Node.JS and is designed to run within Amazon Web Services as a means to load-balance.
