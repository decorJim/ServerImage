FROM node:18.13.0

RUN apt-get update && apt-get install -y python3-pip

RUN pip3 install pillow

COPY . .

RUN npm install

CMD ["npm","run","start"]



