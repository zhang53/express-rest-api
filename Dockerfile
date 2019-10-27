FROM node:10-alpine

COPY . /home/user/myapp_api
WORKDIR /home/user/myapp_api
RUN npm install
RUN cp .env.example .env
RUN npm run seed

CMD npm run start