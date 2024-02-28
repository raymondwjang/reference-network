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

    def search_by_year(self, year: int):
        return [pub for pub in self.publications if pub.year == year]

    def search_by_author(self, author: str):
        return [pub for pub in self.publications if author in pub.authors]

    def save_to_file(self, filename: str | Path):
        """This method saves the database to a file.

        Args:
            filename (str | Path): The name of the file to save to.

        Raises:
            FileExistsError: Raised if the file already exists
            FileNotFoundError: Raised if the path does not exist
        """
        if isinstance(filename, str):
            filename = Path(filename)

        # check if file exists
        if filename.exists():
            raise FileExistsError(f"File {filename} already exists.")

        # check if path exists
        if not filename.parent.exists():
            raise FileNotFoundError(f"Path {filename.parent} does not exist.")

        with open(filename, "w") as file:
            for pub in self.publications:
                file.write(pub.to_string() + "\n")

    def load_from_file(self, filename: str | Path):
        """This method loads the database from a file.

        Args:
            filename (str | Path): The name of the file to load from.
        """
        with open(filename, "r") as file:
            for line in file:
                self.publications.append(Publication.from_string(line.strip()))
