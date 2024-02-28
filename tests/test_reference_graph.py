# This class is responsible for constructing the network graph from the
# publications, where nodes represent publications and edges represent
# citations between them.

#     Attributes:
#         Graph structure (could use an adjacency list, adjacency matrix, or a
#         library like NetworkX)

#     Methods:
#         Constructor to initialize the graph
#         Method to add a node (publication)
#         Method to add an edge (citation) between nodes
#         Method to generate graph from a publication database
#         Methods for graph analysis (e.g., finding the most
#         cited papers)
#         Method to load/save the graph from/to a file

import pytest
from reference_network.reference_graph import ReferenceGraph
from reference_network.publication import Publication
from reference_network.publication_database import PublicationDatabase


@pytest.fixture
def citing_publication():
    title = "Sample Publication"
    authors = ["Author One", "Author Two"]
    year = 2024
    doi = "10.1000/citer"
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
def empty_publication_database():
    return PublicationDatabase()


# Fixture for a PublicationDatabase with one sample publication
@pytest.fixture
def sparse_publication_database(citing_publication):
    db = PublicationDatabase()
    db.add_publication(citing_publication)
    return db


# Fixture for a PublicationDatabase with multiple sample publications
@pytest.fixture
def filled_publication_database(citing_publication, cited_publication):
    db = PublicationDatabase()
    db.add_publication(citing_publication)
    db.add_publication(cited_publication)
    return db


def test_reference_graph_initialization():
    rg = ReferenceGraph()
    assert len(rg.graph.nodes) == 0
    assert len(rg.graph.edges) == 0


def test_reference_graph_add_publication(citing_publication):
    rg = ReferenceGraph()
    rg.add_publication(citing_publication)
    assert citing_publication.doi in rg.graph.nodes


def test_reference_graph_add_citation(citing_publication, cited_publication):
    rg = ReferenceGraph()
    rg.add_publication(citing_publication)
    rg.add_publication(cited_publication)

    rg.add_citation(citing_publication, cited_publication)
    assert rg.graph.has_edge(citing_publication.doi, cited_publication.doi)


def test_add_publication_from_database_to_graph(filled_publication_database):
    rg = ReferenceGraph()
    for pub in filled_publication_database.publications:
        rg.add_publication(pub)  # Assuming DOI is used as the identifier
    for pub in filled_publication_database.publications:
        assert pub.doi in rg.graph.nodes


def test_add_citation_between_publications(filled_publication_database):
    rg = ReferenceGraph()
    for pub in filled_publication_database.publications:
        rg.add_publication(pub)

    for pub in filled_publication_database.publications:
        for ref_doi in pub.references:
            if ref_doi in [pub.doi for pub in filled_publication_database.publications]:
                ref = filled_publication_database.search_by_doi(ref_doi)
                rg.add_citation(pub, ref)

    assert rg.graph.has_edge(
        filled_publication_database.publications[0].doi,
        filled_publication_database.publications[1].doi,
    )
