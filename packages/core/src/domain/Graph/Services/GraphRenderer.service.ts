import Container, { Service } from "typedi";
import { Graph } from "../Models/Graph";
import * as d3 from "d3";
import { Node } from "../Models/Node";
import { Link } from "../Models/Link";
import { conf } from "../data/Constants";
import { GraphZoomService } from "./GraphZoom.service";
import {
  Selection,
  D3DragEvent,
  DragBehavior,
  Simulation,
  SubjectPosition,
} from "d3";

interface SimulationState {
  simulation: Simulation<Node, Link>;
  linkSelection: Selection<SVGLineElement, Link, SVGGElement, unknown>;
  nodeSelection: Selection<SVGSVGElement, Node, SVGSVGElement, unknown>;
  initialGraph: Graph;
}
type EventType = "clickNode" | "mouseleaveNode" | "mouseenterNode";

@Service()
export class GraphRendererService {
  private _state: SimulationState | null = null;

  constructor(private zoomService: GraphZoomService) {}

  static get(): GraphRendererService {
    return Container.get(GraphRendererService);
  }

  public initializeSimulation(
    graphSvgElement: SVGSVGElement,
    initialGraph: Graph
  ): void {
    const graphSimulation = this.buildGraphSimulation(graphSvgElement);

    const svg = d3.select(graphSvgElement);

    //root node used to aggregate the whole svg tree and allow zooming
    const root = svg.append<SVGSVGElement>("g").attr("id", "root");

    // initialize zoom
    const zoomBehaviour = this.zoomService.initializeZoomBehaviour(root);

    svg.call(zoomBehaviour);

    // create aggregating svg tree

    //links parent svg element
    const link = root
      .append("g")
      .attr("stroke", "#999")
      .selectAll<SVGLineElement, Link>("line")
      .attr("stroke-width", 1.5);

    //nodes parent svg element
    const node = root
      .append<SVGSVGElement>("g")
      .selectAll<SVGSVGElement, Node>("g");

    this._state = {
      linkSelection: link,
      nodeSelection: node,
      simulation: graphSimulation,
      initialGraph: initialGraph,
    };

    graphSimulation.on("tick", () => {
      // link movement
      this._state?.linkSelection
        .attr("x1", (d) => (<Node>d.source).x || 0)
        .attr("y1", (d) => (<Node>d.source).y || 0)
        .attr("x2", (d) => (<Node>d.target).x || 0)
        .attr("y2", (d) => (<Node>d.target).y || 0);

      // node movement
      this._state?.nodeSelection.attr(
        "transform",
        (d) => `translate(${d.x},${d.y})`
      );
    });
  }

  // emit used internally (pass in initializeSimulation)
  // add another parameter, positionBasedOnPreviousData
  // if not rerender from middle
  // TODO: doesn't respect node/link weight changes on graph update
  public renderSvg(
    graph: Graph,
    emit: (event: EventType, payload: string | Node) => void,
    restartSimulation = true
  ): void {
    if (!this._state) {
      return;
    }

    const interpolate = d3.interpolateHsl(
      graph.weight.colorMin,
      graph.weight.colorMax
    );

    const oldNodesMap = new Map(
      this._state.initialGraph.nodes.map((d) => [d.id, d])
    );

    const newNodes = graph.nodes.map((d) => {
      const oldNode = oldNodesMap.get(d.id);
      if (oldNode) {
        d.x = oldNode.x;
        d.y = oldNode.y;
        d.vx = oldNode.vx;
        d.vy = oldNode.vy;
        d.fx = oldNode.fx;
        d.fy = oldNode.fy;
      }
      return d;
    });

    const newLinks = graph.links.map((l) => Object.assign({}, l));

    this._state.nodeSelection = this._state.nodeSelection
      .data<Node>(newNodes, (d) => d.id)
      .join<SVGSVGElement, Node>((nodeParentSeleciton) => {
        //node container
        const nodeContainer = nodeParentSeleciton
          .append<SVGSVGElement>("g")
          .attr("class", "node-container")
          .on("dblclick", (event: Event, d: Node) => {
            event.stopPropagation();
            d.fx = null;
            d.fy = null;
          })
          .on("click", (_, d: Node) => emit("clickNode", d.id))
          .on("mouseenter", (_, d: Node) => emit("mouseenterNode", d))
          .on("mouseleave", (_, d: Node) => emit("mouseleaveNode", d))
          .call(this.buildDraggingOptions());

        //node circle
        nodeContainer
          .append("circle")
          .attr("stroke", "#eee")
          .attr("stroke-width", (d) => 1.5 + 1.5 * (d.easiedWeight || 0))
          .attr("r", (d: Node) => this.getNodeRadius(d.easiedWeight || 0))
          .attr("fill", (d: Node) => {
            return interpolate(d.easiedWeight || 0);
          });

        //append text
        nodeContainer
          .append("text")
          .attr("x", (d) => 16 + 16 * (d.easiedWeight || 0))
          .attr("y", "0.40em")
          .text((d) => d.id)
          .attr("stroke", "black")
          .attr("stroke-width", 1);

        return nodeContainer;
      });

    this._state.linkSelection = this._state.linkSelection
      .data<Link>(newLinks)
      .join<SVGLineElement, Link>("line")
      .attr("stroke-width", (l: Link) =>
        this.getLinkWidth(l.easiedStrength || 0)
      )
      .attr("opacity", (l: Link) => this.getLinkOpacity(l.easiedStrength || 0));

    this._state.simulation.nodes(newNodes);
    this._state.simulation.force(
      "link",
      d3.forceLink<Node, Link>(newLinks).id((d) => d.id)
    );

    if (restartSimulation) {
      this._state.simulation.alpha(0.01).restart();
    }
  }

  private buildGraphSimulation(
    graphSvgElement: SVGSVGElement
  ): Simulation<Node, Link> {
    const maxWidth = graphSvgElement.clientWidth;
    const maxHeight = graphSvgElement.clientHeight;

    const graphSimulation = d3
      .forceSimulation<Node, Link>()
      .force("link", d3.forceLink<Node, Link>())
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(maxWidth / 2, maxHeight / 2))
      .force("collide", d3.forceCollide(55));

    return graphSimulation;
  }

  private buildDraggingOptions(): DragBehavior<
    SVGSVGElement,
    Node,
    Node | SubjectPosition
  > {
    const dragStarted = (
      event: D3DragEvent<SVGSVGElement, Node, Node>,
      d: Node
    ) => {
      if (!event.active) {
        this._state?.simulation.alphaTarget(0.03).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragging = (
      event: D3DragEvent<SVGSVGElement, Node, Node>,
      d: Node
    ) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragEnded = (event: D3DragEvent<SVGSVGElement, Node, Node>) => {
      if (!event.active) {
        this._state?.simulation.alphaTarget(0);
      }
    };

    return d3
      .drag<SVGSVGElement, Node>()
      .on("start", dragStarted)
      .on("drag", dragging)
      .on("end", dragEnded);
  }

  private getNodeRadius(weight: number) {
    const [min, max] = [conf.MIN_NODE_RADIUS, conf.MAX_NODE_RADIUS];
    return min + (max - min) * weight;
  }
  private getLinkWidth(strength: number) {
    const [min, max] = [conf.MIN_LINK_WIDTH, conf.MAX_LINK_WIDTH];
    return min + (max - min) * strength;
  }
  private getLinkOpacity(strength: number) {
    const [min, max] = [conf.MIN_LINK_OPACITY, conf.MAX_LINK_OPACITY];
    return min + (max - min) * strength;
  }

  pinAllNodes(): void {
    this._state?.initialGraph.nodes.forEach((d) => {
      d.fx = d.x;
      d.fy = d.y;
    });
  }

  unpinAllNodes(): void {
    this._state?.initialGraph.nodes.forEach((d) => {
      d.fx = null;
      d.fy = null;
    });
    this._state?.simulation.alpha(0.03).restart();
  }
}
