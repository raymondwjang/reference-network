from typing import List
from pydantic import BaseModel


class Publication(BaseModel):
    title: str
    authors: List[str]
    year: int
    doi: str
    references: List[str] = []

    @classmethod
    def from_string(cls, string: str):
        title, authors, year, doi, references_str = string.split("|")
        authors_list = authors.split(", ")
        references_list = references_str.split(", ") if references_str else []
        return cls(
            title=title,
            authors=authors_list,
            year=int(year),
            doi=doi,
            references=references_list,
        )

    def to_string(self):
        authors_str = ", ".join(self.authors)
        references_str = ", ".join(self.references)
        return f"{self.title}|{authors_str}|{self.year}|{self.doi}|{references_str}"

    def add_reference(self, reference: str):
        self.references.append(reference)

    def add_references(self, references: List[str]):
        self.references.extend(references)
