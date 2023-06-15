from datetime import datetime
import requests

header = {"Authorization": "Basic YXBpa2V5OmVlMjUzM2I0OTBjMmQ5M2M1ZDNkN2U2OGZlOGNkY2ViODAyMjc2ZTQxZjkyZTQxODU3MjBhM2M0OTgyMTM2ZjQ="}
params = {'filters': '[{"status": { "operator": "=", "values": ["17"] }}]'}
url = "https://nirmala.infoglobal.id/api/v3"
work_packages = requests.get(f"{url}/work_packages",headers=header)
done_work_packages = requests.get(f'{url}/work_packages', params=params, headers=header)

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

    date_field = "date" if wp_type == "Milestone" else "startDate"
    date = element.get(date_field)
    if date is not None:
        date_object = datetime.strptime(date, "%Y-%m-%d")
        month = date_object.strftime("%m")
    else:
        month = None

    return {
        "wp_id": wp_id,
        "wp_name": wp_name,
        "project_name": project_name,
        "status": status,
        "wp_type": wp_type,
        "month": month,
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


def get_all_wp():
    wp = get_wp()
    done_wp = get_done_wp()
    all_wp = wp + done_wp
    if all_wp:
        return all_wp
    else:
        return {"message": "No work packages found."}
    
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