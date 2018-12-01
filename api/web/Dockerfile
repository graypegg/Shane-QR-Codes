FROM node

COPY ./ /home/node/

WORKDIR '/home/node'

EXPOSE 5000

RUN npm install

CMD node /home/node/index.js