from typing import List
import time
import pandas as pd

from reference_network import Publication, PublicationDatabase


class DataParser:
    def transform_row_to_publication(self, zotero_row: pd.Series) -> Publication:
        """Transform a row from a Zotero DataFrame to a Publication.

        Args:
            zotero_row (pd.Series): A row from a Zotero DataFrame.

        Returns:
            Publication: The transformed publication.
        """
        publication = Publication(
            title=zotero_row["Title"],
            authors=zotero_row["Author"].split("; "),
            year=zotero_row["Publication Year"],
            doi=zotero_row["DOI"],
        )
        return publication

    def transform_df_to_publication_database(
        self, zotero_data: pd.DataFrame
    ) -> PublicationDatabase:
        """Transform a Zotero DataFrame to a PublicationDatabase.

        Args:
            zotero_data (pd.DataFrame): The Zotero DataFrame to transform.

        Returns:
            PublicationDatabase: The transformed publication database.
        """
        publication_database = PublicationDatabase()
        for _, row in zotero_data.iterrows():
            if pd.isna(row["DOI"]):
                print(f"Skipping row with title {row['Title']} because it has no DOI")
                continue
            publication = self.transform_row_to_publication(row)
            publication_database.add_publication(publication)
        return publication_database

    def crossref_reference_to_dois(self, references) -> List[str]:
        """Transform a list of Crossref references to a list of DOIs.

        Args:
            references (List[Dict[str, str]]): A list of Crossref references.

        Returns:
            List[str]: A list of DOIs.
        """
        dois = []
        for reference in references:
            doi = reference.get("DOI")
            if doi:
                dois.append(doi)
            else:
                print(
                    f"Skipping reference {reference.get('article-title')} because it has no DOI"
                )
        return dois

    def crossref_data_into_publication(
        self, publication: Publication, references
    ) -> Publication:
        """Add Crossref data to a publication.

        Args:
            publication (Publication): The publication to add data to.
            references (List[Dict[str, str]]): A list of Crossref references.

        Returns:
            Publication: The publication with added Crossref data.
        """
        publication.references = self.crossref_reference_to_dois(references)
        return publication

    def populate_references(
        self,
        publication_database: PublicationDatabase,
        data_fetcher,
        delay_between_requests: float = 0,
    ) -> PublicationDatabase:
        """Populate the references of a publication database using a data fetcher.

        Args:
            publication_database (PublicationDatabase): The publication database to populate.
            data_fetcher (DataFetcher): The data fetcher to use.
            delay_between_requests (float): The delay between requests in seconds.

        Returns:
            PublicationDatabase: The populated publication database.
        """
        for publication in publication_database.publications:
            references = data_fetcher.fetch_references_by_doi(publication.doi)
            publication = self.crossref_data_into_publication(publication, references)
            time.sleep(delay_between_requests)
        return publication_database
