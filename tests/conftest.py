import pytest
from reference_network import Publication, PublicationDatabase


@pytest.fixture
def sample_publication():
    title = "Sample Publication"
    authors = ["Author One", "Author Two"]
    year = 2024
    doi = "10.1000/sampledoi"
    references = ["10.1000/ref1", "10.1000/ref2"]
    return Publication(
        title=title, authors=authors, year=year, doi=doi, references=references
    )


# Fixture for a PublicationDatabase with one sample publication
@pytest.fixture
def db_with_sample_publication(sample_publication):
    db = PublicationDatabase()
    db.add_publication(sample_publication)
    return db
