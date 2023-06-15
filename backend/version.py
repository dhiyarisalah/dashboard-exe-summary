from utils import count_progress
from work_package import get_all_wp
import requests

header = {"Authorization": "Basic YXBpa2V5OmVlMjUzM2I0OTBjMmQ5M2M1ZDNkN2U2OGZlOGNkY2ViODAyMjc2ZTQxZjkyZTQxODU3MjBhM2M0OTgyMTM2ZjQ="}
params = {'filters': '[{"status": { "operator": "=", "values": ["17"] }}]'}
url = "https://nirmala.infoglobal.id/api/v3"
versions = requests.get(f"{url}/versions",headers=header)


def get_all_versions():
    all_versions = []
    data = versions.json()
    if "_embedded" in data and "elements" in data["_embedded"]:
        elements = data["_embedded"]["elements"]
        for element in elements:
            version_id = element["id"]
            version_name = element["name"]
            at_project = element["_links"]["definingProject"]["title"]
            all_versions.append({"version_id": version_id, 
                                 "version_name": version_name, 
                                 "at_project": at_project}) 
    if all_versions:
        return all_versions
    else:
        return {"message": "No versions found."}
    
def get_progress_version():
    all_wp = get_all_wp()
    return count_progress(all_wp, "at_version")