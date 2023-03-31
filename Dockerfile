FROM node:18.13.0

# these commands install python3 and other stuff that doesnt change therefore no need to verify changes using COPY

RUN apt-get update && apt-get install -y python3-pip

RUN pip3 install pillow

# detects changes in configuration files and add generated files below copy command are added to the container

COPY . .

RUN npm install

CMD ["npm","run","start"]



