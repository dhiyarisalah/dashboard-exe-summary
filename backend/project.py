from fastapi import HTTPException
from auth import header, url
import requests
from work_package import get_all_wp
from version import get_all_versions
from collections import Counter

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
    try: 
        projects = requests.get(f"{url}/projects",headers=header)
        projects.raise_for_status()
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

                if len(project_name) == 7:
                    all_projects.append({"project_id": project_id, 
                                        "project_name": project_name,
                                        "project_parent": project_parent, 
                                        "project_status": project_status, 
                                        "project_priority": project_priority})
            if all_projects:
                return all_projects
            else:
                raise HTTPException(status_code=404, detail="No projects found.")   
        else:
            raise HTTPException(status_code=404, detail="Invalid response format.")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    
    
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


def project_list():
    all_projects = get_all_projects()
    project_list = []
    for project in all_projects:
        project_name = project.get("project_name")
        project_list.append(project_name)

    return project_list

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
    progress_counts = {}
    for item in all_wp:
        value = item.get("project_name")
        status = item.get("status")
        story_points = item.get("story_points")
        type = item.get("wp_type")
        percentage_done = item.get("percentage_done")

        if value is not None:
            if value not in progress_counts:
                progress_counts[value] = {
                    "wp_total": 0,
                    "wp_done": 0,
                    "progress": 0,
                    "story_points": 0
                }

            progress_counts[value]["wp_total"] += 1

            if story_points is not None:
                progress_counts[value]["story_points"] += story_points

            if status == "Done":
                progress_counts[value]["wp_done"] += 1

            if type == "Initiative":
                progress_counts[value]["progress"] = percentage_done

    result = []
    for progress_name, counts in progress_counts.items():
        result.append({
            "project_name": progress_name,
            "progress": {
                "wp_total": counts["wp_total"],
                "wp_done": counts["wp_done"],
                "progress": counts["progress"],
                "story_points": counts["story_points"]
            }
        })
    return result


def get_progress_assignee_project():
    data = get_all_wp()
    result = []

    for item in data:
        project_name = item['project_name']
        at_version = item['at_version']
        assignee = item['assignee']
        status = item['status']
        story_points = item['story_points']

        if at_version is not None: 
            project_exists = False
            for project in result:
                if project['project_name'] == project_name:
                    project_exists = True
                    version_exists = False
                    for version in project['versions']:
                        if version['version_name'] == at_version:
                            version_exists = True
                            member_exists = False
                            for member in version['member_data']:
                                if member['member_name'] == assignee:
                                    member_exists = True
                                    member['wpTotal'] += 1
                                    if story_points is not None:
                                        member['storyPoints'] += story_points
                                    if status == 'Done':
                                        member['wpDone'] += 1
                                    break
                            if not member_exists:
                                version['member_data'].append({
                                    'member_name': assignee,
                                    'wpTotal': 1,
                                    'wpDone': 1 if status == 'Done' else 0,
                                    'storyPoints': story_points,
                                    'progress': 0
                                })
                            break
                    if not version_exists:
                        project['versions'].append({
                            'version_name': at_version,
                            'member_data': [{
                                'member_name': assignee,
                                'wpTotal': 1,
                                'wpDone': 1 if status == 'Done' else 0,
                                'storyPoints': story_points,
                                'progress': 0
                            }]
                        })
                    break

            if not project_exists:
                result.append({
                    'project_name': project_name,
                    'versions': [{
                        'version_name': at_version,
                        'member_data': [{
                            'member_name': assignee,
                            'wpTotal': 1,
                            'wpDone': 1 if status == 'Done' else 0,
                            'storyPoints': story_points,
                            'progress': 0
                        }]
                    }]
                })

    for project in result:
        for version in project['versions']:
            for member in version['member_data']:
                member['progress'] = (member['wpDone'] / member['wpTotal']) * 100

    return result
