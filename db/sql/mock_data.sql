-- Clean up only mocked data
DELETE FROM challenges_player_association WHERE challenge_id IN ('challenge1','challenge2','challenge3','challenge4','challenge5');
DELETE FROM challenges WHERE id IN ('challenge1','challenge2','challenge3','challenge4','challenge5');
DELETE FROM players WHERE id IN ('player1','player2','player3','player4','player5','player6');
DELETE FROM places WHERE id IN ('place1','place2','place3','place4');
DELETE FROM User WHERE username IN ('alice_user','bob_user','charlie_user','diana_user','eve_user','frank_user');

-- Insert into User
INSERT INTO User (username, firstName, lastName, email) VALUES
  ('alice_user', 'Alice', 'Johnson', 'alice@example.com'),
  ('bob_user', 'Bob', 'Smith', 'bob@example.com'),
  ('charlie_user', 'Charlie', 'Brown', 'charlie@example.com'),
  ('diana_user', 'Diana', 'Wilson', 'diana@example.com'),
  ('eve_user', 'Eve', 'Davis', 'eve@example.com'),
  ('frank_user', 'Frank', 'Miller', 'frank@example.com');

-- Insert into places
INSERT INTO places (id, name, lat, long, status) VALUES
  ('place1', 'Downtown Foosball Club', 40.7128, -74.0060, 1),
  ('place2', 'Uptown Arena', 40.7831, -73.9712, 1),
  ('place3', 'Suburb Sports Center', 40.6782, -73.9442, 1),
  ('place4', 'City Park Table', 40.7306, -73.9352, 0);

-- Insert into players
INSERT INTO players (id, name, expertise, points) VALUES
  ('player1', 'Alice', 'EXPERT', 1200),
  ('player2', 'Bob', 'INTERMEDIATE', 800),
  ('player3', 'Charlie', 'BEGINNER', 300),
  ('player4', 'Diana', 'EXPERT', 1500),
  ('player5', 'Eve', 'INTERMEDIATE', 650),
  ('player6', 'Frank', 'BEGINNER', 150);

-- Insert into challenges
INSERT INTO challenges (id, name, type, status, date, place_id, player_owner_id, createdAt, lastUpdate) VALUES
  ('challenge1', 'Morning Match', 'MORNING', 'ACTIVE', '2024-12-20 09:00:00', 'place1', 'player1', '2024-12-19 08:00:00', '2024-12-19 08:00:00'),
  ('challenge2', 'Evening Doubles', 'EVENING', 'OPEN', '2024-12-21 18:00:00', 'place2', 'player2', '2024-12-20 17:00:00', '2024-12-20 17:00:00'),
  ('challenge3', 'Lunch Break Game', 'AFTERNOON', 'ACTIVE', '2024-12-20 12:30:00', 'place3', 'player3', '2024-12-19 11:30:00', '2024-12-19 11:30:00'),
  ('challenge4', 'Weekend Tournament', 'MORNING', 'OPEN', '2024-12-22 10:00:00', 'place4', 'player4', '2024-12-21 09:00:00', '2024-12-21 09:00:00'),
  ('challenge5', 'Night Owls', 'NIGHT', 'TERMINATED', '2024-12-19 22:00:00', 'place1', 'player5', '2024-12-18 21:00:00', '2024-12-19 21:30:00');

-- Insert into challenges_player_association
INSERT INTO challenges_player_association (challenge_id, player_id) VALUES
  ('challenge1', 'player1'),
  ('challenge1', 'player2'),
  ('challenge2', 'player2'),
  ('challenge2', 'player3'),
  ('challenge2', 'player4'),
  ('challenge3', 'player3'),
  ('challenge3', 'player5'),
  ('challenge4', 'player4'),
  ('challenge4', 'player1'),
  ('challenge4', 'player6'),
  ('challenge5', 'player5'),
  ('challenge5', 'player2'),
  ('challenge5', 'player6'); 