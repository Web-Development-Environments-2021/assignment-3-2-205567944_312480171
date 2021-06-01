const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";
const SEASON_ID = 17328;


async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },  
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

async function getTeamsIdsBySeason() {
  let teams_ids_list = [];
  const teams = await axios.get(`${api_domain}/teams/season/${SEASON_ID}`, {
    params: {
      api_token: process.env.api_token,
    },  
  });
  teams.data.data.map((team) =>
  teams_ids_list.push(team.id)
  );
  return teams_ids_list;
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
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


function extractRelevantPlayerData(players_info) {
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

function extractRelevantPlayerDataChange(players) {
  return players.map((player_info) => {
    const { fullname, image_path, position_id } = player_info;
    const { name } = player_info.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

async function getFullPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
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
  return extractFullPlayerData(players_info);
}

function extractFullPlayerData(players_info) {

  return players_info.map((player_info) => {
    const { fullname, image_path, position_id, common_name,nationality,birthdate,birthcountry,height,weight } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
      common_name: common_name,
      nationality: nationality,
      birth: birthdate,
      birthcountry: birthcountry,
      height: height,
      weight: weight
    };
  });
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}


async function searchPlayerByName(player_name) {

  const playersByName = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      api_token: process.env.api_token,
      include: "team",
    },
  });

  let relevant_players = [];
  for (let i = 0; i < playersByName.data.data.length; i++){
      if(playersByName.data.data[i].team != null){
        if(playersByName.data.data[i].team.data.current_season_id == SEASON_ID){
          relevant_players.push(playersByName.data.data[i]);
        }
      }
  }

  if (relevant_players.length == 0) {
    return relevant_players;
  }

  return extractRelevantPlayerDataChange(relevant_players);
}

async function searchPlayerByNameAndByPosition(player_name, position) {

  players_with_name = searchPlayerByName(player_name);

  let relevant_players = [];
  for (let i = 0; i < players_with_name.data.data.length; i++){
    if(players_with_name.data.data[i].position_id == position){
      relevant_players.push(players_with_name.data.data[i]);
    }
      
  }

  if (relevant_players.length == 0) {
    return relevant_players;
  }

  return extractRelevantPlayerDataChange(relevant_players);
}


exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getFullPlayersInfo = getFullPlayersInfo;
exports.searchPlayerByName = searchPlayerByName;
