FROM node:6-alpine

RUN mkdir -p /twitter-clone-4

ADD ./package.json /twitter-clone-4/package.json

WORKDIR /twitter-clone-4/
RUN npm install --production -q

ADD ./ /twitter-clone-4/

#Comando que inicia
CMD [ "npm", "start" ]
