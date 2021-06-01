var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  //let team_players = [];
  try {
    const team_players = await players_utils.getPlayersByTeam(req.params.teamId);
    const prev_games = await team_utils.pastGamesInTeam(req.params.teamId);
    //we should keep implementing team page.....
    res.send(team_players);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
