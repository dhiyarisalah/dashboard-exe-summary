from utils import count_progress
from work_package import get_all_wp
import requests

header = {"Authorization": "Basic YXBpa2V5OmVlMjUzM2I0OTBjMmQ5M2M1ZDNkN2U2OGZlOGNkY2ViODAyMjc2ZTQxZjkyZTQxODU3MjBhM2M0OTgyMTM2ZjQ="}
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
    version_progress = {}
    all_wp = get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        version_name = item.get("at_version")

        if project_name is not None and version_name is not None:
            if project_name not in version_progress:
                version_progress[project_name] = []

            version_data = None
            for data in version_progress[project_name] :
                if data["version_name"] == version_name:
                    version_data = data
                    break

            if version_data is None:
                version_data = {
                    "version_name": version_name,
                    "wp_total": 0,
                    "wp_done": 0
                }
                version_progress[project_name].append(version_data)

            version_data["wp_total"] += 1

            if item.get("status") == "Done":
                version_data["wp_done"] += 1

    result = []
    for project_name, progress in version_progress.items():
        for data in progress:
            data["progress"] = (data["wp_done"] / data["wp_total"]) * 100
        result.append({
            "project_name": project_name,
            "progress": progress
        })
    return result


def get_burndown_chart():
    burndown_chart = {}
    all_wp = get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        version_name = item.get("at_version")
        month = item.get("month")

        if version_name is not None and project_name is not None:  
            if project_name not in burndown_chart:
                burndown_chart[project_name] = []

            version_data = None
            for data in burndown_chart[project_name]:
                if data["version_name"] == version_name:
                    version_data = data
                    break

            if version_data is None:
                version_data = {
                    "version_name": version_name,
                    "progress": []
                }
                burndown_chart[project_name].append(version_data)

            progress_data = None
            for data in version_data["progress"]:
                if data["month"] == month:
                    progress_data = data
                    break

            if progress_data is None:
                progress_data = {
                    "month": month,
                    "wp_done": 0,
                    "wp_on_going": 0
                }
                version_data["progress"].append(progress_data)

            if item.get("status") == "Done":
                progress_data["wp_done"] += 1
            else:
                progress_data["wp_on_going"] += 1


    result = []
    for project_name, versions in burndown_chart.items():
        result.append({
            "project_name": project_name,
            "versions": versions
        })
    return result

