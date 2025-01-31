-- Ensure the role exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'seat-sleuth-user') THEN
    CREATE ROLE "seat-sleuth-user" WITH LOGIN PASSWORD 'seat-sleuth-password-12345';
    ALTER ROLE "seat-sleuth-user" CREATEDB;
  END IF;
END $$;

-- Ensure the database exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'seat-sleuth') THEN
    CREATE DATABASE "seat-sleuth" OWNER "seat-sleuth-user";
  END IF;
END $$;
