from reference_network import ReferenceGraph, GraphVisualizer
from config import CONFIG


def test_e2e_workflow(filled_publication_database):
    # fetcher = DataFetcher()
    graph = ReferenceGraph()
    graph.ingest_publication_database(filled_publication_database)

    visualizer = GraphVisualizer(graph, use_interactivity=True, plotly_config=CONFIG)
    visualizer.visualize()
