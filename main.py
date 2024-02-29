from config import PLOT_CONFIG

from reference_network import (
    DataFetcher,
    ReferenceGraph,
    GraphVisualizer,
)


def main():
    data_fetcher = DataFetcher(
        semantic_scholar_api_key="your_api_key_here",
    )
    raw_data = data_fetcher.load_zotero_exported_file(
        from_online=False, filepath="tests/data/my_zotero_library.csv"
    )
    publication_database = data_fetcher.transform_df_to_publication_database(raw_data)

    graph = ReferenceGraph()
    graph.ingest_publication_database(publication_database)

    visualizer = GraphVisualizer(
        graph, use_interactivity=True, plotly_config=PLOT_CONFIG
    )
    visualizer.visualize()


if __name__ == "__main__":
    main()
