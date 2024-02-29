from typing import List

from pydantic import BaseModel


class Publication(BaseModel):
    """This class represents a publication."""

    title: str
    authors: List[str]
    year: int
    doi: str
    references: List[str] = []

    def __hash__(self):
        """This method returns a hash of the publication.
        Use DOI as a unique identifier for hashing

        Returns:
            int: A hash of the publication.
        """
        return hash(self.doi)

    def __eq__(self, other):
        """This method returns a boolean indicating whether two publications are equal.
        Publications are considered equal if their DOIs match

        Args:
            other (Publication): The publication to compare to.

        Returns:
            bool: True if the publications are equal, False otherwise.
        """
        return self.doi == other.doi

    @classmethod
    def from_string(cls, string: str):
        """This method returns a new publication from a string representation.

        Args:
            string (str): A string representation of the publication.

        Returns:
            Publication: A new publication.
        """
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
        """This method returns a string representation of the publication.

        Returns:
            str: A string representation of the publication.
        """
        authors_str = ", ".join(self.authors)
        references_str = ", ".join(self.references)
        return f"{self.title}|{authors_str}|{self.year}|{self.doi}|{references_str}"

    def add_reference(self, reference: str):
        """This method adds a reference to the publication.

        Args:
            reference (str): The DOI of the reference.
        """
        self.references.append(reference)

    def add_references(self, references: List[str]):
        """This method adds multiple references to the publication.

        Args:
            references (List[str]): A list of DOIs of the references.
        """
        self.references.extend(references)
