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

-- Create Notes Table
CREATE TABLE Notes (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- UserId UUID REFERENCES Users(Id),
    TransactionId UUID, -- Will reference either Incoming or Outgoing transactions
    Text TEXT
);

-- Create Incoming_Transactions Table
CREATE TABLE Incoming_Transactions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID REFERENCES Users(Id),
    Name VARCHAR(100) NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Category UUID REFERENCES Categories(Id),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Notes UUID REFERENCES Notes(Id)
);

-- Create Outgoing_Transactions Table
CREATE TABLE Outgoing_Transactions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID REFERENCES Users(Id),
    Name VARCHAR(100) NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Category UUID REFERENCES Categories(Id),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Notes UUID REFERENCES Notes(Id)
);

-- Create Recurring_Transactions Table
CREATE TABLE Recurring_Transactions (
    Id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    UserId UUID REFERENCES Users(Id),
    Name VARCHAR(100) NOT NULL,
    Category UUID REFERENCES Categories(Id),
    Amount DECIMAL(10, 2) NOT NULL
);