# Text Entities Relations - TER

Frontend app created to calculate and visualize relations between named entities in texts. Also allows viewing how the relations between recognized entities develops over time as we continue to read the analysed text.

![image](https://user-images.githubusercontent.com/28621467/120213268-46178800-c233-11eb-87e5-f0d5ec14f85e.png)

## Architecture and process overview

Whole application is based on the following process:

1. Take any given text from user in which entities should be recognized
2. Provide all the necessary parameters based on which the calculations will be made
3. Communicate via REST endpoints with NER-service, which does all the recognition part
4. Perform relation discovery between recognized entities
5. Visualize the result as undirected graph where nodes are the entities and links represent the relation with appropriate strength.

### Entity recognition & NER integration

Recognizing entities in text is done by external service provided by [clarin](https://ws.clarin-pl.eu/#). The whole communication is done via REST endpoints which allow uploading files to analyse and pooling for status of queued file. You can find the detail description of the service in the official [NER documentation](https://ws.clarin-pl.eu/ner.shtml).

### Relation discovery & their strength

In order to visualize the relations between identified entities in previous step we implemented a parameterized algorithm which identifies whether two objects are connected and calculates the strength of each relation. Strength of the relation is based on number of occurrences of 2 given entities in given time frame. Also one step of the algorithm takes advantage of levenshtein distance in order to merge possible duplicates in recognized entities, because NER doesn't do it by default. We used the implementation of levenshtein algorithm available [here](https://www.npmjs.com/package/fast-levenshtein) in the npm repository, rest of the process is written by us.

The algorithm can be parameterized with different options:

- window - if objects occur in specified number of sentences/words/paragraphs we count that they are related
- overlap - how many sentences/words/paragraphs should overlap when calculating relations between objects
- unit - sentence/word/paragraph, where do we recognize the relations
- token type - objects falling into which category should be taken into account during calculations.
- merge similar nodes - based on levenshtein algorithm, merge entities which are not further than given number
- minimum number of relations - delete entities which do not have at least given number of relations
- remove numbers - sadly NER is not perfect, so this allows to remove recognized entities which are pure numbers

### Visualization & graph modifications

The last step was to represent the relations with their strength in a user-friendly way. The most intuitive way to show all the connections is an undirected graph where each Node represents an entity and links show the connection between given objects. In order to emphasize most common entities and their relations we made the interface even more intuitive by painting the nodes based on a color scale where darker colours indicate entities which have the most outgoing number of connections, so occurred in text the most often (like main character of the book, etc.). Furthermore the node size also depends on the number of outgoing connections and the width and opacity of the links is bigger as the connection occurred more times in analysed text. One of the core features of the visualization is the ability to see how the relations developed over time as we can chose any given time frame (word/sentence/paragraph) from which to which we want to see the recognized entities and relations between them.

We took advantage of [d3.js](https://d3js.org/) together with all the goodies inside such as [force-layout](https://www.d3indepth.com/force-layout/), [dragging](https://github.com/d3/d3-drag), [zooming](https://github.com/d3/d3-zoom) and many more. The previous data calculated by our algorithm is mapped to graph consisting of Nodes and Links array which are then joined with SVG objects to make the final picture.

Interaction with the graph such as:

- changing the layout of nodes
- merging nodes which weren’t correctly combined in previous step
- deleting nodes
- editing node names
- viewing how the relations developed in given word/sentence/paragraph frame
- filtering only nodes which match given criterion
- moving back and forth on the history to correct any mistakes

is simply build upon modifying our internal data representation and notifying d3.js about the changes and how to handle them.

### Export & application state

In order to allow sharing the work to others we implemented a quick and convenient way to export current state of the graph to a file which can be loaded in the application at any time. All of the modifications done on the underlying data are preserved. Furthermore there are options to export the current state of the graph to csv and gephi formats.

### Bonus

Keep in mind that the separation between front and core package was made because we didn't know whether our algorithm will run efficiently in the browser. After some tests it looks like, the algorithm performs pretty well and most of the concerts are related only to the limitation of the simulation. Therefore our algorithm can be easily taken out and run on any server running node to make it even quicker :). We also assume that the simulation runs quickly enough and is responsive as long as the graph is readable. If there are many unwanted entities in the final graph you can tweak the parameters to get better results but please keep in mind that this is all based on NER service, which uses ML techniques to get the results, so it's all based on probability :)

## Technologies overview

Here you can find all of the core packages and cases where we used them to make this app working.

Whole application is written in [typescript](https://www.typescriptlang.org/) and the user interface is build with [Vue.js 3.0](https://v3.vuejs.org/) and [element+](https://element-plus.org/) framework. Here are specified other important packages with their appropriate usage:

- REST communication with NER service - [axios](https://github.com/axios/axios) for HTTP requests and [xml2js](https://www.npmjs.com/package/xml2js) for parsing the response
- levenshtein algorithm in relation discovery - [fast-levenshtein](https://www.npmjs.com/package/fast-levenshtein)
- graph visualization - [d3.js](https://d3js.org/), especially packages:
  - [d3-force](https://github.com/d3/d3-force) -> here you can read how are the nodes distributed and what forces work on them in order to make an non overlapping layout.
  - [d3-drag](https://github.com/d3/d3-drag) -> interaction with graph, dragging and pinning the nodes
  - [d3-ease](https://github.com/d3/d3-ease) and [d3-interpolate](https://github.com/d3/d3-interpolate) -> for colouring nodes and edges
  - [d3-zoom](https://github.com/d3/d3-zoom) -> panning and zooming on the graph to make it more user friendly
- testing - [jest](https://jestjs.io/)

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

- Node: >=15 (tested, recommended)
- [Lerna](https://github.com/lerna/lernaLerna): install with `npm i -g lerna`

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
