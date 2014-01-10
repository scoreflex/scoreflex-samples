var myGame = (function() {
  /* Scoreflex identifiers */
  // FILL THIS VARIABLES
  var gameName = 'myGameName';
  var clientId = 'xxxxyyyyzzzz';
  var clientSecret = 'wwwwxxxxyyyyzzzz';
  var defaultLeaderboard = 'BestScores';

  var useSandbox = true;

  // init Scoreflex
  var ScoreflexSDK = Scoreflex(clientId, clientSecret, useSandbox);
  var soloLeaderboard = ScoreflexSDK.Leaderboards.get(defaultLeaderboard);


  /*====================*/
  /*== GAME INTERNAL ==*/

  // helper
  var listenEvent = function(element, eventType, handler) {
    if(element.addEventListener) {
      element.addEventListener(eventType, handler, false);
    }
    else if(element.attachEvent) {
      element.attachEvent( "on" + eventType, handler);
    }
  };

  /* RAND GAME */
  var gameBox = document.getElementById("game");
  var scoreBox = document.getElementById("score");

  /* CONTEXT */
  var context = {
    mode: 'solo',
    params: {leaderboardId: defaultLeaderboard}
  };
  var displaySoloMode = function(leaderboardId) {
    game.classList.remove('mode_challenge');
    game.classList.add('mode_solo');
    context.mode = 'solo';
    context.params = {leaderboardId: leaderboardId};
    scoreBox.innerHTML = 0;
  };
  var displayChallengeMode = function(challenge) {
    game.classList.remove('mode_solo');
    game.classList.add('mode_challenge');
    context.mode = 'challenge';
    context.params = {
      challenge:challenge
    };
    scoreBox.innerHTML = 0;
  };

  /* CHANGE GAME CONTEXT (solo/challenge) */
  var playSolo = document.getElementById("actionPlaySolo");
  playSolo.onclick = function() {
    displaySoloMode(defaultLeaderboard);
  };

  var showChallenges = document.getElementById("actionShowChallenges");
  showChallenges.onclick = function() {
    ScoreflexSDK.Challenges.showChallenges();
  };

  var playLeaderboard = function(leaderboardId) {
    displaySoloMode(leaderboardId);
  };

  var playChallengeInstance = function(challenge) {
    displayChallengeMode(challenge);
  };

  /* STATUS */
  var statusNfo = document.getElementById("status");
  var statusTimer = null;
  var setStatus = function(text, timeout) {
    if (statusTimer) clearTimeout(statusTimer);
    statusNfo.innerHTML = text;
    if (timeout) {
      statusTimer = setTimeout((function(scope){
        return function() {
          statusNfo.innerHTML = "&nbsp;";
        };
      })(this), timeout);
    }
  };

  /* GAME PLAY */
  var playButton = document.getElementById("playButton");
  playButton.onclick = function() {
    var score = Math.floor(Math.random() * 1000) + 300;
    scoreBox.innerHTML = score;
    if (context.mode === 'solo') {
      sendSoloScore();
    }
    else if (context.mode === 'challenge') {
      sendChallengeScore();
    }
  };


  /*==========================*/
  /*== SCOREFLEX SDK CALLS ==*/

  /* SOLO : send score request */
  var sendSoloScore = function() {
    if (context.mode === 'solo') {
      var score = parseInt(scoreBox.innerHTML, 10);
      soloLeaderboard.submitScoreAndShowRankbox(score);
      setStatus("Sending score ...", 1000);
    }
  };

  /* CHALLENGE : send score request */
  var sendChallengeScore = function() {
    if (context.mode === 'challenge') {
      var score = parseInt(scoreBox.innerHTML, 10);
      var challengeInstance = context.params.challenge;
      setStatus("Sending score ...", 2500);
      challengeInstance.submitTurnScore(score, {}, {
        onload: function() {
          // the score is not available in real time. Wait 2 seconds.
          setTimeout(
            (function(scope) {
              return function() {
                scope.showDetails();
                setStatus("Sent", 1000);
              };
            })(challengeInstance),
            2000
          );
        }
      });
    }
  };

  /* Other Scoreflex game-related requests */
  var showLeaderboard = document.getElementById("actionShowLeaderboard");
  showLeaderboard.onclick = function() {
    soloLeaderboard.show({collapsingMode:'none'});
  };

  var showRankbox = document.getElementById("actionShowRankbox");
  showRankbox.onclick = function() {
    soloLeaderboard.showRankbox();
  };

  var showProfile = document.getElementById("actionShowProfile");
  showProfile.onclick = function() {
    var currentPlayer = ScoreflexSDK.Players.getCurrent();
    if (currentPlayer) {
      currentPlayer.showProfile();
    }
  };

  /* Scoreflex debug requests */
  var sendPing = document.getElementById("actionPing");
  sendPing.onclick = function() {
    ScoreflexSDK.ping({
      onload: function() {
        var pong = (this.responseJSON || {}).pong || false;
        console.log(pong ? 'pong' : 'error');
      },
      onerror: function() {
        console.log('error');
      }
    });
  };

  var getPlayer = document.getElementById("actionGetPlayer");
  getPlayer.onclick = function() {
    var currentPlayer = ScoreflexSDK.Players.getCurrent();
    if (currentPlayer) {
      console.log(currentPlayer.getData());
    }
  };

  var closeWebClient = document.getElementById("actionCloseWebClient");
  closeWebClient.onclick = function() {
    ScoreflexSDK.WebClient.close();
  };

  var resetSession = document.getElementById("actionReset");
  resetSession.onclick = function() {
    ScoreflexSDK.reset();
    window.location.href = window.location.href;
  };

  /* Scoreflex events listening */
  var sfxEventHandler = function(event) {
    var eventData = event.data || {};
    var name = eventData.name;
    if (name === 'session') {
      if (eventData.login === true) {
        console.log("User just logged into Scoreflex.");
      }
      else if (eventData.logout === true) {
        console.log("User just logged out Scoreflex.");
      }
    }
    else if (name === 'play') {
      var leaderboardId = eventData.leaderboardId;
      playLeaderboard(leaderboardId);
      console.log("Run game for leaderboardId: "+leaderboardId);
    }
    else if (name === 'challenge') {
      var challengeInstance = eventData.challenge;
      var challengeInstanceId = challengeInstance.getInstanceId();
      var challengeConfigId = challengeInstance.getConfigId();
      playChallengeInstance(challengeInstanceId, challengeConfigId);
      console.log('Run challenge config:'+challengeConfigId+ ' - instance: '+challengeInstanceId);
    }
  };
  listenEvent(window, 'ScoreflexEvent', sfxEventHandler);

})();

