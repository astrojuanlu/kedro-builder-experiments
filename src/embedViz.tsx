import React, { useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dotString = event.target?.result as string;
        const graph = graphlibDot.read(dotString);
        // Debug: log the parsed graph object
        console.log("Parsed graphlib graph:", graph);
        const nodes = graph.nodes().map((id: string) => {
          const nodeData = graph.node(id) || {};
          return {
            id,
            label: nodeData.label || id,
            data: { type: nodeData.type || "task" },
          };
        });
        const edges = graph.edges().map((edge: { v: string; w: string }) => ({
          source: edge.v,
          target: edge.w,
        }));
        // Debug: log all parsed edges
        console.log("Parsed DOT edges:", edges);
        const nodeMap = new Map<string, GraphNode>(nodes.map((n) => [n.id, n]));
        const kedroViz = graphToKedroViz({ nodes: nodeMap, edges });
        setKedroVizData(kedroViz);
      } catch (err: any) {
        setError(`Failed to parse DOT file: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ height: 600 }}>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <label style={{ color: "#ccc", fontWeight: 600 }}>
          Upload a pipeline DOT file:
          <input
            type="file"
            accept=".dot,.gv,text/vnd.graphviz,text/plain"
            onChange={handleFileChange}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      {error && (
        <div style={{ color: "#ff6666", marginBottom: 16, textAlign: "center" }}>{error}</div>
      )}
      {loading && (
        <div style={{ color: "#ccc", marginBottom: 16, textAlign: "center" }}>Loading...</div>
      )}
      {kedroVizData && <KedroViz data={kedroVizData} options={options} />}
    </div>
  );
};

export default EmbedViz;
