# If your application fetches publication data from external sources
# (e.g., Google Scholar, PubMed, CrossRef), you might create a class dedicated
# to this purpose.

#     Attributes: None specific, though could include API keys or rate
#         limiting settings
#     Methods:
#         Methods to fetch data by DOI, title, author, etc.
#         Methods to parse fetched data into Publication objects


from reference_network import DataFetcher


TEST_DATA_PATH = "tests/data/my_zotero_library.csv"


def test_data_fetcher_load_zotero_exported_file():
    fetcher = DataFetcher()
    zotero_data = fetcher.load_zotero_exported_file(filepath=TEST_DATA_PATH)
    assert zotero_data is not None
    assert len(zotero_data) == 31
    assert "Title" in zotero_data.columns
    assert "DOI" in zotero_data.columns
