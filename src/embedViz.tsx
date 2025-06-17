import React, { useEffect, useRef, useState } from "react";
import KedroViz from "@quantumblack/kedro-viz";
import "@quantumblack/kedro-viz/lib/styles/styles.min.css";
import * as graphlibDot from "graphlib-dot";

interface GraphNode {
  id: string;
  label: string;
  data?: { type: string };
}

interface GraphEdge {
  source: string;
  target: string;
}

interface Graph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
}

function graphToKedroViz(graph: Graph) {
  const kedroViz = {
    nodes: [],
    edges: [],
    tags: [],
    pipelines: [{ id: "__default__", name: "Default" }],
    modular_pipelines: {
      __root__: {
        id: "__root__",
        name: "__root__",
        inputs: [],
        outputs: [],
        children: [],
      },
    },
  };

  graph.nodes.forEach((nodeData, nodeId) => {
    const nodeType = nodeData.data?.type || "task";
    const nodeDict: any = {
      id: nodeId,
      name: nodeData.label || nodeId,
      type: nodeType,
      pipelines: ["__default__"],
      tags: [],
      modular_pipelines: [],
    };
    if (nodeType === "data") {
      nodeDict.layer = null;
    }
    if (nodeType === "task") {
      nodeDict.parameters = {};
    }
    kedroViz.nodes.push(nodeDict);
    kedroViz.modular_pipelines.__root__.children.push({
      id: nodeId,
      type: nodeType,
    });
  });

  graph.edges.forEach((edge) => {
    kedroViz.edges.push({
      source: edge.source,
      target: edge.target,
    });
  });

  return kedroViz;
}

const options = {
  display: {
    expandPipelinesBtn: false,
    exportBtn: false,
    globalNavigation: false,
    labelBtn: false,
    layerBtn: false,
    metadataPanel: true,
    miniMap: false,
    sidebar: false,
    zoomToolbar: false,
  },
  expandAllPipelines: false,
  behaviour: {
    reFocus: false,
  },
  theme: "dark",
};

export const EmbedViz: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [kedroVizData, setKedroVizData] = useState<any>(null);

  useEffect(() => {
    fetch("/pipeline.gv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load DOT file: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then((dotString) => {
        try {
          // Parse DOT using graphlib-dot
          const graph = graphlibDot.read(dotString);
          // Debug: log the parsed graph object
          console.log("Parsed graphlib graph:", graph);

          // Extract nodes
          const nodes = graph.nodes().map((id: string) => {
            const nodeData = graph.node(id) || {};
            return {
              id,
              label: nodeData.label || id,
              data: { type: nodeData.type || "task" },
            };
          });

          // Extract edges
          const edges = graph.edges().map((edge: { v: string; w: string }) => ({
            source: edge.v,
            target: edge.w,
          }));

          // Debug: log all parsed edges
          console.log("Parsed DOT edges:", edges);

          // Convert to Kedro Viz format (reuse your graphToKedroViz logic)
          const nodeMap = new Map<string, GraphNode>(nodes.map((n) => [n.id, n]));
          const kedroViz = graphToKedroViz({ nodes: nodeMap, edges });
          setKedroVizData(kedroViz);
        } catch (err: any) {
          setError(`Failed to parse DOT file: ${err.message}`);
        }
      })
      .catch((err) => {
        if (err.message && err.message.startsWith("Failed to load DOT file")) {
          setError("Could not load the pipeline.gv file. Please make sure it exists in the public directory and is accessible.");
        } else {
          setError(`Unexpected error: ${err.message}`);
        }
      });
  }, []);

  if (error) {
    return (
      <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#ccc", background: "#222", padding: 20, textAlign: "center" }}>
        <h2>Error Loading Pipeline</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Debug: log the Kedro Viz object before rendering
  if (kedroVizData) {
    // eslint-disable-next-line no-console
    console.log("Kedro Viz data:", kedroVizData);
  }

  return (
    <div style={{ height: 600 }}>
      {kedroVizData && <KedroViz data={kedroVizData} options={options} />}
    </div>
  );
};

export default EmbedViz;
