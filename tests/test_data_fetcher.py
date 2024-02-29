# If your application fetches publication data from external sources
# (e.g., Google Scholar, PubMed, CrossRef), you might create a class dedicated
# to this purpose.

#     Attributes: None specific, though could include API keys or rate
#         limiting settings
#     Methods:
#         Methods to fetch data by DOI, title, author, etc.
#         Methods to parse fetched data into Publication objects
import pytest

from reference_network import DataFetcher, Publication, PublicationDatabase


TEST_DATA_PATH = "tests/data/my_zotero_library.csv"


@pytest.fixture
def data_fetcher():
    return DataFetcher(
        semantic_scholar_api_key="my_semantic_scholar_api_key",
    )


def test_data_fetcher_load_zotero_exported_file(data_fetcher):
    zotero_data = data_fetcher.load_zotero_exported_file(filepath=TEST_DATA_PATH)
    assert zotero_data is not None
    assert len(zotero_data) == 31
    assert "Title" in zotero_data.columns
    assert "DOI" in zotero_data.columns


def test_data_fetcher_transform_row_to_publication(data_fetcher):
    zotero_data = data_fetcher.load_zotero_exported_file(filepath=TEST_DATA_PATH)
    publication = data_fetcher.transform_row_to_publication(zotero_data.iloc[0])
    assert isinstance(publication, Publication)


def test_data_fetcher_transform_df_to_publication_database(data_fetcher):
    zotero_data = data_fetcher.load_zotero_exported_file(filepath=TEST_DATA_PATH)
    publication_database = data_fetcher.transform_df_to_publication_database(
        zotero_data
    )
    assert isinstance(publication_database, PublicationDatabase)
    assert len(publication_database.publications) == 29
    assert isinstance(publication_database.publications[0], Publication)
