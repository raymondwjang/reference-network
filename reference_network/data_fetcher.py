class DataFetcher:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    def from_zotero(self, library_id: str, api_key: str):
        pass

    def fetch_by_doi(self, doi: str):
        pass

    def fetch_by_title(self, title: str):
        pass

    def fetch_by_author(self, author: str):
        pass

    def parse_publication_data(self, data: dict):
        pass
