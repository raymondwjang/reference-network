from config import PLOT_CONFIG

from reference_network import (
    ReferenceGraph,
    GraphVisualizer,
)


def main():

    graph = ReferenceGraph()
    graph.ingest_publication_database()

    visualizer = GraphVisualizer(
        graph, use_interactivity=True, plotly_config=PLOT_CONFIG
    )
    visualizer.visualize()


if __name__ == "__main__":
    main()
