import Container, { Service } from "typedi";
import { Graph } from "../Models/Graph";
import { d3 } from "../Models/D3";
import { Node } from "../Models/Node";
import { Link } from "../Models/Link";
import { conf } from "../data/Constants";
import { GraphZoomService } from "./GraphZoom.service";
import { D3DragEvent, DragBehavior, Simulation, SubjectPosition } from "d3";

@Service()
export class GraphRendererService {
  static get(): GraphRendererService {
    return Container.get(GraphRendererService);
  }

  private buildDraggingOptions(
    simulation: Simulation<Node, undefined>
  ): DragBehavior<SVGSVGElement, Node, Node | SubjectPosition> {
    const dragStarted = (event: D3DragEvent<SVGCircleElement, Node, Node>) => {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };

    const dragging = (event: D3DragEvent<SVGCircleElement, Node, Node>) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragEnded = (event: D3DragEvent<SVGCircleElement, Node, Node>) => {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    };

    return d3
      .drag<SVGSVGElement, Node>()
      .on("start", dragStarted)
      .on("drag", dragging)
      .on("end", dragEnded);
  }

  renderSvg(
    graph: Graph,
    graphSvgElement: SVGSVGElement,
    emit: (event: "clickNode", payload: string) => void
  ): void {
    const graphSimulation = this.buildGraphSimulation(graph, graphSvgElement);

    const svg = d3.select(graphSvgElement);

    //clear previous drawings
    svg.selectAll("*").remove();

    //root node used to aggregate the whole svg tree and allow zooming
    const root = svg.append<SVGSVGElement>("g").attr("id", "root");

    const zoomBehaviour = GraphZoomService.createZoomBehaviour(root);

    svg.call(zoomBehaviour);

    const link = root
      .append("g")
      .attr("stroke", "#999")
      .selectAll<SVGLineElement, Link>("line")
      .data<Link>(graph.links)
      .join<SVGLineElement, Link>("line")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", (l: Link) =>
        l.strength ? 1 / l.strength : null
      );

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    //node container
    const node = root
      .append<SVGSVGElement>("g")
      .selectAll<SVGSVGElement, Node>("g")
      .data<Node>(graph.nodes)
      .join<SVGSVGElement, Node>("g")
      .attr("class", "node-container")
      .on("click", (_, d: Node) => emit("clickNode", d.id))
      .call(this.buildDraggingOptions(graphSimulation));

    //node circle
    node
      .append("circle")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("r", conf.NODE_RADIUS)
      .attr("fill", (d: Node) => color(d.group.toString()));

    //node label
    node
      .append("text")
      .attr("x", 30 + 4)
      .attr("y", "0.31em")
      .text((d) => d.id)
      .clone(true)
      .lower()
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 3);

    graphSimulation.on("tick", () => {
      // link movement
      link
        .attr("x1", (d) => (<Node>d.source).x!)
        .attr("y1", (d) => (<Node>d.source).y!)
        .attr("x2", (d) => (<Node>d.target).x!)
        .attr("y2", (d) => (<Node>d.target).y!);
      // node movement
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
  }

  private buildGraphSimulation(
    graph: Graph,
    graphSvgElement: SVGSVGElement
  ): Simulation<Node, Link> {
    const maxWidth = graphSvgElement.clientWidth;
    const maxHeight = graphSvgElement.clientHeight;

    const graphSimulation = d3
      .forceSimulation<Node, Link>(graph.nodes)
      .force(
        "link",
        d3.forceLink<Node, Link>(graph.links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(maxWidth / 2, maxHeight / 2))
      .force(
        "collide",
        d3.forceCollide(() => 55)
        //d3.forceCollide(20).radius(20).strength(0)
      );

    return graphSimulation;
  }
}
