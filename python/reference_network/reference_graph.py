import networkx as nx


class ReferenceGraph:
    def __init__(self):
        self.graph = nx.DiGraph()

    def add_publication(self, publication):
        """Add a publication to the graph.

        Args:
            publication (Publication): The publication to add to the graph.
        """
        hover_info = f"Title: {publication.title}\nAuthors: {publication.authors[0]} et al.\nYear: {publication.year}"
        self.graph.add_node(publication.doi, title=hover_info)

    def add_citation(self, citing_publication, cited_publication):
        """Add a citation between two publications.

        Args:
            citing_publication (Publication): The publication that cites the other.
            cited_publication (Publication): The publication that is cited.
        """
        if (citing_publication.doi in self.graph) and (
            cited_publication.doi in self.graph
        ):
            self.graph.add_edge(citing_publication.doi, cited_publication.doi)

    def ingest_publication_database(self, publication_database):
        """Ingest a publication database into the graph.

        Args:
            publication_database (PublicationDatabase): The publication database to ingest.
        """
        for pub in publication_database.publications:
            self.add_publication(pub)

        for pub in publication_database.publications:
            for ref_doi in pub.references:
                if ref_doi in [pub.doi for pub in publication_database.publications]:
                    ref = publication_database.search_by_doi(ref_doi)
                    self.add_citation(pub, ref)
