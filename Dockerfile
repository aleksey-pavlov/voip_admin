FROM node:10.16.0-buster as build

ARG CI_USER
ARG CI_PWD

WORKDIR /opt/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:1.23
COPY --from=build /opt/app/dist /usr/share/nginx/html