FROM node

COPY ./ /home/node/

WORKDIR '/home/node'

RUN rm -Rf /home/node/node_modules

EXPOSE 5000

RUN npm install

CMD node /home/node/index.js