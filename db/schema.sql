-- Drop the database if it exists
DROP DATABASE IF EXISTS cashbook_db;
CREATE DATABASE cashbook_db;
\c cashbook_db;

-- Create Users Table
CREATE TABLE Users (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Balance DECIMAL(10, 2) DEFAULT 0.00
);

-- Create Categories Table
CREATE TABLE Categories (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID REFERENCES Users(Id),
    Name VARCHAR(50) NOT NULL
);

-- Create Transactions Table (handles both incoming and outgoing)
CREATE TABLE Transactions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID REFERENCES Users(Id),
    Name VARCHAR(100) NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Category UUID REFERENCES Categories(Id),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Type VARCHAR(10) CHECK (Type IN ('Incoming', 'Outgoing')) NOT NULL -- Specify the type of transaction
);

-- Create Notes Table (linked to Transactions)
CREATE TABLE Notes (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    TransactionId UUID UNIQUE REFERENCES Transactions(Id),
    Text TEXT
);

-- Create Recurring_Transactions Table
CREATE TABLE Recurring_Transactions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID REFERENCES Users(Id),
    Name VARCHAR(100) NOT NULL,
    Category UUID REFERENCES Categories(Id),
    Amount DECIMAL(10, 2) NOT NULL
);
