from abc import ABC, abstractmethod
from pathlib import Path
from typing import List

import requests
import pandas as pd

from reference_network import Publication


class DataFetcher(ABC):
    def __init__(self):
        pass

    @abstractmethod
    def load_zotero_exported_file(
        self,
    ) -> List[Publication]:
        pass

    def fetch_references_by_doi(self, doi: str):
        headers = {
            "User-Agent": "ReferenceNetwork/1.0 (raymond.w.jang@gmail.com)",
        }
        url = f"https://api.crossref.org/works/{doi}"

        # Make the request to Crossref API
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            references = data.get("message", {}).get("reference", [])
            return references
        else:
            print(f"Failed to fetch data for DOI {doi}: HTTP {response.status_code}")
            return []


class CSVDataFetcher(DataFetcher):
    def __init__(self, filepath: str | Path):
        self.filepath = Path(filepath)
        if self.filepath.suffix != ".csv":
            raise ValueError(
                "This class only supports CSV files. Please convert your Zotero library to CSV and try again."
            )

    def load_zotero_exported_file(self):
        zotero_data = pd.read_csv(self.filepath)

        return zotero_data


class ZoteroDataFetcher(DataFetcher):
    def __init__(
        self,
        library_id: str,
        zotero_api_key: str,
    ):
        self.library_id = library_id
        self.zotero_api_key = zotero_api_key

    def load_zotero_exported_file(self):
        pass
