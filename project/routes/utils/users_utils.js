const DButils = require("./DButils");

async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${user_id}',${player_id})`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where user_id='${user_id}'`
  );
  return player_ids;
}

async function getTop3FutureFavoriteMatches(user_id) {
  const matches_ids = await DButils.execQuery(
    `select top 3 match_id from dbo.favorite_matches where user_id='${user_id}' 
    and date_match >= CAST(CURRENT_TIMESTAMP AS datetime) ORDER BY 
    CONVERT(DateTime, date_match ,101)`
  );
  return matches_ids;
}

async function getFavoriteMatches(user_id) {
  await DButils.execQuery(`delete from dbo.favorite_matches where user_id=3 
    and date_match < CAST(CURRENT_TIMESTAMP AS datetime)`);

  const matches_ids = await DButils.execQuery(
    `select match_id from dbo.favorite_matches where user_id='${user_id}' 
    ORDER BY CONVERT(DateTime, date_match ,101)`
  );
  // const matches_ids = await DButils.execQuery(
  //   `select match_id from dbo.favorite_matches where user_id='${user_id}' 
  //   and date_match >= CAST(CURRENT_TIMESTAMP AS datetime) ORDER BY 
  //   CONVERT(DateTime, date_match ,101)`
  // );


  return matches_ids;
}

async function getFavoriteMatchesDetails(matches_ids) {

  const matches = await DButils.execQuery(
    `select host_team_id,away_team_id,date_match,stadium_id from dbo.matches where match_id
     IN (${matches_ids})  ORDER BY date_match`
  );
  return matches;
}


async function getMatchInfo(matches_ids_list) {
  let promises = [];
  matches_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

function extractRelevantMatchData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
exports.getFavoriteMatches = getFavoriteMatches;
exports.getTop3FutureFavoriteMatches = getTop3FutureFavoriteMatches;
exports.getFavoriteMatchesDetails = getFavoriteMatchesDetails;