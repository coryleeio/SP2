## What is this?

This project is a toy meant as a demonstration how one might build a top down sprite based multiplayer spaceship game with authoratative physics using only JavaScript.
It also contains a re-usable custom implementation of an ECS(entity component system).  
Browserify is used to share code between the server and client.(the main advantage to using JS for both)

## How to run:

Install docker-toolbox

`https://www.docker.com/docker-toolbox`

Open the docker quickstart terminal, navigate to the project directory and type:

`./start`

Then navigate to your game on port 80 of your docker host
in brower: 

`http://192.168.99.100`    (yours may vary)

You can open multiple tabs in your browser to connect with multiple clients at the same time.

Start script is idempotent and you can run it more than once to rebuild after making changes.
It should eventually be replaced with a compose file.  (I was running on windows initially, and compose did not support windows until recently.)