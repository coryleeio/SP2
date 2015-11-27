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

`./start`

Then navigate to your game on port 80 of your docker host
in brower: 

`http://192.168.99.100`    (yours may vary)

Upon pressing play your game client will be directed to the server with the least load.

You can open multiple tabs in your browser to connect with multiple clients at the same time.

Start script is idempotent and you can run it more than once to rebuild after making changes.
It should eventually be replaced with a compose file.  (I was running on windows initially, and compose did not support windows until recently.)