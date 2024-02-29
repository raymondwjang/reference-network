# Depending on the complexity of your visualization requirements, you might
# design a separate class for graph visualization, especially if you plan to
# support different visualization styles or libraries
# (e.g., Matplotlib, Plotly, Graphviz, Pyviz).

#     Attributes:
#         Reference to a ReferenceGraph instance
#         Visualization settings (e.g., layout, color scheme)

#     Methods:
#         Constructor to initialize with a ReferenceGraph
#         Method to plot the graph
#         (Optional) Methods to customize the visualization (e.g., set node
#         size based on citation count)

from unittest.mock import MagicMock, patch

import pytest

from reference_network import GraphVisualizer


@pytest.fixture
def mock_reference_graph(filled_reference_graph):
    return MagicMock(spec=filled_reference_graph)


@pytest.fixture
def graph_visualizer(mock_reference_graph):
    return GraphVisualizer(mock_reference_graph)


@patch("reference_network.graph_visualizer.GraphVisualizer._visualize_with_plotly")
def test_graph_visualizer_visualize_with_plotly(
    mock_visualize_with_plotly, graph_visualizer
):
    graph_visualizer.use_interactivity = True
    graph_visualizer.visualize()
    mock_visualize_with_plotly.assert_called_once()


@patch("reference_network.graph_visualizer.GraphVisualizer._visualize_with_graphviz")
def test_graph_visualizer_visualize_with_graphviz(
    mock_visualize_with_graphviz, graph_visualizer
):
    graph_visualizer.use_interactivity = False
    graph_visualizer.visualize()
    mock_visualize_with_graphviz.assert_called_once()
