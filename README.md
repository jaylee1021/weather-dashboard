# Aviation Weather Dashboard

Welcome to the Aviation Weather Dashboard. This dashboard provides up-to-date weather information and compares it with the specified operating parameters. Based on this comparison, it delivers a clear "Go" or "No-Go" decision for users.

# Deployment

- Frontend deployed on [Netlify](https://flight-test-weather-dashboard.netlify.app/)
- Backend deployed on [Heroku](https://weather-dashboard-server-8642d019957b.herokuapp.com)
- Backend [Github](https://github.com/jaylee1021/weather-dashboard-server)

# Built with

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![NODE.JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)
![JWT](https://img.shields.io/badge/JSON%20Web%20Tokens-000000.svg?style=for-the-badge&logo=JSON-Web-Tokens&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3.svg?style=for-the-badge&logo=Bootstrap&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)

# Preview Screen

## Mainpage

- User can select one of the pre-inserted `sites`. (Adding/deleting new sites will be added in future)
- `Wind unit` can be switched between knots and m/s.
- The website saves users' site selection and wind unit preferences in local storage, ensuring that when the users return, they can pick up right where they left off.
- `Manual Refresh` button fetches the weather data from the API and updates it on the page instantly.
- `Return To Default` button returns the 'Test Card Op Window' to default values.
- Based on the compareson between current weather and Test Card Op window, user will see `Go` or `No-Go` and breaching limit on the right of the screen.\

![Mainpage](public/main.png)

## Chart

- Utilizing Google Chart for react to show 3 hours back and 7 hours of forecast selected weather.

![Chart](public/chart.png)

## Show/Hide Op Window

- User can pick and choose which criteria to show on the main page. If a criteria is hidden, it won't affect Go or No-Go.

![Show/hide](public/show_hide.png)

## Update Op Window

- User can change the Test Card Op Window for different test cards.

![Update_Op_window](public/op_window_update.png)

## Login / Signup

- User can either signup and login or use demo account to use the dashboard.
- Each user data is saved in MongoDB database.
- Test Card Op Window is saved on each user profile. So every user can have different op window.

![Login](public/login.png) ![Signup](public/signup.png)

# Features in progress

- ~~Add current and forecasted air quality~~
- Dark mode feature
- Add or remove sites with lat and long coordinates
- Add or remove weather indicators
- Add op window on chart

# Limitation

- Due to limitation weather source from Weather API, not all applicable aviation weather data are available.

# Sources

- [Weather API](https://www.weatherapi.com/): Provides current weather and refreshes every 15 mins. Also, provides 48 hour weather forecast.
- [Air Quality API (Open-Meteo)](https://open-meteo.com/): Provides current and forecasted air quality data.
