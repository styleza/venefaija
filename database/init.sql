CREATE TABLE wind_records (timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, speed real, direction real);
CREATE TABLE gps_records (timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, lon real, lat real, elevation real, speed real, heading real);
CREATE TABLE temp_records (timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, temp real);
