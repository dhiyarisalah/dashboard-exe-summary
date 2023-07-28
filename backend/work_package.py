from auth import header, url
from datetime import datetime
import calendar
import httpx
from fastapi import HTTPException

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
        story_points = 0

    if wp_type == "Milestone":
        date = element.get("date")
        if date is not None:
            date = datetime.strptime(date, "%Y-%m-%d").date()
            day = date.strftime("%d")
            month = date.strftime("%m")
            year = date.strftime("%Y")
            month = calendar.month_name[int(month)]
    elif wp_type == "Phase":
        start_date = element.get("startDate")
        end_date = element.get("dueDate")
        date = element.get("updatedAt")

        if start_date is not None and end_date is not None:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

        if date is not None:
            date_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
            date = date_obj.date()
            day = date.strftime("%d")
            month = date_obj.strftime("%m")
            year = date_obj.strftime("%Y")
            month = calendar.month_name[int(month)]
    else:
        date = element.get("updatedAt")
        if date is not None:
            date_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%SZ")
            date = date_obj.date()
            day = date.strftime("%d")
            month = date_obj.strftime("%m")
            year = date_obj.strftime("%Y")
            month = calendar.month_name[int(month)]
     
        
    if wp_type == "Phase":
        result = {
        "wp_id": wp_id,
        "wp_name": wp_name,
        "project_name": project_name,
        "status": status,
        "wp_type": wp_type,
        "day": day,
        "date": date,
        "start_date": start_date,
        "end_date": end_date,
        "month": month,
        "year": year,
        "assignee": assignee,
        "percentage_done": percentage_done,
        "story_points": story_points,
        "at_version": at_version,
        }
    else:
        result = {
        "wp_id": wp_id,
        "wp_name": wp_name,
        "project_name": project_name,
        "status": status,
        "wp_type": wp_type,
        "date": date,
        "day": day,
        "month": month,
        "year": year,
        "assignee": assignee,
        "percentage_done": percentage_done,
        "story_points": story_points,
        "at_version": at_version,
        } 
    return result


async def get_all_wp():
    wp = await get_wp()
    done_wp = await get_done_wp()
    miles_wp = await get_miles_wp()
    all_wp = wp + done_wp + miles_wp
    if all_wp:
        all_wp = sorted(all_wp, key=lambda x: x["date"])
        return all_wp
    else:
        return {"message": "No work packages found."}


async def get_wp():
    try:
        async with httpx.AsyncClient() as client:
            work_packages = await client.get(f"{url}/work_packages", headers=header)
            work_packages.raise_for_status()
            data = work_packages.json()

            wp = []
            if "_embedded" in data and "elements" in data["_embedded"]:
                elements = data["_embedded"]["elements"]
                wp = [process_element(element) for element in elements if len(element["_links"]["project"]["title"]) == 7]

            return wp

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


async def get_done_wp():
    try:
        params = {'filters': '[{"status": { "operator": "=", "values": ["17"] }}]'}
        async with httpx.AsyncClient() as client:
            done_work_packages = await client.get(f'{url}/work_packages', params=params, headers=header)
            done_work_packages.raise_for_status()
            data = done_work_packages.json()

            done_wp = []
            if "_embedded" in data and "elements" in data["_embedded"]:
                elements = data["_embedded"]["elements"]
                done_wp = [process_element(element) for element in elements if len(element["_links"]["project"]["title"]) == 7]

            return done_wp

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    
async def get_miles_wp():
    try:
        params = {'filters': '[{"type": { "operator": "=", "values": ["2"] }}]'}
        async with httpx.AsyncClient() as client:
            done_work_packages = await client.get(f'{url}/work_packages', params=params, headers=header)
            done_work_packages.raise_for_status()
            data = done_work_packages.json()

            done_wp = []
            if "_embedded" in data and "elements" in data["_embedded"]:
                elements = data["_embedded"]["elements"]
                done_wp = [process_element(element) for element in elements if len(element["_links"]["project"]["title"]) == 7]

            return done_wp

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")



async def miles_by_project():
    all_wp = await get_all_wp()
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

async def phase_by_project():
    all_wp = await get_all_wp()
    phase = {}
    for item in all_wp:
        project_name = item.get("project_name")
        wp_type = item.get("wp_type")
        wp_name = item.get("wp_name")
        start_date = item.get("start_date")
        end_date = item.get("end_date")
        year = item.get("year")

        if wp_type == "Phase":
            if project_name not in phase:
                phase[project_name] = {
                    "projectName": project_name,
                    "phase": []
                }
            phase[project_name]["phase"].append({
                "phase": wp_name,
                "start_date": start_date,
                "end_date": end_date,
                "year": year
            })

    phase_list = list(phase.values())
    return phase_list


async def get_burndown_chart_overview():
    burndown_chart = {}
    all_wp = await get_all_wp()
    for item in all_wp:
        month = item.get("month")
        year = item.get("year")

        if month is not None and year is not None:  
            if year not in burndown_chart:
                burndown_chart[year] = []

            progress_data = None
            for data in burndown_chart[year]:
                if data["month"] == month:
                    progress_data = data
                    break

            if progress_data is None:
                progress_data = {
                    "month": month,
                    "wp_done": 0,
                    "wp_on_going": 0
                }
                burndown_chart[year].append(progress_data)

            if item.get("status") == "Done":
                progress_data["wp_done"] += 1
            else:
                progress_data["wp_on_going"] += 1


    result = []
    for year, progress in burndown_chart.items():
        result.append({
            "year": year,
            "progress": progress
        })
    return result
