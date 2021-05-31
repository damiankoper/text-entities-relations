FROM node:lts-alpine as builder
RUN npm i -g lerna
WORKDIR /app
COPY . ./
RUN lerna bootstrap
RUN lerna run prod --scope core
RUN lerna run build --scope front

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app/packages/front/dist dist
EXPOSE 8080
CMD npx http-server -p 8080 dist