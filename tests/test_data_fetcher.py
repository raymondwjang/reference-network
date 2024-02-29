# If your application fetches publication data from external sources
# (e.g., Google Scholar, PubMed, CrossRef), you might create a class dedicated
# to this purpose.

#     Attributes: None specific, though could include API keys or rate
#         limiting settings
#     Methods:
#         Methods to fetch data by DOI, title, author, etc.
#         Methods to parse fetched data into Publication objects

import pytest
from unittest.mock import patch, MagicMock

from reference_network import DataFetcher


def test_data_fetcher_fetch_by_doi():
    with patch("reference_network.data_fetcher.requests.get") as mock_get:
        # Setup mock response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "title": "Test Publication",
            "doi": "10.1000/xyz",
        }
        mock_get.return_value = mock_response

        fetcher = DataFetcher(api_key="dummy_api_key")
        data = fetcher.fetch_by_doi("10.1000/xyz")

        # Verify the requests.get call
        mock_get.assert_called_once_with(
            "URL_FOR_DOI_FETCH",
            params={"doi": "10.1000/xyz", "api_key": "dummy_api_key"},
        )
        # Assert on the returned data structure
        assert data == {"title": "Test Publication", "doi": "10.1000/xyz"}


@pytest.mark.parametrize(
    "input_data, expected_output",
    [
        (
            {"title": "Test Publication", "doi": "10.1000/xyz"},
            "Publication(title='Test Publication', doi='10.1000/xyz')",
        ),
    ],
)
def test_data_fetcher_parse_publication_data(input_data, expected_output):
    fetcher = DataFetcher()
    publication = fetcher.parse_publication_data(input_data)
    assert str(publication) == expected_output
