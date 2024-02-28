# This class represents a single publication. It should store relevant metadata
# such as title, authors, publication year, DOI, and references (citations).

#     Attributes:
#         Title
#         Authors
#         Year
#         DOI
#         References (list of DOIs or titles of cited publications)

#     Methods:
#         Constructor to initialize the publication with its metadata
#         Method to add a reference(s)
#         (Optional) Method to fetch metadata from external sources like DOI
#           --> separating this into a diff class

import pytest
from reference_network.publication import Publication


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


@pytest.fixture
def identical_doi_publication():
    title = "Comparison Publication"
    authors = ["Author One", "Author Three"]
    year = 2023
    doi = "10.1000/sampledoi"
    references = ["10.1000/ref3", "10.1000/ref4"]
    return Publication(
        title=title, authors=authors, year=year, doi=doi, references=references
    )


@pytest.fixture
def different_doi_publication():
    title = "Sample Publication 2"
    authors = ["Author One", "Author Three"]
    year = 2023
    doi = "10.1000/sampledoi2"
    references = ["10.1000/ref3", "10.1000/ref4"]
    return Publication(
        title=title, authors=authors, year=year, doi=doi, references=references
    )


def test_publication_equality(sample_publication, identical_doi_publication):
    # Two publications with the same DOI should be considered equal
    assert (
        sample_publication == identical_doi_publication
    ), "Publications with the same DOI should be equal"


def test_publication_inequality(sample_publication, different_doi_publication):
    # Two publications with different DOIs should not be considered equal
    assert (
        sample_publication != different_doi_publication
    ), "Publications with different DOIs should not be equal"


def test_publication_hash_equality(sample_publication, identical_doi_publication):
    # Two publications with the same DOI should have the same hash
    assert hash(sample_publication) == hash(
        identical_doi_publication
    ), "Publications with the same DOI should have the same hash value"


def test_publication_hash_inequality(sample_publication, different_doi_publication):
    # Two publications with different DOIs should have different hashes

    assert hash(sample_publication) != hash(
        different_doi_publication
    ), "Publications with different DOIs should have different hash values"


def test_publication_initialization(sample_publication):
    pub = sample_publication
    assert pub.title == "Sample Publication"
    assert pub.authors == ["Author One", "Author Two"]
    assert pub.year == 2024
    assert pub.doi == "10.1000/sampledoi"
    assert pub.references == ["10.1000/ref1", "10.1000/ref2"]


def test_publication_add_reference(sample_publication):
    pub = sample_publication
    new_reference = "10.1000/newref"
    pub.add_reference(new_reference)
    assert new_reference in pub.references
    assert len(pub.references) == 3  # Assuming initial references are counted


def test_publication_add_references(sample_publication):
    pub = sample_publication
    new_references = ["10.1000/newref1", "10.1000/newref2"]
    pub.add_references(new_references)
    assert (new_references[0] in pub.references) and (
        new_references[1] in pub.references
    )
    assert len(pub.references) == 4  # Assuming initial references are counted


def test_publication_initialization_without_references():
    pub = Publication(
        title="Sample Publication",
        authors=["Author One"],
        year=2024,
        doi="10.1000/sampledoi",
    )

    assert pub.references == []


def test_publication_from_string():
    pub = Publication.from_string(
        "Sample Publication|Author One, Author Two|2024|10.1000/sampledoi|10.1000/ref1, 10.1000/ref2"
    )
    assert pub.title == "Sample Publication"
    assert pub.authors == ["Author One", "Author Two"]
    assert pub.year == 2024
    assert pub.doi == "10.1000/sampledoi"
    assert pub.references == ["10.1000/ref1", "10.1000/ref2"]


def test_publication_to_string(sample_publication):
    pub = sample_publication
    string = pub.to_string()
    assert (
        string
        == "Sample Publication|Author One, Author Two|2024|10.1000/sampledoi|10.1000/ref1, 10.1000/ref2"
    )
