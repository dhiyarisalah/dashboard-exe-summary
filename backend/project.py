from utils import count_progress
from work_package import get_all_wp
from version import get_all_versions
from user import get_all_memberships
from collections import Counter
import requests

header = {"Authorization": "Basic YXBpa2V5OmVlMjUzM2I0OTBjMmQ5M2M1ZDNkN2U2OGZlOGNkY2ViODAyMjc2ZTQxZjkyZTQxODU3MjBhM2M0OTgyMTM2ZjQ="}
params = {'filters': '[{"status": { "operator": "=", "values": ["17"] }}]'}
url = "https://nirmala.infoglobal.id/api/v3"
projects = requests.get(f"{url}/projects",headers=header)

def count_all():
    all_projects = get_all_projects()
    all_wp = get_all_wp()
    all_versions = get_all_versions()
    total_project = 0
    total_wp = 0
    total_version = 0
    for project in all_projects:
        total_project += 1
    for wp in all_wp:
        total_wp += 1
    for version in all_versions:
        total_version += 1
    return {"total_project": total_project, 
            "total_wp": total_wp, 
            "total_version": total_version}

def get_all_projects():
    all_projects = []
    data = projects.json()
    if "_embedded" in data and "elements" in data["_embedded"]:
        elements = data["_embedded"]["elements"]
        for element in elements:
            project_id = element["id"]
            project_name = element["name"]
            project_status = element["_links"]["status"]["title"] # seluruh project harus di set status
            project_priority = element["_links"]["customField5"]["title"] # seluruh project harus di set priority
            all_projects.append({"project_id": project_id, 
                                 "project_name": project_name, 
                                 "project_status": project_status, 
                                 "project_priority": project_priority})
    if all_projects:
        return all_projects
    else:
        return {"message": "No projects found."}
    
def project_count_by_status():
    all_projects = get_all_projects()
    status_list = [project.get("project_status") for project in all_projects if project.get("project_status")]
    status_counts = dict(Counter(status_list))
    return status_counts

def project_count_by_priority():
    all_projects = get_all_projects()
    priority_list = [project.get("project_priority") for project in all_projects if project.get("project_priority")]
    priority_counts = dict(Counter(priority_list))
    return priority_counts

def get_progress_project():
    all_wp = get_all_wp()
    return count_progress(all_wp, "project_name")

def get_project_details():
    versions = get_all_versions()
    memberships = get_all_memberships()
    project_details = {}

    for version in versions:
        project_name = version.get("at_project") 
        if project_name not in project_details:
            project_details[project_name] = {"project_name": project_name, "versions": []}

        project_details[project_name]["versions"].append({
            "version_id": version["version_id"],
            "version_name": version["version_name"]
        })

    for member in memberships:
        project_name = member.get("project_name") 
        if project_name not in project_details:
            project_details[project_name] = {"project_name": project_name, "versions": []}
        
        if "members" not in project_details[project_name]:
            project_details[project_name]["members"] = []

        project_details[project_name]["members"].append({
            "member_id": member["memberships_id"],
            "member_name": member["member_name"],
            "role": member["role"]
        })

    list_project_details = list(project_details.values())
    return list_project_details
