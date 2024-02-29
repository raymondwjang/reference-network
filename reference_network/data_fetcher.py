from pathlib import Path
import requests
import pandas as pd


class DataFetcher:
    def __init__(self):
        pass

    def load_zotero_exported_file(
        self,
        from_online: bool = False,
        filepath: str | Path | None = None,
        library_id: str | None = None,
        api_key: str | None = None,
    ):
        if from_online:
            if api_key is None:
                raise ValueError("An API key is required for online Zotero access")
            self.api_key = api_key
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

    def fetch_by_doi(self, doi: str):
        pass

    def fetch_by_title(self, title: str):
        pass

    def fetch_by_author(self, author: str):
        pass

    def parse_publication_data(self, data: dict):
        pass
