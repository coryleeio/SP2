Install docker-toolbox

`https://www.docker.com/docker-toolbox`

Open the docker quickstart terminal and type:

`./start`

Then navigate to your game on port 80 of your docker host
in brower: 

`http://192.168.99.100`    (yours may vary)

You can open multiple tabs in your browser to connect with multiple clients at the same time.

Start script is idempotent and you can run it more than once to rebuild after making changes.
It should eventually be replaced with a compose file.  (I was running on windows initially, and compose did not support windows until recently.)