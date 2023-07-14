from fastapi import HTTPException
from auth import header, url
import httpx
import requests
from work_package import get_all_wp
import datetime

async def get_all_memberships():
    try:
        async with httpx.AsyncClient() as client:
            memberships = requests.get(f"{url}/memberships", headers=header)
            memberships.raise_for_status()  
            data = memberships.json()

            all_memberships = []
            if "_embedded" in data and "elements" in data["_embedded"]:
                elements = data["_embedded"]["elements"]
                
                for element in elements:
                    memberships_id = element["id"]
                    member_name = element["_links"]["self"]["title"]
                    project_name = element["_links"]["project"]["title"]
                    role = element["_links"]["roles"][0]["title"]
                    
                    all_memberships.append({
                        "memberships_id": memberships_id,
                        "member_name": member_name,
                        "project_name": project_name,
                        "role": role
                    })

                if all_memberships:
                    return all_memberships
                else:
                    raise HTTPException(status_code=404, detail="No memberships found.")
            else:
                raise HTTPException(status_code=404, detail="Invalid response format.")

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

    
async def get_project_members():
    memberships = await get_all_memberships()
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


async def get_progress_assignee():
    assignee_progress = {}
    all_wp = await get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        assignee = item.get("assignee")
        year = item.get("year")
        month = item.get("month")

        if project_name is not None and assignee is not None and year is not None and month is not None:
            key = (year, month, assignee, project_name)
            if key not in assignee_progress:
                assignee_progress[key] = {
                    "wp_total": 0,
                    "wp_done": 0
                }

            assignee_data = assignee_progress[key]
            assignee_data["wp_total"] += 1

            if item.get("status") == "Done":
                assignee_data["wp_done"] += 1

    result = {}
    for key, progress in sorted(assignee_progress.items()):
        year, month, assignee, project_name = key
        if year not in result:
            result[year] = {}
        if month not in result[year]:
            result[year][month] = {}
        if assignee not in result[year][month]:
            result[year][month][assignee] = {}
        if project_name not in result[year][month][assignee]:
            result[year][month][assignee][project_name] = {}

        result[year][month][assignee][project_name] = progress

    return result


async def get_assignee_details(start_date=None, end_date=None):
    assignee_details = {}
    all_wp = await get_all_wp()
    total_wp = 0
    total_sp = 0

    if start_date is not None:
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
    if end_date is not None:
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()

    for item in all_wp:
        user_name = item.get("assignee")
        project_name = item.get("project_name")
        story_points = item.get("story_points")
        date = item.get("date")

        if user_name is not None and date is not None:
            wp_date = date

            if (start_date is None or wp_date >= start_date) and (end_date is None or wp_date <= end_date):
                if user_name not in assignee_details:
                    assignee_details[user_name] = {
                        "total_wp": 0,
                        "total_sp": 0,
                        "projects": []
                    }

                assignee_details[user_name]["total_wp"] += 1
                total_wp += 1

                if story_points is not None:
                    assignee_details[user_name]["total_sp"] += story_points
                    total_sp += story_points

                project_exists = any(
                    project["project_name"] == project_name for project in assignee_details[user_name]["projects"]
                )
                if not project_exists:
                    assignee_details[user_name]["projects"].append(
                        {
                            "project_name": project_name,
                            "wp_assigned": 1,
                            "story_points": story_points if story_points is not None else 0
                        }
                    )
                else:
                    for project in assignee_details[user_name]["projects"]:
                        if project["project_name"] == project_name:
                            project["wp_assigned"] += 1
                            if story_points is not None:
                                project["story_points"] += story_points
                            break

    result = []
    for user_name, details in assignee_details.items():
        result.append(
            {
                "user_name": user_name,
                "total_wp": details["total_wp"],
                "total_sp": details["total_sp"],
                "projects": details["projects"]
            }
        )
    return result



async def get_assignee_wp_details(start_date=None, end_date=None):
    wp_details = {}
    all_wp = await get_all_wp()

    if start_date is not None:
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
    if end_date is not None:
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()

    for item in all_wp:
        user_name = item.get("assignee")
        project_name = item.get("project_name")
        wp_name = item.get("wp_name")
        progress = item.get("percentage_done")
        story_points = item.get("story_points")
        date = item.get("date")

        if user_name is not None and project_name is not None and date is not None:
            wp_date = date

            if (start_date is None or wp_date >= start_date) and (end_date is None or wp_date <= end_date):
                if user_name not in wp_details:
                    wp_details[user_name] = []

                project_data = None
                for data in wp_details[user_name]:
                    if data["project_name"] == project_name:
                        project_data = data
                        break

                if project_data is None:
                    project_data = {
                        "project_name": project_name,
                        "wp_assigned": []
                    }
                    wp_details[user_name].append(project_data)
                
                wp_assigned_data = {
                    "wp_name": wp_name,
                    "date": date,
                    "progress": progress,
                    "story_points": story_points
                }
                project_data["wp_assigned"].append(wp_assigned_data)

    result = []
    for user_name, projects in wp_details.items():
        result.append({
            "user_name": user_name,
            "projects": projects
        })
    return result


