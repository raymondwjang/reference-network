import networkx as nx

from reference_network.publication import Publication


class ReferenceGraph:
    def __init__(self):
        self.graph = nx.DiGraph()

    def add_publication(self, publication: Publication):
        hover_info = f"Title: {publication.title}\nAuthors: {publication.authors[0]} et al.\nYear: {publication.year}"
        self.graph.add_node(publication.doi, title=hover_info)

    def add_citation(
        self, citing_publication: Publication, cited_publication: Publication
    ):
        if (citing_publication.doi in self.graph) and (
            cited_publication.doi in self.graph
        ):
            self.graph.add_edge(citing_publication.doi, cited_publication.doi)

    def ingest_publication_database(self, publication_database):
        for pub in publication_database.publications:
            self.add_publication(pub)

        for pub in publication_database.publications:
            for ref_doi in pub.references:
                if ref_doi in [pub.doi for pub in publication_database.publications]:
                    ref = publication_database.search_by_doi(ref_doi)
                    self.add_citation(pub, ref)
