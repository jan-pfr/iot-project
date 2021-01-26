# IoT Project - Smart Home Automation

[![code size](https://img.shields.io/github/languages/code-size/jan-pfr/iot-project)]()
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/085c2e40529043ef876ae3e79517df45)](https://www.codacy.com/gh/jan-pfr/iot-project/dashboard?utm_source=github.com&utm_medium=referral&utm_content=jan-pfr/iot-project&utm_campaign=Badge_Grade) [![LICENSE](https://img.shields.io/github/license/jan-pfr/iot-project.svg)](https://github.com/jan-pfr/iot-project/blob/master/LICENSE)

This repository contains the final project for the elective course 'Internet of Things' lectured by Prof. Dr. Edgar Seemann at the Furtwangen University (HFU) in Germany.
The goal of this project is to create a virtual smart home automation system simulating a complete MQTT network. The (partially simulated) MQTT data is being cached by an HTTP server and made available via HTTP as well as via WebSockets to allow for real time updates in the dashboard. The UI is implemented in HTML/CSS with frameworks such as Font Awesome, jQuery and more. Everything runs locally and requires no further changes to run (Check the UML diagram for a detailed view of the application architecture).

The project is expected to continue after the deadline.

### How to run the application

In order to run the application you need to download Node and install it (along with npm).
Then follow these steps:

1. Open terminal into project root folder
2. Run `npm install` to install project dependencies
3. Run `node src\backend\central-server.js`
4. Run `node src\backend\mqtt-clients\weather-station.js`
5. Run `node src\backend\mqtt-clients\heating-system.js`
6. Run `node src\backend\mqtt-clients\rollerblinds.js`
7. Open src\frontend\index.html in the browser of your choice (IE not recommended)
8. Have fun :)

### How to use the dashboard

In the dashboard you'll find four central services: Heating, Weather, Blinds and System.
We will explain how each system works and how it reacts to your input.

#### System

You can speed up the simulation in the background with the simulation speed buttons to test the behavior of the system.

#### Heating

Here you find control panels for the heating elements of each room.
The temperature will drop, if you turn off the heater if its colder outside. If its hotter outside temperature will slowly rise.

#### Blinds

You can set the mode of the blinds to manual and change the value of how "open" you want the blinds to be. If set to automatic, blinds will remain shut between sunset and sunrise and open between sunrise and sunset.

#### Weather station

The weather station displays the current temperature and a description of the weather on initial load (data is fetched via HTTP GET). Additionally, alerts are displayed if they apply for the location (See screenshot).
The weather icons change depending on the weather status (over hundred different icons available).
Changing the location for the weather station in src\backend\lib\owm-call.js by changing the constant `hotLocation` in line 10 to true will allow you to experiment with the behavior of the heating system in a hot climate.

### UML Diagramm

![UML Diagramm](https://raw.githubusercontent.com/jan-pfr/iot-project/main/sha-uml.svg)

### Contributors

The following students have worked on this project:

- Alexander Hauser (hausCode)
- Jan Pfeiffer (jan-pfr)
- Benedikt Scheffbuch (BingeCode)
- Henrik Alt (henrikKar)

### Used technologies / tools

- [Node](https://nodejs.org)
- [WebSockets](socket.io)
- [MQTT](https://www.npmjs.com/package/mqtt)
- [Weather Icons](https://erikflowers.github.io/weather-icons//)
- [GitHub](https://github.com/jan-pfr/iot-project/)
- [Trello](https://trello.com/b/pqIZ0MPW/features)
