from reference_network import (
    CSVDataFetcher,
    DataParser,
    ReferenceGraph,
    InteractiveVisualizer,
    StaticVisualizer,
)
from config import PLOT_CONFIG, DATA_CONFIG


def test_e2e_workflow():
    df = CSVDataFetcher(filepath=DATA_CONFIG.data_path)

    zotero_data = df.load_zotero_exported_file()

    parser = DataParser()
    zotero_database = parser.transform_df_to_publication_database(zotero_data)
    delay_between_requests = df.fetch_with_rate_limit()
    database = parser.populate_references(
        zotero_database, df, delay_between_requests=delay_between_requests
    )

    graph = ReferenceGraph()
    graph.ingest_publication_database(database)

    i_visualizer = InteractiveVisualizer(graph, config=PLOT_CONFIG)
    i_visualizer.visualize()

    s_visualizer = StaticVisualizer(graph, config=PLOT_CONFIG)
    s_visualizer.visualize()
