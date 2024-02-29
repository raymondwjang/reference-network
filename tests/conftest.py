import pytest

from reference_network import Publication, PublicationDatabase, ReferenceGraph


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
