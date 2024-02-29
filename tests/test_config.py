import pytest
from config import PlotConfig, DataConfig
from tempfile import NamedTemporaryFile


@pytest.fixture
def plot_config():
    pc = PlotConfig()
    pc.edge_line = {"width": 0.5, "color": "#888"}
    pc.node_marker = {
        "showscale": True,
        "colorscale": "YlGnBu",
        "color": [],
        "size": 10,
    }
    pc.layout = {
        "showlegend": False,
        "hovermode": "closest",
        "margin": {"b": 0, "l": 0, "r": 0, "t": 0},
    }
    return pc


@pytest.fixture
def data_config():
    return DataConfig(
        data_path="data/references.json",
        zotero_api_key="your_zotero_api_key",
        library_id="your_zotero_library_id",
        semantic_scholar_api_key="your_semantic_scholar_api_key",
    )


def test_plot_config_save_load_yaml(plot_config):
    with NamedTemporaryFile() as tmp:
        # Save the configuration to a temporary file
        plot_config.to_yaml(tmp.name)

        # Load the configuration from the temporary file
        loaded_config = PlotConfig.from_yaml(tmp.name)

        # Assert that the loaded configuration is the same as the original
        assert plot_config == loaded_config

    # Assert that the configuration is loaded as an AppConfig instance
    assert isinstance(loaded_config, PlotConfig)

    # Example assertions - replace these with actual settings from your config
    assert loaded_config.edge_line == {"width": 0.5, "color": "#888"}
    assert loaded_config.node_marker == {
        "showscale": True,
        "colorscale": "YlGnBu",
        "color": [],
        "size": 10,
    }
    assert loaded_config.layout == {
        "showlegend": False,
        "hovermode": "closest",
        "margin": {"b": 0, "l": 0, "r": 0, "t": 0},
    }


def test_data_config_save_load_yaml(data_config):
    with NamedTemporaryFile() as tmp:
        # Save the configuration to a temporary file
        data_config.to_yaml(tmp.name)

        # Load the configuration from the temporary file
        loaded_config = DataConfig.from_yaml(tmp.name)

        # Assert that the loaded configuration is the same as the original
        assert data_config == loaded_config

    # Assert that the configuration is loaded as an AppConfig instance
    assert isinstance(loaded_config, DataConfig)

    assert loaded_config.data_path == "data/references.json"
    assert loaded_config.zotero_api_key == "your_zotero_api_key"
    assert loaded_config.library_id == "your_zotero_library_id"
    assert loaded_config.semantic_scholar_api_key == "your_semantic_scholar_api_key"
