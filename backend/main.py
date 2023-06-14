from fastapi import FastAPI
import requests
from collections import Counter

app = FastAPI()
header = {"Authorization": "Basic YXBpa2V5OmVlMjUzM2I0OTBjMmQ5M2M1ZDNkN2U2OGZlOGNkY2ViODAyMjc2ZTQxZjkyZTQxODU3MjBhM2M0OTgyMTM2ZjQ="}
params = {'filters': '[{"status": { "operator": "=", "values": ["17"] }}]'}
url = "https://nirmala.infoglobal.id/api/v3"
projects = requests.get(f"{url}/projects",headers=header)
work_packages = requests.get(f"{url}/work_packages",headers=header)
done_work_packages = requests.get(f'{url}/work_packages', params=params, headers=header)
versions = requests.get(f"{url}/versions",headers=header)
memberships = requests.get(f"{url}/memberships",headers=header)

@app.get("/")
def read_root():
    return {"dashboard infoglobal"}

@app.get("/count-all")
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

@app.get("/get-all-projects")
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

def process_element(element):
    wp_id = element["id"]
    wp_name = element["subject"]
    project_name = element["_links"]["project"]["title"]
    status = element["_links"]["status"]["title"]
    wp_type = element["_links"]["type"]["title"]
    assignee = element["_links"].get("assignee", {}).get("title")
    at_version = element["_links"].get("version", {}).get("title")
    percentage_done = element["percentageDone"]
    story_points = element.get('storyPoints', 0)

    if assignee is None:
        assignee = None

    if assignee is None:
        assignee = None

    if story_points is None:
        story_points = None

    is_milestone = wp_type == "Milestone"
    if is_milestone:
        date = element["date"]
    else:
        date = element["startDate"]

    return {
        "wp_id": wp_id,
        "wp_name": wp_name,
        "project_name": project_name,
        "status": status,
        "wp_type": wp_type,
        "date": date,
        "assignee": assignee,
        "percentage_done": percentage_done,
        "story_points": story_points,
        "at_version": at_version
    }

def get_wp():
    wp = []
    data = work_packages.json()
    if "_embedded" in data and "elements" in data["_embedded"]:
        elements = data["_embedded"]["elements"]
        wp = [process_element(element) for element in elements]
    return wp


def get_done_wp():
    done_wp = []
    data = done_work_packages.json()
    if "_embedded" in data and "elements" in data["_embedded"]:
        elements = data["_embedded"]["elements"]
        done_wp = [process_element(element) for element in elements]
    return done_wp


@app.get("/get-all-wp")
def get_all_wp():
    wp = get_wp()
    done_wp = get_done_wp()
    all_wp = wp + done_wp
    if all_wp:
        return all_wp
    else:
        return {"message": "No work packages found."}
    
    
@app.get("/get-all-versions")
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
    
@app.get("/get-all-memberships")
def get_all_memberships():
    all_memberships = []
    data = memberships.json()
    if "_embedded" in data and "elements" in data["_embedded"]:
        elements = data["_embedded"]["elements"]
        for element in elements:
            memberships_id = element["id"]
            member_name = element["_links"]["self"]["title"]
            project_name = element["_links"]["project"]["title"]
            role = element["_links"]["roles"][0]["title"]
            all_memberships.append({"memberships_id": memberships_id, 
                                     "member_name": member_name, 
                                     "project_name": project_name,
                                     "role": role}) 
    if all_memberships:
        return all_memberships
    else:
        return {"message": "No memberships found."}

@app.get("/project-count-by-status")
def project_count_by_status():
    all_projects = get_all_projects()
    status_list = [project.get("project_status") for project in all_projects if project.get("project_status")]
    status_counts = dict(Counter(status_list))
    return status_counts

@app.get("/project-count-by-priority")
def project_count_by_priority():
    all_projects = get_all_projects()
    priority_list = [project.get("project_priority") for project in all_projects if project.get("project_priority")]
    priority_counts = dict(Counter(priority_list))
    return priority_counts


def count_progress(items, key):
    progress_counts = {}
    for item in items:
        value = item.get(key)
        status = item.get("status")
        story_points = item.get("story_points")

        if value is not None:
            if value not in progress_counts:
                progress_counts[value] = {
                    "wp_total": 0,
                    "wp_done": 0,
                    "story_points": 0
                }

            progress_counts[value]["wp_total"] += 1
            progress_counts[value]["story_points"] += story_points

            if status == "Done":
                progress_counts[value]["wp_done"] += 1

    result = []
    for progress_name, counts in progress_counts.items():
        result.append({
            key: progress_name,
            "progress": {
                "wp_total": counts["wp_total"],
                "wp_done": counts["wp_done"]
            }
        })
    return result

@app.get("/get-progress-project")
def get_progress_project():
    all_wp = get_all_wp()
    return count_progress(all_wp, "project_name")


@app.get("/get-progress-version")
def get_progress_version():
    all_wp = get_all_wp()
    return count_progress(all_wp, "at_version")

@app.get("/get-progress-assignee")
def get_progress_assignee():
    all_wp = get_all_wp()
    return count_progress(all_wp, "assignee")

@app.get("/get-project-details")
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

@app.get("/get-miles-by-project")
def miles_by_project():
    all_wp = get_all_wp()
    milestones = {}
    for item in all_wp:
        project_name = item.get("project_name")
        wp_type = item.get("wp_type")
        wp_name = item.get("wp_name")
        date = item.get("date")

        if wp_type == "Milestone":
            if project_name not in milestones:
                milestones[project_name] = {
                    "projectName": project_name,
                    "milestones": []
                }
            milestones[project_name]["milestones"].append({
                "wpName": wp_name,
                "date": date
            })

    milestones_list = list(milestones.values())
    return milestones_list

# @app.get("/get-user-details")