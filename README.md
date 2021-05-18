[![GPL-3.0 License][license-shield]][license-url] [![Docker Pulls][docker-shield]][docker-url] [![Run on Repl.it][replit-shield]][replit-url] [![Discord Server][discord-shield]][discord-url] [![Contributors][contributors-shield]][contributors-url]

<br />
<p align="center">
  <a href="https://github.com/OhMyGuus/BetterCrewLink-server">
    <img src="logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">BetterCrewLink Server</h3>

  <p align="center">
    Voice Relay server for <a href="https://github.com/OhMyGuus/BetterCrewLink">BetterCrewLink</a>.
    <br />
    <a href="https://github.com/OhMyGuus/BetterCrewLink-server/issues">Report Bug</a>
    ·
    <a href="https://github.com/OhMyGuus/BetterCrewLink-server/issues">Request Feature</a>
  </p>
</p>
<hr />

<p>

<!-- NOTES -->
<b>Notes:</b><br />

- This is an unofficial fork of CrewLink, for any problem, issue or suggestion you have with BetterCrewLink talk to us on our [Discord](https://discord.gg/qDqTzvj4SH), or [GitHub](https://github.com/OhMyGuus/BetterCrewLink-server/issues) or message me on Discord ([ThaGuus#2140](https://discordapp.com/users/508426414387757057)) do not report any problems to the official Discord or GitHub project of CrewLink as they will not support you.

- I recommend you use my BetterCrewLink server: <a href="https://bettercrewl.ink">`https://bettercrewl.ink`</a>, it is quite stable and most people are using it and I highly recommend it if you don't know a lot about how to host servers, but if you do and how to host anyway, feel free with the open source.

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Deploy to Heroku](#deploy-to-heroku)
* [Deploy to Repl.it](#deploy-to-replit)
* [Docker Quickstart](#docker-quickstart)
  * [Building the Docker Image](#building-the-docker-image)
* [Manual Installation](#manual-installation)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Customizing Peer to Peer Behavior](#customizing-peer-to-peer-behavior)
* [Contributing](#contributing)
  * [Contributors](#contributors)
* [License](#license)

<!-- ABOUT THE PROJECT -->
## About The Project

This is the relay server for CrewLink, an Among Us proximity voice chat program. I am currently hosting a server at <a href="https://bettercrewl.ink">`https://bettercrewl.ink`</a>, but if you want to make your own server, feel free to open source the server.

## Environment Variables

Optional environment variables:

 - `PORT`: Specifies the port that the server runs on. Defaults to `443` if `HTTPS` is enabled, and `9736` if not.
 - `HOSTNAME`: The hostname or IP of the server (a record without a proxy so if you have cloudflare make a extra dns record named for example direct.domain.com and disable the proxy for that record (this is for the turn server)
 - `NAME`: Specifies the server name
 - `HTTPS`: Enables https. You must place `privkey.pem` and `fullchain.pem` in your CWD.
 - `SSLPATH`: Specifies an alternate path to SSL certificates.

## Deploy to Heroku

To get up and running quickly, you can deploy to Heroku clicking on the button below:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

This will deploy an instance of the BetterCrewLink-server. You can get the URL of your server by using the app name that you gave when you launched the app on Heroku and appending `.herokuapp.com`. You can also find the URL of your server by going to "Settings", scrolling down to "Domains". Using this URL, follow step 4 of the [installation instructions](https://github.com/OhMyGuus/BetterCrewLink-server#manual-installation) to connect your client to your server instance.

## Deploy to Repl.it

Another way to host your server besides using Heroku it's the Repl.it that provide you to host servers completely free without having time per month, and you can deploy it by clicking on this button below:

[![Run on Repl.it][replit-shield]][replit-url]

This will deploy an instance of the BetterCrewLink-server. You can get the URL of your server by using the app name that you gave when you launched the app on Repl.it and appending `[your-username.repl.co]`. You can also find the URL of your server by going to "Web View". Using this URL, follow step 4 of the [installation instructions](https://github.com/OhMyGuus/BetterCrewLink-server#manual-installation) to connect your client to your server instance.

## Docker Quickstart

Run the server with [Docker](https://docs.docker.com/get-docker/) by running the following command:

```
docker run -d -p 9736:9736 ohmyguus/bettercrewlink-server:latest
```

To change the external port the server uses, change the *first* instance of the port. For example, to use port 8123:

```
docker run -d -p 8123:9736 ohmyguus/bettercrewlink-server:latest
```

### Building the Docker Image

To build your own Docker image, do the following:

1. Clone the repo
```sh
git clone https://github.com/OhMyGuus/BetterCrewLink-server.git
cd BetterCrewLink-server
```

2. Run the Docker build command:
```sh
docker build -t ohmyguus/bettercrewlink-server:build .
```

## Manual Installation

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* [node.js](https://nodejs.org/en/download/)
* yarn
```sh
npm install yarn -g
```

### Installation

1. Clone the repo
```sh
git clone https://github.com/OhMyGuus/BetterCrewLink-server.git
cd BetterCrewLink-server
```
2. Install NPM packages
```sh
yarn install
```
3. Compile and run the project
```JS
yarn start
```
4. Copy your server URL into CrewLink settings. Make sure everyone in your lobby is using the same server.
### Customizing Peer to Peer Behavior
By default CrewLink clients will attempt to establish connections directly to each other for sending voice and game 
state data. As a fallback mechanism, CrewLink-server ships with an integrated TURN server in the event clients cannot
directly connect to each other. You may want to customize this behavior to, for example, exclusively use the TURN relay
to protect player IP addresses. To do so, head into the ``config`` folder and rename ``peerConfig.example.yml`` to
``peerConfig.yml`` and make the desired changes.

<!-- CONTRIBUTING -->
## Contributing

Any contributions you make are greatly appreciated.

1. [Fork the Project](https://github.com/OhMyGuus/BetterCrewLink-server/fork)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contributors

[![Contributors][contributors-shield]][contributors-url]

* [OhMyGuus](https://github.com/OhMyGuus) for make various things for [BetterCrewLink](https://github.com/OhMyGuus/BetterCrewLink), example: NAT Fix, more overlays, support for Mobile and owner of project
* [ottomated](https://github.com/ottomated) for make [CrewLink](https://github.com/ottomated/CrewLink)
* [vrnagy](https://github.com/vrnagy) for make WebRTC reconnects automatically for [BetterCrewLink](https://github.com/OhMyGuus/BetterCrewLink)
* [TheGreatMcPain](https://github.com/TheGreatMcPain) & [Donokami](https://github.com/Donokami) for make support for Linux
* [squarebracket](https://github.com/squarebracket) for make support overlay for Linux
* [JKohlman](https://github.com/JKohlman) for make various things for [BetterCrewLink](https://github.com/OhMyGuus/BetterCrewLink), example: push to mute, visual changes and making Multi Stage builds for [BetterCrewLink Server](https://github.com/OhMyGuus/BetterCrewLink-server)
* [Diemo-zz](https://github.com/Diemo-zz) for make the default Voice Server for: <a href="https://bettercrewl.ink">`https://bettercrewl.ink`</a>
* [KadenBiel](https://github.com/KadenBiel) for make various things for [BetterCrewLink Mobile](https://github.com/OhMyGuus/BetterCrewlink-mobile), example: Better UI, Settings page
* [adofou](https://github.com/adofou) for make new parameters for node-turn server for [BetterCrewLink-Server](https://github.com/OhMyGuus/BetterCrewLink-server)
* [Kore-Development](https://github.com/Kore-Development) for make support for Repl.it and gitignore changes for [BetterCrewLink-Server](https://github.com/OhMyGuus/BetterCrewLink-server)
* [cybershard](https://github.com/cybershard) & [edqx](https://github.com/edqx) for make Only hear people in vision, Walls block voice and Hear through cameras
* [electron-overlay-window](https://github.com/SnosMe/electron-overlay-window) for make it easier to do overlays
* [node-keyboard-watcher](https://github.com/OhMyGuus/node-keyboard-watcher) for make it easy to push to talk and push to mute
* [MatadorProBr](https://github.com/MatadorProBr) for make this list of Contribuators, better README.md, wiki

A big thank you to all those people who contributed and still contribute to this project to stay alive, thank you for being part of this BetterCrewLink community!

## License

Distributed under the GNU General Public License v3.0. See <a href="https://github.com/OhMyGuus/BetterCrewLink-server/blob/master/LICENSE">`LICENSE`</a> for more information.

[license-shield]: https://img.shields.io/github/license/OhMyGuus/BetterCrewLink-server?label=License
[license-url]: https://github.com/OhMyGuus/BetterCrewLink-server/blob/master/LICENSE
[docker-shield]: https://img.shields.io/docker/pulls/ohmyguus/bettercrewlink-server?label=Docker%20Pulls
[docker-url]: https://hub.docker.com/repository/docker/ohmyguus/bettercrewlink-server
[replit-shield]: https://repl.it/badge/github/OhMyGuus/BetterCrewLink-server
[replit-url]: https://repl.it/github/OhMyGuus/BetterCrewLink-server
[discord-shield]: https://img.shields.io/discord/791516611143270410?color=cornflowerblue&label=Discord&logo=Discord&logoColor=white
[discord-url]: https://discord.gg/qDqTzvj4SH
[contributors-shield]: https://img.shields.io/github/contributors/OhMyGuus/BetterCrewLink-server?label=Contributors
[contributors-url]: https://github.com/OhMyGuus/BetterCrewLink-server/graphs/contributors
