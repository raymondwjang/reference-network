import pandas as pd

from reference_network import Publication, PublicationDatabase


class DataParser:
    def transform_row_to_publication(self, zotero_row: pd.Series):
        # transform pandas row to PublicationDatabase
        publication = Publication(
            title=zotero_row["Title"],
            authors=zotero_row["Author"].split(" and "),
            year=zotero_row["Publication Year"],
            doi=zotero_row["DOI"],
        )
        return publication

    def transform_df_to_publication_database(self, zotero_data: pd.DataFrame):
        publication_database = PublicationDatabase()
        for _, row in zotero_data.iterrows():
            if pd.isna(row["DOI"]):
                print(f"Skipping row with title {row['Title']} because it has no DOI")
                continue
            publication = self.transform_row_to_publication(row)
            publication_database.add_publication(publication)
        return publication_database

    def crossref_reference_to_dois(self, references):
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

    def crossref_data_into_publication(self, publication: Publication, references):
        publication.references = self.crossref_reference_to_dois(references)
        return publication

    def populate_references(
        self, publication_database: PublicationDatabase, data_fetcher
    ):
        for publication in publication_database.publications:
            references = data_fetcher.fetch_references_by_doi(publication.doi)
            publication = self.crossref_data_into_publication(publication, references)
        return publication_database
