CREATE TABLE dbo.matches (
match_id int UNIQUE NOT NULL,
host_team_id int NOT NULL,
away_team_id int NOT NULL,
date_match smalldatetime NOT NULL,
stadium_id int NOT NULL,
referee_id int NOT NULL,
match_result varchar
)
