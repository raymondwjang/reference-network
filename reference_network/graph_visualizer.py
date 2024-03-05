from abc import ABC, abstractmethod

import matplotlib.colors as mcolors
import networkx as nx
import seaborn as sns
from graphviz import Digraph
from pyvis.network import Network


class GraphVisualizer(ABC):
    def __init__(self, reference_graph, config):
        self.reference_graph = reference_graph
        self.config = config

    @abstractmethod
    def visualize(self):
        pass


class InteractiveVisualizer(GraphVisualizer):
    def __init__(self, reference_graph, config):
        super().__init__(reference_graph, config)

    def visualize(self):
        """Visualize the reference graph interactively using Pyvis."""
        # Create a Pyvis network
        net = Network(
            directed=True,
            height="750px",
            width="100%",
            bgcolor="#222222",
            font_color="white",
            neighborhood_highlight=True,
            select_menu=True,
            filter_menu=True,
        )

        net.from_nx(self.reference_graph.graph)
        reference_counts = dict(self.reference_graph.graph.in_degree)

        def reference_count_to_size(count):
            base_size = self.config.base_size  # Minimum size
            scaling_factor = self.config.scaling_factor  # Scaling factor
            return base_size + (count * scaling_factor)

        components = list(nx.weakly_connected_components(self.reference_graph.graph))
        num_components = len(components)

        # Generate a color palette with Seaborn
        palette = sns.color_palette(
            "hsv", num_components
        )  # "hsv" is a good choice for distinct colors
        # Convert RGB colors to hex format as PyVis expects colors in hex or named color format
        colors = [mcolors.to_hex(color) for color in palette]

        # Map each node to a color based on its component
        node_colors = {}
        for i, component in enumerate(components):
            color = colors[i]  # Use the dynamically generated color
            for node in component:
                node_colors[node] = color

        for node in net.nodes:
            node_id = node["id"]
            ref_count = reference_counts.get(node_id, 0)
            node["size"] = reference_count_to_size(ref_count)
            node["color"] = node_colors.get(
                node_id, "#808080"
            )  # Default to gray if not found

        net.show_buttons(filter_=["physics"])
        net.show(self.config.interactive_graph_path, notebook=False)


class StaticVisualizer(GraphVisualizer):
    def __init__(self, reference_graph, config):
        super().__init__(reference_graph, config)

    def visualize(self):
        """Visualize the reference graph statically using Graphviz."""
        # Create a Graphviz graph from the reference_graph
        dot = Digraph(name="My Zotero Reference Graph")
        for node in self.reference_graph.graph.nodes():
            dot.node(str(node), str(node))  # Assuming nodes can be uniquely identified

        for edge in self.reference_graph.graph.edges():
            dot.edge(str(edge[0]), str(edge[1]))

        # Render the graph to a file (e.g., PNG)
        dot.render(
            self.config.static_graph_path, view=True, cleanup=True
        )  # 'view=True' opens the rendered file
