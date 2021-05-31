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
  nodeMap: Map<string, Node>;
}

type EventType = "clickNode" | "mouseleaveNode" | "mouseenterNode";

@Service()
export class GraphRendererService {
  private _state: SimulationState | null = null;
  private dragPin = false;

  constructor(private zoomService: GraphZoomService) {}

  static get(): GraphRendererService {
    return Container.get(GraphRendererService);
  }

  setDragPin(v = true): void {
    this.dragPin = v;
  }

  renameHint(o: string, n: string): void {
    const map = this._state?.nodeMap;
    if (map) {
      const existing = map.get(o);
      if (existing) {
        map.set(n, existing);
      }
    }
  }

  private trimId(id: string): string {
    return (
      "id_" + id.replace(/^[#\-\ \/]+|[#\-\ \/]+$/g, "").replace(/[\*\. ]/g, "")
    );
  }

  public bindSimulation(graphSvgElement: SVGSVGElement): void {
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
      nodeMap: new Map(),
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

  private updateNodePosition(n: Node, reverse = false): void {
    const map = this._state?.nodeMap;
    if (map) {
      let o = map.get(n.id);
      if (o) {
        [n, o] = reverse ? [o, n] : [n, o];
        n.x = o?.x;
        n.y = o?.y;
        n.vx = o?.vx;
        n.vy = o?.vy;
        n.fx = o?.fx;
        n.fy = o?.fy;
      }
      map.set(n.id, n);
    }
  }

  public renderSvg(
    graph: Graph,
    emit: (
      event: EventType,
      payload: { node: Node; shiftPressed?: boolean } | Node
    ) => void,
    restartSimulation = true
  ): void {
    if (!this._state) {
      return;
    }
    const interpolate = d3.interpolateHsl(
      graph.weight.colorMin,
      graph.weight.colorMax
    );

    graph.nodes.forEach((n) => {
      this.updateNodePosition(n);
    });

    const newLinks = graph.links.map((l) => Object.assign({}, l));

    const highlightLoop = (
      c: d3.Selection<SVGCircleElement, Node, SVGSVGElement, unknown>
    ) => {
      c.attr("r", (d: Node) => this.getNodeRadius(d.easiedWeight || 0))
        .attr("fill", () => conf.NODE_HIGHLIGHT_COLORS[0])
        .transition()
        .duration(150)
        .attr("r", (d: Node) => this.getNodeRadius(d.easiedWeight || 0) * 1.3)
        .attr("fill", () => conf.NODE_HIGHLIGHT_COLORS[1])
        .transition()
        .duration(350)
        .attr("r", (d: Node) => this.getNodeRadius(d.easiedWeight || 0))
        .attr("fill", () => conf.NODE_HIGHLIGHT_COLORS[0])
        .on("end", (d: Node) => {
          if (d.highlighted) highlightLoop(c);
        });
    };
    console.log(graph.nodes.find((n) => n.id == "Kwaśniewski")?.highlighted);
    this._state.nodeSelection = this._state.nodeSelection
      .data<Node>(graph.nodes, (d) => d.id)
      .join<SVGSVGElement, Node>(
        (nodeParentSeleciton) => {
          //node container
          const nodeContainer = nodeParentSeleciton
            .append<SVGSVGElement>("g")
            .attr("class", "node-container")
            .on("dblclick", (event: Event, d) => {
              event.stopPropagation();
              d.pinned = false;
              d.fx = null;
              d.fy = null;
            })
            .on("click", (event: MouseEvent, d) =>
              emit("clickNode", { node: d, shiftPressed: event.shiftKey })
            )
            .on("mouseenter", (_, d) => emit("mouseenterNode", d))
            .on("mouseleave", (_, d) => emit("mouseleaveNode", d))
            .call(this.buildDraggingOptions());

          //node circle
          nodeContainer
            .append("circle")
            .attr("stroke", "#eee")
            .attr("stroke-width", (d) => 1.5 + 1.5 * (d.easiedWeight || 0))
            .attr("id", (d) => this.trimId(d.id))
            .transition()
            .duration(150)
            .attr("fill", (d) => interpolate(d.easiedWeight || 0))
            .attr("r", (d) => this.getNodeRadius(d.easiedWeight || 0));

          //append text
          nodeContainer
            .append("text")
            .attr("x", (d) => 16 + 16 * (d.easiedWeight || 0))
            .attr("y", "0.40em")
            .text((d) => d.id)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("opacity", 0)
            .transition()
            .duration(150)
            .style("opacity", 1);

          return nodeContainer;
        },
        (nodeContainer) => {
          //update circle
          nodeContainer
            .select<SVGCircleElement>("circle")
            .attr("stroke-width", (d) => 1.5 + 1.5 * (d.easiedWeight || 0));

          //update text
          nodeContainer
            .select<SVGTextElement>("text")
            .attr("x", (d) => 16 + 16 * (d.easiedWeight || 0));

          highlightLoop(
            nodeContainer
              .select<SVGCircleElement>("circle")
              .filter((d) => !!d.highlighted)
          );

          nodeContainer
            .select<SVGCircleElement>("circle")
            .filter((d) => !d.highlighted)
            .interrupt()
            .transition()
            .duration(150)
            .attr("r", (d) => this.getNodeRadius(d.easiedWeight || 0))
            .attr("fill", (d: Node) => interpolate(d.easiedWeight || 0));

          return nodeContainer;
        },
        (nodeContainer) => {
          nodeContainer
            .select<SVGCircleElement>("circle")
            .transition()
            .duration(150)
            .attr("r", 0)
            .on("end", () => {
              nodeContainer.remove();
            });
          nodeContainer
            .select<SVGTextElement>("text")
            .transition()
            .duration(150)
            .style("opacity", 0);

          return nodeContainer;
        }
      );
    this._state.linkSelection = this._state.linkSelection
      .data<Link>(newLinks, (d) => {
        if (typeof d.target === "string" || d.target instanceof String) {
          return `${d.source},${d.target}`;
        } else {
          return `${(d.source as Node).id},${(d.target as Node).id}`;
        }
      })
      .join<SVGLineElement, Link>(
        (nodeParentSeleciton) => {
          const line = nodeParentSeleciton
            .append("line")
            .attr("stroke-width", (l: Link) =>
              this.getLinkWidth(l.easiedStrength || 0)
            )
            .attr("opacity", (l: Link) =>
              this.getLinkOpacity(l.easiedStrength || 0)
            );
          return line;
        },
        (line) => {
          line
            .transition()
            .duration(150)
            .attr("stroke-width", (l: Link) =>
              this.getLinkWidth(l.easiedStrength || 0)
            )
            .attr("opacity", (l: Link) =>
              this.getLinkOpacity(l.easiedStrength || 0)
            );
          return line;
        },
        (line) => {
          line.transition().duration(150).attr("stroke-width", 0);
          return line;
        }
      );

    this._state.simulation.nodes(graph.nodes);
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
    const dragStarted = (event: D3DragEvent<SVGSVGElement, Node, Node>) => {
      if (!event.active) {
        this._state?.simulation.alphaTarget(0.03).restart();
      }
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
        this.updateNodePosition(event.subject, true);
        if (!this.dragPin && !event.subject.pinned) {
          event.subject.fx = undefined;
          event.subject.fy = undefined;
        }
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
    const currentNodes = this._state?.simulation.nodes();
    currentNodes?.forEach((d) => {
      d.fx = d.x;
      d.fy = d.y;
      d.pinned = true;
    });
  }

  unpinAllNodes(): void {
    const currentNodes = this._state?.simulation.nodes();
    currentNodes?.forEach((d) => {
      d.fx = null;
      d.fy = null;
      d.pinned = false;
    });
    this._state?.simulation.alpha(0.03).restart();
  }

  resetState(): void {
    this._state = null;
  }
}
