FROM node:18.13.0

RUN apt-get update && apt-get install -y python3-pip

COPY . .

RUN npm install

RUN pip3 install pillow

CMD ["npm", "start"]



