from pathlib import Path

import pandas as pd

from reference_network import Publication, PublicationDatabase


class DataFetcher:
    def __init__(
        self,
        semantic_scholar_api_key: str | None = None,
    ):

        if semantic_scholar_api_key is None:
            raise ValueError(
                "An API key is required for online Semantic Scholar access"
            )
        self.semantic_scholar_api_key = semantic_scholar_api_key

    def load_zotero_exported_file(
        self,
        from_online: bool = False,
        filepath: str | Path | None = None,
        library_id: str | None = None,
        zotero_api_key: str | None = None,
    ):
        if from_online:
            if zotero_api_key is None:
                raise ValueError("An API key is required for online Zotero access")
            self.zotero_api_key = zotero_api_key
            self.library_id = library_id
        else:
            if filepath is None:
                raise ValueError("A filepath is required for offline Zotero access")
            self.filepath = Path(filepath)
            # Check filetype
            if self.filepath.suffix != ".csv":
                raise ValueError(
                    "Only the CSV format is supported for now. To download, use Zotero Desktop (File -> Export Library -> CSV) or Zotero Web (File -> Export -> CSV)."
                )
            zotero_data = pd.read_csv(self.filepath)

        return zotero_data

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

    def fetch_by_doi(self, doi: str):
        pass

    def fetch_by_title(self, title: str):
        pass

    def fetch_by_author(self, author: str):
        pass

    def parse_publication_data(self, data: dict):
        pass
