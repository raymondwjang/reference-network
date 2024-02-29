import warnings
from pathlib import Path

from reference_network.publication import Publication


class PublicationDatabase:
    def __init__(self):
        """This method initializes a new publication database."""
        self.publications = []

    def add_publication(self, publication: Publication):
        """This method adds a publication to the database.

        Args:
            publication (Publication): The publication to add.
        """
        self.publications.append(publication)

    def remove_publication(self, doi: str):
        """This method removes a publication from the database based on its DOI.

        Args:
            doi (str): The DOI of the publication to remove.
        """
        self.publications = [pub for pub in self.publications if pub.doi != doi]

    def search_by_year(self, year: int) -> list[Publication]:
        return [pub for pub in self.publications if pub.year == year]

    def search_by_author(self, author: str) -> list[Publication]:
        return [pub for pub in self.publications if author in pub.authors]

    def search_by_doi(self, doi: str) -> Publication:
        """Since unique DOIs are used as identifiers, this method always
        returns a single publication with the given DOI.

        Args:
            doi (str): The DOI of the publication to search for.

        Returns:
            Publication: The publication with the given DOI,

        Raises:
            ValueError: Raised if no publication with the given DOI is found.
        """
        for pub in self.publications:
            if pub.doi == doi:
                return pub
        raise ValueError(f"No publication with DOI '{doi}' found.")

    def save_to_file(self, filename: str | Path):
        """This method saves the database to a file.

        Args:
            filename (str | Path): The name of the file to save to.

        Raises:
            FileExistsError: Raised if the file already exists
        """
        if isinstance(filename, str):
            filename = Path(filename)

        # Print warning if file already exists
        if filename.exists():
            warnings.warn(
                f"File '{filename}' already exists. Overwriting...",
                category=UserWarning,
            )

        # check if path exists
        if not filename.parent.exists():
            filename.parent.mkdir(parents=True)

        with open(filename, "w") as file:
            for pub in self.publications:
                file.write(pub.to_string() + "\n")

    def load_from_file(self, filename: str | Path) -> "PublicationDatabase":
        """This method loads the database from a file.

        Args:
            filename (str | Path): The name of the file to load from.
        """
        with open(filename, "r") as file:
            for line in file:
                self.publications.append(Publication.from_string(line.strip()))

        return self
