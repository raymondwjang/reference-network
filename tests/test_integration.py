from reference_network import (
    CSVDataFetcher,
    DataParser,
    ReferenceGraph,
    InteractiveVisualizer,
    StaticVisualizer,
)
from config import PLOT_CONFIG


def test_e2e_workflow():
    df = CSVDataFetcher(filepath="tests/data/my_zotero_library.csv")

    zotero_data = df.load_zotero_exported_file()

    parser = DataParser()
    raw_database = parser.transform_df_to_publication_database(zotero_data)
    delay_between_requests = df.fetch_with_rate_limit()
    database = parser.populate_references(
        raw_database, df, delay_between_requests=delay_between_requests
    )

    graph = ReferenceGraph()
    graph.ingest_publication_database(database)

    visualizer = InteractiveVisualizer(graph, pyvis_config=PLOT_CONFIG)
    visualizer.visualize()
