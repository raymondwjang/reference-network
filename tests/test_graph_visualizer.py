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

from reference_network import InteractiveVisualizer, StaticVisualizer
from config import PLOT_CONFIG


@pytest.fixture
def mock_reference_graph(filled_reference_graph):
    return MagicMock(spec=filled_reference_graph)


@pytest.fixture
def interactive_visualizer(mock_reference_graph):
    return InteractiveVisualizer(mock_reference_graph, config=PLOT_CONFIG)


@pytest.fixture
def static_visualizer(mock_reference_graph):
    return StaticVisualizer(mock_reference_graph, config=PLOT_CONFIG)


@patch("reference_network.graph_visualizer.InteractiveVisualizer.visualize")
def test_graph_visualizer_visualize_with_pyvis(
    mock_visualize_with_pyvis, interactive_visualizer
):
    interactive_visualizer.use_interactivity = True
    interactive_visualizer.visualize()
    mock_visualize_with_pyvis.assert_called_once()


@patch("reference_network.graph_visualizer.StaticVisualizer.visualize")
def test_graph_visualizer_visualize_with_graphviz(
    mock_visualize_with_graphviz, static_visualizer
):
    static_visualizer.use_interactivity = False
    static_visualizer.visualize()
    mock_visualize_with_graphviz.assert_called_once()
