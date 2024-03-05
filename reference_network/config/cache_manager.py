import os

from diskcache import Cache


class CacheManager(Cache):
    def __init__(self):
        cache_dir = os.getenv("MY_PROJECT_CACHE_DIR", "./data")

        super().__init__(cache_dir)


CACHE_MANAGER = CacheManager()
