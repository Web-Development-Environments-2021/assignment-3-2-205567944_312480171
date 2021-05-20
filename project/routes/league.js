var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});

async function getLeague() {

  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${league_id}`,
    {
      params: {
        api_token: process.env.footbal_api_token,
        //include:
      },
    }
  );

}

module.exports = router;
