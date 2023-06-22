from utils import count_progress
from work_package import get_all_wp
from version import get_all_versions
from user import get_all_memberships
from collections import Counter
import requests

header = {"Authorization": "Basic YXBpa2V5OmVlMjUzM2I0OTBjMmQ5M2M1ZDNkN2U2OGZlOGNkY2ViODAyMjc2ZTQxZjkyZTQxODU3MjBhM2M0OTgyMTM2ZjQ="}
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
            project_parent = element["_links"].get("parent", {}).get("title")

            if project_parent is None:
                project_parent = None

            all_projects.append({"project_id": project_id, 
                                 "project_name": project_name,
                                 "project_parent": project_parent, 
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

def project_list_by_status():
    all_projects = get_all_projects()
    project_list = {}
    for project in all_projects:
        project_name = project.get("project_name")
        status = project.get("project_status")

        if project_name is not None and status is not None:
            if status not in project_list:
                project_list[status] = []

            project_list[status].append(project_name)

    return project_list
    
def project_list_by_priority():
    all_projects = get_all_projects()
    project_list = {}
    for project in all_projects:
        project_name = project.get("project_name")
        priority = project.get("project_priority")

        if project_name is not None and priority is not None:
            if priority not in project_list:
                project_list[priority] = []

            project_list[priority].append(project_name)

    return project_list

def get_progress_project():
    all_wp = get_all_wp()
    return count_progress(all_wp, "project_name")

def get_project_members():
    memberships = get_all_memberships()
    project_details = {}

    for member in memberships:
        project_name = member.get("project_name") 
        if project_name not in project_details:
            project_details[project_name] = {"project_name": project_name, "members": []}
        
        project_details[project_name]["members"].append({
            "member_id": member["memberships_id"],
            "member_name": member["member_name"],
            "role": member["role"]
        })

    list_project_details = list(project_details.values())
    return list_project_details


def get_progress_assignee_project():
    assignee_progress = {}
    all_wp = get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        assignee = item.get("assignee")
        story_points = item.get("story_points")

        if project_name is not None and assignee is not None:
            if project_name not in assignee_progress:
                assignee_progress[project_name] = []

            assignee_data = None
            for data in assignee_progress[project_name]:
                if data["userName"] == assignee:
                    assignee_data = data
                    break

            if assignee_data is None:
                assignee_data = {
                    "userName": assignee,
                    "wp_total": 0,
                    "wp_done": 0,
                    "story_points": 0
                }
                assignee_progress[project_name].append(assignee_data)

            assignee_data["wp_total"] += 1

            if item.get("status") == "Done":
                assignee_data["wp_done"] += 1

            if story_points is not None:
                assignee_data["story_points"] += story_points

    result = []
    for project_name, progress in assignee_progress.items():
        for data in progress:
            data["progress"] = (data["wp_done"] / data["wp_total"]) * 100
        result.append({
            "project_name": project_name,
            "progress": progress
        })
    return result