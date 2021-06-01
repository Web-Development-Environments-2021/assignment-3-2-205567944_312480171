const axios = require("axios");
const { DateTime } = require("mssql");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const SEASON_ID = 17328;

async function searchTeamByName(team_name) {
    const teamsByName = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
          api_token: process.env.api_token,
          //include: "team",
        },
    });

    let relevant_teams = [];
    for (let i = 0; i < teamsByName.data.data.length; i++){
        if(teamsByName.data.data[i].current_season_id == SEASON_ID){
            relevant_teams.push(teamsByName.data.data[i]);
        }
    }
    if (relevant_teams.length == 0)
        return relevant_teams;
    return extractRelevantTeamData(relevant_teams);
  }
  
function extractRelevantTeamData(teams_array) {
  return teams_array.map((team) => {
    const { name, logo_path} = team;
    return {
      team_name: name,
      logo: logo_path,
    };
  });
}

//async function createEventLog()

function createGame(game) {
  let events_log = [];
  for (let i = 0 ; i < game.events.data.length; i++) {
    
    let event = new Object();
    event.date = game.time.starting_at.date;
    let date = new Date(game.time.starting_at.date_time);
    
    event.hour = new Date(date.getTime() + game.events.data[i].minute*60000).toString().substr(16,5);
    event.minute = game.events.data[i].minute;
    event.description = game.events.data[i].type;
    event.name_player = game.events.data[i].player_name;      
    events_log.push(event);
  }
  return {
    date_game : game.time.starting_at.date,
    hour : game.time.starting_at.time,
    local_team : game.localTeam.data.name,
    visitor_team : game.visitorTeam.data.name,
    venue : game.venue.data.name,
    image_venue : game.venue.data.image_path,
    result : game.scores.ft_score,
    referee : game.referee.data.common_name,
    events: events_log
  };
}

function extractRelevantPastGamesTeamsData(prev_games) {

  let games = [];
  for (let i = 0 ; i < prev_games.length; i++) {
    games.push(createGame(prev_games[i]));
  }

  return games;
}

async function pastGamesInTeam(team_id) {
  
  let start_date = '2020-09-11';
  var today = new Date();
  var end_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const prev_games = await axios.get(`${api_domain}/fixtures/between/${start_date}/${end_date}/${team_id}`, {
      params: {
        api_token: process.env.api_token,
        include: "visitorTeam,venue,referee,localTeam,events",
      },
  });

  if (prev_games.data.data.length == 0)
      return prev_games.data.data;
  return extractRelevantPastGamesTeamsData(prev_games.data.data);
}

  exports.searchTeamByName = searchTeamByName;
  exports.pastGamesInTeam = pastGamesInTeam;