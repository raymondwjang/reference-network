import logging.config

from reference_network.config import LOGGING_CONFIG


def main():
    logging.config.dictConfig(LOGGING_CONFIG)
    logger = logging.getLogger(__name__)
    logger.info("Application started")


if __name__ == "__main__":
    main()
