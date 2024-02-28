import pytest
from config import PlotlyConfig
from tempfile import NamedTemporaryFile


@pytest.fixture
def config():
    pc = PlotlyConfig()
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


def test_config_save_load_yaml(config):
    with NamedTemporaryFile() as tmp:
        # Save the configuration to a temporary file
        config.to_yaml(tmp.name)

        # Load the configuration from the temporary file
        loaded_config = PlotlyConfig.from_yaml(tmp.name)

        # Assert that the loaded configuration is the same as the original
        assert config == loaded_config

    # Assert that the configuration is loaded as an AppConfig instance
    assert isinstance(loaded_config, PlotlyConfig)

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
