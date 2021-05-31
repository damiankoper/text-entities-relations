import { Graph, defaultGraph } from "../../Graph/Models/Graph";
import { Node } from "../../Graph/Models/Node";
import { Link } from "../../Graph/Models/Link";
import { easeExpOut } from "d3";

const nodes: Array<Node> = [
  { id: "Myriel", weight: 10, easiedWeight: 0 },
  { id: "Napoleon", weight: 1, easiedWeight: 0 },
  { id: "Mlle.Baptistine", weight: 3, easiedWeight: 0 },
  { id: "Mme.Magloire", weight: 3, easiedWeight: 0 },
  { id: "CountessdeLo", weight: 1, easiedWeight: 0 },
  { id: "Geborand", weight: 1, easiedWeight: 0 },
  { id: "Champtercier", weight: 1, easiedWeight: 0 },
  { id: "Cravatte", weight: 1, easiedWeight: 0 },
];

const links: Array<Link> = [
  { easiedStrength: 0, source: "Napoleon", target: "Myriel", strength: 23 },
  {
    easiedStrength: 0,
    source: "Mlle.Baptistine",
    target: "Myriel",
    strength: 33,
  },
  {
    easiedStrength: 0,
    source: "Mme.Magloire",
    target: "Myriel",
    strength: 10,
  },
  {
    easiedStrength: 0,
    source: "Mme.Magloire",
    target: "Mlle.Baptistine",
    strength: 3,
  },
  {
    easiedStrength: 0,
    source: "CountessdeLo",
    target: "Myriel",
    strength: 12,
  },
  { easiedStrength: 0, source: "Geborand", target: "Myriel", strength: 18 },
  {
    easiedStrength: 0,
    source: "Champtercier",
    target: "Myriel",
    strength: 25,
  },
];
const maxWeight = 10;
const maxStrength = 33;

export const testGraph: Graph = {
  ...defaultGraph(),
  nodes: nodes.map((d) => ({
    weight: d.weight,
    id: d.id,
    easiedWeight: easeExpOut(d.weight / maxWeight),
  })),
  links: links.map((l) => {
    const strength = Math.floor(Math.random() * (maxStrength - 1 + 1)) + 1;
    return {
      source: l.source,
      target: l.target,
      strength: strength,
      easiedStrength: easeExpOut(strength / maxStrength),
    };
  }),
};
