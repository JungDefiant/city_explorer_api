DROP TABLE locations

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255)
  formatted_query TEXT,
  latitude FLOAT,
  longitude FLOAT)