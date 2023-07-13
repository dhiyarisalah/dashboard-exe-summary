from fastapi import HTTPException
from auth import header, url
import httpx
from work_package import get_all_wp

async def get_all_versions():
    try:
        async with httpx.AsyncClient() as client:
            versions = await client.get(f"{url}/versions", headers=header)
            versions.raise_for_status() 
            data = versions.json()
        
            if "_embedded" in data and "elements" in data["_embedded"]:
                elements = data["_embedded"]["elements"]
                all_versions = []
            
                for element in elements:
                    version_id = element["id"]
                    version_name = element["name"]
                    at_project = element["_links"]["definingProject"]["title"]

                    if len(at_project) == 7: # filter jumlah karakter
                        all_versions.append({
                            "version_id": version_id,
                            "version_name": version_name,
                            "at_project": at_project
                        })

                if all_versions:
                    return all_versions
                else:
                    raise HTTPException(status_code=404, detail="No versions found.")
            else:
                raise HTTPException(status_code=404, detail="Invalid response format.")

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail="Failed to connect to the API.")
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Invalid JSON response from the API.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


async def get_progress_version():
    version_progress = {}
    all_wp = await get_all_wp()
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
            data["percentage_done"] = (data["wp_done"] / data["wp_total"]) * 100
            data["percentage_undone"] = 100 - data["percentage_done"]
        result.append({
            "project_name": project_name,
            "progress": progress
        })
    return result


async def get_burndown_chart_project():
    burndown_chart = {}
    all_wp = await get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        month = item.get("month")
        year = item.get("year")

        if month is not None and project_name is not None and year is not None:  
            if project_name not in burndown_chart:
                burndown_chart[project_name] = []

            year_data = None
            for data in burndown_chart[project_name]:
                if data["year"] == year:
                    year_data = data
                    break

            if year_data is None:
                year_data = {
                    "year": year,
                    "progress": []
                }
                burndown_chart[project_name].append(year_data)

            progress_data = None
            for data in year_data["progress"]:
                if data["month"] == month:
                    progress_data = data
                    break

            if progress_data is None:
                progress_data = {
                    "month": month,
                    "wp_done": 0,
                    "wp_on_going": 0
                }
                year_data["progress"].append(progress_data)

            if item.get("status") == "Done":
                progress_data["wp_done"] += 1
            else:
                progress_data["wp_on_going"] += 1


    result = []
    for project_name, years in burndown_chart.items():
        result.append({
            "project_name": project_name,
            "progress": years
        })
    return result

async def get_burndown_chart_version():
    burndown_chart = {}
    all_wp = await get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        version_name = item.get("at_version")
        date = item.get("date")

        if version_name is not None and project_name is not None and date is not None:  
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
                if data["date"] == date:
                    progress_data = data
                    break

            if progress_data is None:
                progress_data = {
                    "date": date,
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