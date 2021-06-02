# Text Entities Relations - TER

A client-side web application created to calculate and visualize relations between named entities located in texts. It can also display how the relations between recognized entities develops over time as we continue to read the analysed text.

![image](https://user-images.githubusercontent.com/28621467/120213268-46178800-c233-11eb-87e5-f0d5ec14f85e.png)

## Architecture and process overview

The whole application is based on the following process:

1. Take any given text from user, in which entities should be recognized
2. Provide all the necessary parameters that the calculations will be based on
3. Communicate via REST with NER service, which does the entity recognition part
4. Perform relation discovery between recognized entities
5. Visualize the result as an undirected graph, where nodes are the entities and links represent the relation with an appropriate strength.

### Entity recognition & NER integration

Recognizing entities in text is done by an external service provided by [clarin](https://ws.clarin-pl.eu/#). The whole communication is done via REST endpoints, which allow uploading files to analyse and pooling for the status of a queued file. You can find the detailed description of the service in the official [NER documentation](https://ws.clarin-pl.eu/ner.shtml).

### Relation discovery & their strength

In order to visualize the relations between the entities identified in the previous step, a parameterized algorithm was implemented, which identifies whether two objects are connected and calculates the strength of each relation. The strength of a relation is based on a number of occurrences of the 2 given entities in a given time frame. One step of the algorithm also takes advantage of the Levenshtein distance in order to merge possible duplicates in recognized entities, because NER doesn't do it by default. The implementation of the Levenshtein algorithm used in the project is available [here in the npm repository](https://www.npmjs.com/package/fast-levenshtein), the rest of the process was written by the authors of this project.

The algorithm can be parameterized with different options:

- _window_ - a specified number of consecutive sentences/words/paragraphs that if two objects occur in, they are assumed to be related
- _overlap_ - how many sentences/words/paragraphs should be shared between the adjacent windows when calculating the relations
- _unit_ - **sentence**, **word** or **paragraph**, the resolution of provided _window_ and _overlap_ parameters
- _token type_ - list of categories of recognized objects that should be taken into account during calculations.
- _merge similar nodes_ - a number representing a maximum distance based on the Levenshtein algorithm that the entities will be merged in
- _minimum number of relations_ - a minimum number of relations that an entity has to have, in order not to be discarded
- _remove numbers_ - an option that allows to omit entities recognized as numbers

### Visualization & graph modifications

The last step was to represent the relations with their strength in an user-friendly way. The most intuitive way to show all the connections is an undirected graph, where each node represents an entity and the edges show the connection between given objects. In order to emphasize the most common entities and their relations the interface was made to be even more intuitive, by painting the nodes using a color scale where darker colours indicate the entities which have the most outgoing number of connections, so occurred in the text the most often (like main character of the book, etc.), this is also further enhanced by adjusting the node size. What is more, the width of the graph edges is bigger and the opacity lower, as the connection occurred more times in the analysed text. One of the core features of the visualization is the ability to display how the relations developed over time, as any given time frame can be chosen (defined by word/sentence/paragraph numbers) to display the entities and relations that occured in.

The project takes advantage of the [d3.js](https://d3js.org/) library, together with all the goodies inside such as [force-layout](https://www.d3indepth.com/force-layout/), [dragging](https://github.com/d3/d3-drag), [zooming](https://github.com/d3/d3-zoom) and many more. The data previously calculated by our algorithm is then mapped to a graph object, consisting of nodes and links arrays which are joined with SVG objects later on, to make the final picture.

Interactions with the graph such as:

- merging nodes which were not correctly combined in previous step,
- changing the layout of the nodes,
- deleting nodes,
- editing the node names,
- viewing how the relations developed in a given word/sentence/paragraph frame,
- filtering the graph to show only the nodes which match given criterion,
- moving back and forth on the graph editing history to revoke and correct any mistakes,

are simply build upon modifying our internal data representation and notifying d3.js about the changes and how to handle them (to update the rendered graph).

### Export & application state

In order to allow sharing the result of the work done to others, a quick and convenient way was implemented to allow exporting the current state of the graph to a file, which then can be shared with others and loaded in the application, at any given time, on any machine. All of the modifications done on the underlying data are preserved. Furthermore, there are options to export the current state of the graph to csv and gephi formats for further processing and usage in other applications.

### Bonus

Keep in mind that the separation between front and core packages was made because it wasn't known, whether all the calculations will run efficiently in the browser. After some tests it looks like the algorithms perform pretty well and most of the concerns are related only to the limitations of the graph-rendering simulation. Therefore our algorithm can be easily taken out and run on any server running [Node.js](https://nodejs.org/) (or any other Javascript runtime) to make it even quicker :). It is also assumed that the simulation runs quickly enough and is responsive as long as the graph is readable. If there are many unwanted entities in the final graph the parameters can be tweaked to get better results, but please keep in mind that this is all based on the NER service, which uses ML techniques to get the results, so it's all based on probability :).

## Technologies overview

Here you can find all of the core packages and cases where they're used to make this app working.

The whole application is written in [typescript](https://www.typescriptlang.org/) and the user interface is build with [Vue.js 3.0](https://v3.vuejs.org/) and [element+](https://element-plus.org/) framework.

Here are any other important packages specified with their appropriate usage:

- REST communication with NER service - [axios](https://github.com/axios/axios) for HTTP requests and [xml2js](https://www.npmjs.com/package/xml2js) for parsing the NER result
- Levenshtein algorithm in relation discovery - [fast-levenshtein](https://www.npmjs.com/package/fast-levenshtein)
- graph visualization - [d3.js](https://d3js.org/), especially packages:
  - [d3-force](https://github.com/d3/d3-force) -> here you can read how are the nodes distributed and what forces work on them in order to make an non overlapping layout.
  - [d3-drag](https://github.com/d3/d3-drag) -> interaction with graph, dragging and pinning the nodes
  - [d3-ease](https://github.com/d3/d3-ease) and [d3-interpolate](https://github.com/d3/d3-interpolate) -> colouring nodes and edges
  - [d3-zoom](https://github.com/d3/d3-zoom) -> panning and zooming on the graph to make it more user friendly
- testing - [jest](https://jestjs.io/)

## Requirements and instructions

TER app can be built from the source or run from a prebuilt docker image.

### Docker

Replace `-d` with `-it` for an interactive terminal.

```sh
docker run --name ter -d -p 8080:8080 kopernick/ter:latest
```

### Docker build

Change the image name after `-t` argument.

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

At this point the directory `packages/front/dist` contains static files to be served via HTTP. For example the command:

```sh
npx http-server -p 8080 packages/front/dist
```

will run a simple http server and serve the app content on a 8080 port.

You can then access `localhost:8080` address in your browser to use this magnificent app.

### Tests

The `core` package has most of its components tested. To run tests type:

```sh
lerna run test --scope core --stream
```

### Contribution

Dunno. Do what you want.
