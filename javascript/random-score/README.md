Random-score sample game
=====================

To use this sample you have to:

- Create an account on the [Scoreflex platform](http://developer.scoreflex.com/ "Scoreflex developer site") (if you don't have one already).
- Create a game -or modify an existing one- (check the **Web** option in the list of available platforms).
- Configure a **leaderboard** and a **challenge** for your game (see configurations below).
- Checkout the sample files and copy the [Scoreflex Javascript SDK](https://github.com/scoreflex/scoreflex-javascript-sdk "Scoreflex Javascript SDK on GitHub")
to the *random-score/scoreflexSDK/* folder.
- Edit the *game.js* file and update the `clientId` and `clientSecret` variables
with your game's identifiers.

------

The Random-score javascript sample focuses on the following Scoreflex SDK usages:

* play with a leaderboard
    - send scores to a leaderboard
    - catch events to play the game for a given leaderboard 
* play a simple challenge (use 2 different browsers to play a challenge).
    - catch events to play the game in "challenge mode"
    - send score for a challenge
    
This sample shows no real gameplay. When pushed, a button just generate a random
score. Thus, you can study the source to understand the use of the Scoreflex
Javascript SDK without too much off-topic code.


Configurations
--------------

**Set up a leaderboard**

Id: *BestScores*

Raw JSON configuration:

    {
        "collapsingMode": "best",
        "forceMeta": false,
        "geoScopes": ["*"],
        "label": {
            "en": "Best scores"
        },
        "locationMode": "playerHomeNearby",
        "maxScore": 9223372036854775807,
        "minScore": 0,
        "order": "score:desc,time:desc",
        "sameRankScoreEq": true,
        "scoreFormatter": {
            "type": "integer",
            "unit": {
                "compact": {
                    "plural": [],
                    "singular": []
                },
                "full": {
                    "plural": [],
                    "singular": []
                }
            }
        },
        "scoreMode": "best",
        "timePolicy": "anytime"
    }


**Set up a challenge**

Id: *attemptSum3* (actually you can choose whatever you want) 

Raw JSON configuration:

    {
        "challengeEndConditions": {
            "duration": 2592000000,
            "maxTurnsPerPlayer": 3,
            "scoreToBeatLimits": ["time","playingTime"]
        },
        "displayDescription": {
            "en": "3 attempts, make sum the highest !"
        },
        "displayName": {
            "en": "Best addition"
        },
        "outcomeConfig": {
            "sameRankScoreEq": true,
            "scoreAggregation": "sum",
            "scoreFormatter": {
                "type": "integer",
                "unit": {
                    "compact": {
                        "plural": [],
                        "singular": []
                    },
                    "full": {
                        "plural": [],
                        "singular": []
                    }
                }
            },
            "scoreOrder": "score:desc,time:asc",
            "showScoresPolicy": "byCycle",
            "winnersCount": 1
        },
        "participantsConfig": {
            "improveParticipantCountTimeout": 5000,
            "invitationTimeout": 86400000,
            "validParticipantCounts": [2]
        },
        "replayable": false,
        "turnConfig": {
            "initialTurnStrategy": "joinTimeDesc",
            "turnStrategy": "repeat",
            "turnTimeout": 259200000
        }
    }