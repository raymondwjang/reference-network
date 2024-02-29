from config import CONFIG

from reference_network import (
    ReferenceGraph,
    GraphVisualizer,
)


def main():

    # fetcher = DataFetcher()
    graph = ReferenceGraph()
    graph.ingest_publication_database(filled_publication_database)

    visualizer = GraphVisualizer(graph, use_interactivity=True, plotly_config=CONFIG)
    visualizer.visualize()


if __name__ == "__main__":
    main()
