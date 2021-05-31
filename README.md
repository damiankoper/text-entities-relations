# Text Entities Relations - TER
Frontend app created to calculate and visualize relations between named entities in texts.
TER is integrated with NER (https://ws.clarin-pl.eu/ner.shtml) to detect named entities.

![image](https://user-images.githubusercontent.com/28621467/120213268-46178800-c233-11eb-87e5-f0d5ec14f85e.png)

## Requirements and instructions

TER can be built from the source or run from prebuilt docker image.

### Docker
Replace `-d` with `-it` for interactive terminal.
```sh
docker run --name ter -d -p 8080:8080 kopernick/ter:latest
```

### Docker build
Change image name after `-t` argument.
```sh
docker build -f docker/Dockerfile -t kopernick/ter:latest .
```

### Manual build
Requirements:
* Node: >=15 (tested, recommended)
* [Lerna](https://github.com/lerna/lernaLerna): install with `npm i -g lerna`

Install depencencies:
```sh
lerna bootstrap
```

Build core:
```sh
lerna run prod --scope core
```

Build front:
```sh
lerna run build --scope front
```
At this point directory `packages/front/dist` contains files to be served via HTTP. For example:
```sh
npx http-server -p 8080 packages/front/dist
```
Then access `localhost:8080` in your browser to use our beautiful app.

### Tests
Package `core` has most of its components tested. To run tests type:
```sh
lerna run test --scope core --stream
```

### Contribution
I dunno. Do what you want.