import plotly.graph_objects as go
from graphviz import Digraph
import networkx as nx


class GraphVisualizer:
    def __init__(
        self,
        reference_graph,
        use_interactivity: bool,
        plotly_config=None,
        graphviz_config=None,
    ):
        self.reference_graph = reference_graph
        self.use_interactivity: bool = use_interactivity
        # Make sure only one of plotly_config and graphviz_config is provided
        if (plotly_config is None) == (graphviz_config is None):
            raise ValueError(
                "Exactly one of plotly_config and graphviz_config should be provided"
            )
        if plotly_config is not None:
            self.config = plotly_config
        else:
            self.config = graphviz_config

    def visualize(self):
        if self.use_interactivity:
            return self._visualize_with_plotly(config=self.config)
        else:
            return self._visualize_with_graphviz(config=self.config)

    def _visualize_with_plotly(self, config):
        pos = nx.spring_layout(
            self.reference_graph.graph
        )  # Position nodes using Spring layout
        edge_x = []
        edge_y = []
        for edge in self.reference_graph.graph.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_x.extend([x0, x1, None])
            edge_y.extend([y0, y1, None])

        edge_trace = go.Scatter(
            x=edge_x,
            y=edge_y,
            line=config.edge_line,
            hoverinfo="none",
            mode="lines",
        )

        node_x = []
        node_y = []
        for node in self.reference_graph.graph.nodes():
            x, y = pos[node]
            node_x.append(x)
            node_y.append(y)

        node_trace = go.Scatter(
            x=node_x,
            y=node_y,
            mode="markers",
            hoverinfo="text",
            marker=config.node_marker,
        )

        fig = go.Figure(
            data=[edge_trace, node_trace],
            layout=go.Layout(
                **config.layout,
            ),
        )
        fig.show()

    def _visualize_with_graphviz(self, config):
        # Create a Graphviz graph from the reference_graph
        dot = Digraph(comment="The Reference Graph")
        for node in self.reference_graph.graph.nodes():
            dot.node(str(node), str(node))  # Assuming nodes can be uniquely identified

        for edge in self.reference_graph.graph.edges():
            dot.edge(str(edge[0]), str(edge[1]))

        # Render the graph to a file (e.g., PNG)
        dot.render(config.image_path, view=True)  # 'view=True' opens the rendered file
