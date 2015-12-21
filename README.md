## What is this?
A top down sprite based multiplayer spaceship game with authoratative physics written exclusively in Javascript.
Also includes a simple master server, which supports anonymous play in addition to authentication via google.

Gameplay is implemented using an entity component system that is shared between the server and client. 

The start script runs docker commands which create 3 game servers and a login server backed by a mongo database. 
Users can play as a guest, or login with their google account.

Logged in users will be assigned to the game server with the least load.

## How to run:

Install docker-toolbox
`https://www.docker.com/docker-toolbox`

Open the docker quickstart terminal, navigate to the project directory and type:

`docker-machine create--driver virtualbox dev`
`eval $(docker-machine env dev)`
`./start`
