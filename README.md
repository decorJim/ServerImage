# ServerImage
small server for testing mobile http request
npm install if stuck in loading ctrl + c 
npm start script will run project
must add body parser for code to access req.body

# Python script
first need "pip3 install pillow"

to run python script
check python version if 3 then spawn first argument is python3 in imageService process function
check with command "python3 --version" if python interpreter is the same version as the result as vscode interpreter then it is fine 

# Docker
- install docker desktop 
- https://www.youtube.com/watch?v=dYiPms0xnIE
- After Exploit protection step
- go to system variable and add to PATH "C:\Windows\System32\"
- open a terminal as administrator
- run command "net start vmcompute"
- run command "wsl --set-default-version 2"




# deployments EC2
# make sure HTTP is allowed on instance else app test will not work
# download node version manager
- connect as root user using "sudo su -"
- use command "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash"

# activate node version manager
- activate using command ". ~/ .nvm/nvm.sh"

# install node js using nvm
- nvm install node

# install git 
- update system using command "apt-get update -y"
- install git using command "apt-get install git -y"

# install python3, pip and pillow
- use command "sudo apt-get install python3 python3-pip libjpeg-dev -y"
- use command "pip3 install pillow"

# clone repo
- command "git clone https://github.com/decorJim/ServerImage.git"

# check what is on machine
- command "ls -lrt"
- to get inside folder use "cd serverImage/"

# install app packages
- use command "npm install"

# run app as background process
- npm install pm2 -g
- pm2 startup
- pm2 start app.ts
- pm2 status

# stop application 
- pm2 stop serverImage

# restart application 
- pm2 restart serverImage

# save current state of application
- pm2 save


# debug 
- pm2 logs




