import Container, { Service } from "typedi";
import { d3 } from "../Models/D3";

@Service()
export class GraphZoomService {
  static get(): GraphZoomService {
    return Container.get(GraphZoomService);
  }

  static createZoomBehaviour(
    elementToAttach: d3.Selection<SVGSVGElement, unknown, null, undefined>
  ): d3.ZoomBehavior<SVGSVGElement, unknown> {
    return d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1 / 4, 4])
      .on("zoom", (event) =>
        elementToAttach.attr("transform", event.transform)
      );
  }

  fitToScreen(svgElement: SVGSVGElement): void {
    const containerSelection = d3.select(svgElement);

    const rootSvgElementSelection = containerSelection.selectChild<SVGSVGElement>(
      "#root"
    );

    const rootNode = rootSvgElementSelection.node();

    if (!rootSvgElementSelection || !rootNode) {
      return;
    }

    const svgBounds = rootNode.getBBox();
    const clientSize = {
      width: svgElement.clientWidth,
      height: svgElement.clientHeight,
    };

    const midX = svgBounds.x + svgBounds.width / 2;
    const midY = svgBounds.y + svgBounds.height / 2;
    const scale =
      0.95 /
      Math.max(
        svgBounds.width / clientSize.width,
        svgBounds.height / clientSize.height
      );

    const transalte = {
      X: clientSize.width / 2 - scale * midX,
      Y: clientSize.height / 2 - scale * midY,
    };

    const transform = d3.zoomIdentity
      .translate(transalte.X, transalte.Y)
      .scale(scale);

    const zoomBehaviour = GraphZoomService.createZoomBehaviour(
      rootSvgElementSelection
    );

    containerSelection
      .transition()
      .duration(500)
      .call(zoomBehaviour.transform, transform);
  }
}
