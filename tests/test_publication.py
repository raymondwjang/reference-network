# This class represents a single publication. It should store relevant metadata such as title, authors, publication year, DOI, and references (citations).

#     Attributes:
#         Title
#         Authors
#         Year
#         DOI
#         References (list of DOIs or titles of cited publications)

#     Methods:
#         Constructor to initialize the publication with its metadata
#         Method to add a reference
#         (Optional) Method to fetch metadata from external sources like DOI

import pytest
from reference_network.publication import Publication


@pytest.fixture
def sample_publication():
    title = "Sample Publication"
    authors = ["Author One", "Author Two"]
    year = 2024
    doi = "10.1000/sampledoi"
    references = ["10.1000/ref1", "10.1000/ref2"]
    return Publication(title, authors, year, doi, references)


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
