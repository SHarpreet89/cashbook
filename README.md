# Cash-Book

## Description
Cash-Book is a simple user friendly web application designed to help you monitor your expenditure. With this application you will be able to add inputs that correlate with your day to day spending and with the inputs that are provided the data would also be displayed through a generative graph as a visual represenation of your spending. You can also add notes to accompany the listed transaction to provide context when looking back at your transaction history. 


## Table of Contents

- [User Story](#user-story)
- [Website Link](#website-link)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [Features](#features)
- [Future Development](#future-development)
- [Questions](#questions)

## User Story
AS A user that needs assistance in monitoring my spending,
<br>I WANT a web application that I can use to view, add and adjust my day to day transactions</br>
<br>SO THAT I can better manage my finances</br>


## Website Link

[Visit the live site deployed on Render here.](https://cashbook-bfwb.onrender.com/)

## Technologies Used

- Handlebars.js
- PostgreSQL
- MVC architecture
- CSS & Tailwind
- HTML
- Javascript
- ESLint
- Prettier

## Installation

To utilise Cash-Book, users must first clone the repository. Once cloned, with VS Code's terminal the user must copy the .env.example file and enter their PostgresSQL details. Within VS Code's terminal, run 'npm i' to install any required packages and npm start to test the server is working. Once users see the 'App listening' message on their terminal, exit the server.

To start the open the shell and run the database, run 'psql -U postgres' in the terminal and enter a password. Enter '\i schema.sql' to initialise the database and once successful, exit the shell.

To seed the database with data, enter 'npm run seeds' in the VS Code's terminal.

This application can be used by entering 'npm start' within VS Code's terminal and then opening https://localhost3001 in your browser.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under [MIT License](https://opensource.org/licenses/MIT).

## Contributors

This project was created by the following contributors whi can be contacted on Github;

- [Harpreet Singh](https://github.com/SHarpreet89)
- [Ashlyn McGarry](https://github.com/ashlynmcgarry)
- [Phillip Lam](https://github.com/cbfcuh)
- [Arsham Nazem](https://github.com/anaz0004)

Assistance for this project was also provided via the class instructor, who helped in providing direction and explaining concepts related to the project.

## Contributing

If you would like to contribute to the project and make it better, please feel free.

## Features

- Utlise Handlebars.js
- Utlise Chart.js
- Users can signup and login
- Users can add their transactions to the provided categories
- Users can add notes to their transactions to provided context

## Future development

- Allow the user to create custom sub-categories to better track their expenditure
- Allow the user to view the generated graph in different forms such as "Pie Chart", "Line Chart" or "Polar Area Chart"
- Cleaning up the UI of the web application making it more visually appealing

## Questions

For any additional questions, please reach out to either [Harpreet Singh](https://github.com/SHarpreet89), [Ashlyn McGarry](https://github.com/ashlynmcgarry), [Phillip Lam](https://github.com/cbfcuh) or [Arsham Nazem](https://github.com/anaz0004) via Github.
