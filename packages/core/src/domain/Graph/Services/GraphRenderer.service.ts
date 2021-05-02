import Container, { Service } from "typedi";
import { Graph } from "../Models/Graph";
import { d3 } from "../Models/D3";
import { Node } from "../Models/Node";
import { Link } from "../Models/Link";
import { conf } from "../data/Constants";
import { GraphZoomService } from "./GraphZoom.service";
@Service()
export class GraphRendererService {
  static get(): GraphRendererService {
    return Container.get(GraphRendererService);
  }

  private buildDraggingOptions(
    simulation: d3.Simulation<Node, undefined>
  ): d3.DragBehavior<SVGCircleElement, Node, Node | d3.SubjectPosition> {
    const dragStarted = (
      event: d3.D3DragEvent<SVGCircleElement, Node, Node>
    ) => {
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };

    const dragging = (event: d3.D3DragEvent<SVGCircleElement, Node, Node>) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragEnded = (event: d3.D3DragEvent<SVGCircleElement, Node, Node>) => {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      event.subject.fx = null;
      event.subject.fy = null;
    };

    return d3
      .drag<SVGCircleElement, Node>()
      .on("start", dragStarted)
      .on("drag", dragging)
      .on("end", dragEnded);
  }

  renderSvg(
    graph: Graph,
    graphSvgElement: SVGSVGElement,
    emit: (event: "clickNode", payload: string) => void
  ): void {
    const maxWidth = graphSvgElement.clientWidth;
    const maxHeight = graphSvgElement.clientHeight;

    const graphSimulation = d3
      .forceSimulation<Node, Link>(graph.nodes)
      .force(
        "link",
        d3.forceLink<Node, Link>(graph.links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(maxWidth / 2, maxHeight / 2));

    const svg = d3.select(graphSvgElement);

    //clear previous drawings
    svg.selectAll("*").remove();

    //root node used to aggregate the whole svg tree and allow zooming
    const root = svg.append<SVGSVGElement>("g").attr("id", "root");

    const zoomBehaviour = GraphZoomService.createZoomBehaviour(root);

    svg.call(zoomBehaviour);

    const link = root
      .append("g")
      .attr("id", "links-group")
      .attr("stroke", "#999")
      .selectAll<SVGLineElement, Link>("line")
      .data<Link>(graph.links)
      .join<SVGLineElement, Link>("line")
      .attr("stroke-width", (l: Link) => l.strength / 2)
      .attr("stroke-opacity", (l: Link) => 1 / l.strength);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const node = root
      .append("g")
      .attr("id", "nodes-group")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, Node>("circle")
      .data<Node>(graph.nodes)
      .join<SVGCircleElement, Node>("circle")
      .attr("r", conf.NODE_RADIUS)
      //d3.interpolateSinebow(Math.random())
      .attr("fill", (d: Node) => color(d.group.toString()))
      .on("click", (event, d: Node) => emit("clickNode", d.id))
      .call(this.buildDraggingOptions(graphSimulation));

    node
      .append("text")
      .text((d: Node) => d.id)
      .attr("x", 6)
      .attr("y", 3);

    node.append("title").text((d) => d.id);

    graphSimulation.on("tick", () => {
      link
        .attr("x1", (d) => (<Node>d.source).x!)
        .attr("y1", (d) => (<Node>d.source).y!)
        .attr("x2", (d) => (<Node>d.target).x!)
        .attr("y2", (d) => (<Node>d.target).y!);

      node.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);
    });
  }
}
