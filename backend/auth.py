import yaml

def get_config():
    with open("config.yaml") as config_file:
        config = yaml.safe_load(config_file)
    return config

def get_url():
    config = get_config()
    return config["url"]

def get_header():
    config = get_config()
    return config["header"]


url = get_url()
header = get_header()


