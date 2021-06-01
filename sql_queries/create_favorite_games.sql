CREATE TABLE dbo.favorite_matches (

user_id int NOT NULL,
match_id int NOT NULL,
date_match datetime NOT NULL,
CONSTRAINT pk_favorite_games PRIMARY KEY (user_id,match_id)
)