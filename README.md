# expressjs-swagger2-mongoose-startup

## Rquirements
- Node v10.x
- MongoDB

## Install node modules
$ npm install

## Install project environments
$ cp .env.example .env

## Run seeder
$ npm run seed

## Run server
$ npm run start

## API document
Visit `http://localhost:8000/api-docs`

## Default Administrator
- username: admin
- password: 12345678

## Docker support
```
$ docker network create Dev-Net
$ docker volume create --name=Dev-Volume
$ docker-compose up -d db
$ docker-compose up -d api
```
