LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {"format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"},
    },
    "filename": "logs/app.log",  # Log file path
    "filemode": "a",  # Append mode
    "handlers": {
        "default": {
            "level": "INFO",
            "formatter": "standard",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",  # Use standard output
        },
    },
    "loggers": {
        "": {"handlers": ["default"], "level": "INFO", "propagate": True}  # root logger
    },
}
