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

from reference_network import ReferenceGraph


def test_reference_graph_initialization():
    rg = ReferenceGraph()
    assert len(rg.graph.nodes) == 0
    assert len(rg.graph.edges) == 0


def test_reference_graph_add_publication(sample_publication):
    rg = ReferenceGraph()
    rg.add_publication(sample_publication)
    assert sample_publication.doi in rg.graph.nodes


def test_reference_graph_add_citation(sample_publication, cited_publication):
    rg = ReferenceGraph()
    rg.add_publication(sample_publication)
    rg.add_publication(cited_publication)

    rg.add_citation(sample_publication, cited_publication)
    assert rg.graph.has_edge(sample_publication.doi, cited_publication.doi)


def test_reference_graph_add_publication_from_database_to_graph(
    filled_publication_database,
):
    rg = ReferenceGraph()
    for pub in filled_publication_database.publications:
        rg.add_publication(pub)  # Assuming DOI is used as the identifier
    for pub in filled_publication_database.publications:
        assert pub.doi in rg.graph.nodes


def test_reference_graph_add_citation_between_publications(filled_publication_database):
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


def test_reference_graph_ingest_publication_database(filled_publication_database):
    rg = ReferenceGraph()
    rg.ingest_publication_database(filled_publication_database)
    for pub in filled_publication_database.publications:
        assert pub.doi in rg.graph.nodes

    for pub in filled_publication_database.publications:
        for ref_doi in pub.references:
            if ref_doi in [pub.doi for pub in filled_publication_database.publications]:
                ref = filled_publication_database.search_by_doi(ref_doi)
                assert rg.graph.has_edge(pub.doi, ref.doi)
