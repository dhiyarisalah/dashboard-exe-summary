
from fastapi import HTTPException
from auth import header, url
import requests
from datetime import datetime
import calendar

def process_element(element):
    project_name = element["_links"]["project"]["title"]
    wp_id = element["id"]
    wp_name = element["subject"]
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
        year = date_object.strftime("%Y")
        month = calendar.month_name[int(month)]
    else:
        month = None
        year = None

    return {
        "wp_id": wp_id,
        "wp_name": wp_name,
        "project_name": project_name,
        "status": status,
        "wp_type": wp_type,
        "month": month,
        "year": year,
        "date": date,
        "assignee": assignee,
        "percentage_done": percentage_done,
        "story_points": story_points,
        "at_version": at_version,
    }

import requests
from fastapi import HTTPException

def get_wp():
    try:
        work_packages = requests.get(f"{url}/work_packages", headers=header)
        work_packages.raise_for_status() 
        data = work_packages.json()

        wp = []
        if "_embedded" in data and "elements" in data["_embedded"]:
            elements = data["_embedded"]["elements"]
            
            wp = [process_element(element) for element in elements if len(element["_links"]["project"]["title"]) == 7]

        return wp

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


def get_done_wp():
    try:
        params = {'filters': '[{"status": { "operator": "=", "values": ["17"] }}]'}
        done_work_packages = requests.get(f'{url}/work_packages', params=params, headers=header)
        done_work_packages.raise_for_status()
        data = done_work_packages.json()

        done_wp = []
        if "_embedded" in data and "elements" in data["_embedded"]:
            elements = data["_embedded"]["elements"]
            
            done_wp = [process_element(element) for element in elements if len(element["_links"]["project"]["title"]) == 7]

        return done_wp

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


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
        month = item.get("month")
        year = item.get("year")

        if wp_type == "Milestone":
            if project_name not in milestones:
                milestones[project_name] = {
                    "projectName": project_name,
                    "milestones": []
                }
            milestones[project_name]["milestones"].append({
                "wpName": wp_name,
                "date": date,
                "month": month,
                "year": year
            })

    milestones_list = list(milestones.values())
    return milestones_list