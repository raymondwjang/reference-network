from reference_network.publication import Publication
import networkx as nx


class ReferenceGraph:
    def __init__(self):
        self.graph = nx.DiGraph()

    def add_publication(self, publication: Publication):
        self.graph.add_node(publication.doi, publication=publication)

    def add_citation(
        self, citing_publication: Publication, cited_publication: Publication
    ):
        if (citing_publication.doi in self.graph) and (
            cited_publication.doi in self.graph
        ):
            self.graph.add_edge(citing_publication.doi, cited_publication.doi)
