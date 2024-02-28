# A class to manage a collection of Publication objects. This could involve
# fetching publication data from APIs, loading from files, and providing
# search capabilities.

#     Attributes:
#         List or dictionary of Publication objects

#     Methods:
#         Constructor to initialize the database
#         Method to add a Publication to the database
#         Method to remove a Publication from the database
#         Method to search for publications by various metadata
#         (e.g., year, author)
#         (Optional) Method to load/save the database from/to a file

import pytest
from reference_network.publication import Publication
from reference_network.publication_database import PublicationDatabase


# Fixture for creating a sample publication object
@pytest.fixture
def sample_publication():
    title = "Sample Publication"
    authors = ["Author One", "Author Two"]
    year = 2024
    doi = "10.1000/sampledoi"
    references = ["10.1000/ref1", "10.1000/ref2"]
    return Publication(title, authors, year, doi, references)


# Fixture for an empty PublicationDatabase
@pytest.fixture
def empty_db():
    return PublicationDatabase()


# Fixture for a PublicationDatabase with one sample publication
@pytest.fixture
def db_with_sample_publication(sample_publication):
    db = PublicationDatabase()
    db.add_publication(sample_publication)
    return db


# Test adding a publication to the database
def test_add_publication(empty_db, sample_publication):
    empty_db.add_publication(sample_publication)
    assert len(empty_db.publications) == 1
    assert empty_db.publications[0].title == "Sample Title"


# Test removing a publication from the database
def test_remove_publication(db_with_sample_publication, sample_publication):
    db_with_sample_publication.remove_publication(sample_publication)
    assert len(db_with_sample_publication.publications) == 0


# Test searching for publications by year
def test_search_publications_by_year(db_with_sample_publication):
    results = db_with_sample_publication.search_by_year(2021)
    assert len(results) == 1
    assert results[0].year == 2021


# Test searching for publications by author
def test_search_publications_by_author(db_with_sample_publication):
    results = db_with_sample_publication.search_by_author("Author One")
    assert len(results) == 1
    assert "Author One" in results[0].authors


# Test loading and saving the database
@pytest.mark.skip(reason="Optional functionality not yet implemented")
def test_load_save_database():
    db = PublicationDatabase()
    db.add_publication(sample_publication)
    db.save_to_file("test_db.json")
    new_db = PublicationDatabase()
    new_db.load_from_file("test_db.json")
    assert len(new_db.publications) == 1
    assert new_db.publications[0].title == "Sample Title"
