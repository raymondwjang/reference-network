import logging

import pytest

from reference_network import CSVDataFetcher, DataParser, ReferenceGraph
from reference_network.publication import Publication
from reference_network.publication_database import PublicationDatabase


@pytest.fixture(scope="session", autouse=True)
def configure_logging():
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
    )
    # Use 'session' scope for application-wide settings, and 'autouse=True' to automatically use this fixture in tests


TEST_DATA_PATH = "tests/data/my_zotero_library.csv"


@pytest.fixture
def csv_data_fetcher():
    return CSVDataFetcher(
        filepath=TEST_DATA_PATH,
    )


@pytest.fixture(scope="function")
def sample_publication():
    title = "Sample Publication"
    authors = ["Author One", "Author Two"]
    year = 2024
    doi = "10.1000/sampledoi"
    references = ["10.1000/ref1", "10.1000/ref2"]
    return Publication(
        title=title, authors=authors, year=year, doi=doi, references=references
    )


@pytest.fixture
def cited_publication():
    title = "Sample Publication"
    authors = ["Author One", "Author Two"]
    year = 2024
    doi = "10.1000/ref1"
    references = ["10.1000/ref2"]
    return Publication(
        title=title, authors=authors, year=year, doi=doi, references=references
    )


# Fixture for an empty PublicationDatabase
@pytest.fixture
def empty_db():
    return PublicationDatabase()


# Fixture for a PublicationDatabase with one sample publication
@pytest.fixture
def sparse_publication_database(sample_publication):
    db = PublicationDatabase()
    db.add_publication(sample_publication)
    return db


# Fixture for a PublicationDatabase with multiple sample publications
@pytest.fixture
def filled_publication_database(sample_publication, cited_publication):
    db = PublicationDatabase()
    db.add_publication(sample_publication)
    db.add_publication(cited_publication)
    return db


@pytest.fixture
def empty_reference_graph():
    return ReferenceGraph()


@pytest.fixture
def filled_reference_graph(filled_publication_database):
    rg = ReferenceGraph()
    rg.ingest_publication_database(filled_publication_database)
    return rg


@pytest.fixture
def data_parser():
    return DataParser()


@pytest.fixture
def real_publication_database(csv_data_fetcher, data_parser):
    zotero_data = csv_data_fetcher.load_zotero_exported_file()
    raw_database = data_parser.transform_df_to_publication_database(zotero_data)
    return raw_database
