-- Ensure the role exists
DO $$
DECLARE user_exists INT;
BEGIN
  SELECT COUNT(*) INTO user_exists FROM pg_roles WHERE rolname = 'seat-sleuth-user';
  IF user_exists = 0 THEN
    CREATE ROLE "seat-sleuth-user" WITH LOGIN PASSWORD 'seat-sleuth-password-12345';
    ALTER ROLE "seat-sleuth-user" CREATEDB;
  END IF;
END $$ LANGUAGE plpgsql;

-- Ensure the database exists
DO $$
DECLARE db_exists INT;
BEGIN
  SELECT COUNT(*) INTO db_exists FROM pg_database WHERE datname = 'seat-sleuth';
  IF db_exists = 0 THEN
    CREATE DATABASE "seat-sleuth" OWNER "seat-sleuth-user";
  END IF;
END $$ LANGUAGE plpgsql;

-- Assign ownership
ALTER DATABASE "seat-sleuth" OWNER TO "seat-sleuth-user";