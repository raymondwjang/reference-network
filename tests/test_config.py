from tempfile import NamedTemporaryFile

import pytest

from reference_network.config import DataConfig, PlotConfig


@pytest.fixture
def plot_config():
    pc = PlotConfig()
    pc.base_size = 10
    pc.scaling_factor = 2
    pc.interactive_graph_path = "figures/interactive_graph.html"
    pc.static_graph_path = "figures/reference_graph.gv"
    return pc


@pytest.fixture
def data_config():
    return DataConfig(
        data_path="data/references.json",
        zotero_api_key="your_zotero_api_key",
        library_id="your_zotero_library_id",
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
    assert loaded_config.base_size == 10
    assert loaded_config.scaling_factor == 2
    assert loaded_config.interactive_graph_path == "figures/interactive_graph.html"
    assert loaded_config.static_graph_path == "figures/reference_graph.gv"


def test_data_config_save_load_yaml(data_config):
    with NamedTemporaryFile() as tmp:
        # Save the configuration to a temporary file
        data_config.to_yaml(tmp.name)

        # Load the configuration from the temporary file
        loaded_config = DataConfig.from_yaml(tmp.name)

        # Assert that the loaded configuration is the same as the original
        assert data_config == loaded_config

    # Assert that the configuration is loaded as a DataConfig instance
    assert isinstance(loaded_config, DataConfig)

    assert loaded_config.data_path == "data/references.json"
    assert loaded_config.zotero_api_key == "your_zotero_api_key"
    assert loaded_config.library_id == "your_zotero_library_id"
