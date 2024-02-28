from typing import List


class Publication:
    def __init__(
        self,
        title: str,
        authors: List[str],
        year: int,
        doi: str,
        references: List[str] = [],
    ):
        self.title = title
        self.authors = authors
        self.year = year
        self.doi = doi
        self.references = references

    def add_reference(self, reference: str):
        self.references.append(reference)

    def add_references(self, references: List[str]):
        self.references.extend(references)
