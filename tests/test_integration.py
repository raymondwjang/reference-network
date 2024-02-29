from reference_network import ReferenceGraph, GraphVisualizer
from config import PLOT_CONFIG


def test_e2e_workflow(filled_publication_database):
    graph = ReferenceGraph()
    graph.ingest_publication_database(filled_publication_database)

    visualizer = GraphVisualizer(
        graph, use_interactivity=True, plotly_config=PLOT_CONFIG
    )
    visualizer.visualize()
