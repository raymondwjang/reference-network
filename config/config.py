import yaml
from pydantic import BaseModel, Field


class PlotlyConfig(BaseModel):
    edge_line: dict = Field(default_factory=lambda: {"width": 0.5, "color": "#888"})
    node_marker: dict = Field(
        default_factory=lambda: {
            "showscale": True,
            "colorscale": "YlGnBu",
            "color": [],
            "size": 10,
        }
    )
    layout: dict = Field(
        default_factory=lambda: {
            "showlegend": False,
            "hovermode": "closest",
            "margin": {"b": 0, "l": 0, "r": 0, "t": 0},
        }
    )

    @classmethod
    def from_yaml(cls, file_path: str):
        with open(file_path, "r") as file:
            config = yaml.safe_load(file)
        return cls(**config)

    def to_yaml(self, file_path: str):
        with open(file_path, "w") as file:
            yaml.dump(self.model_dump(), file)


CONFIG = PlotlyConfig.from_yaml("config/config.yaml")
