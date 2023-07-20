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

import collections

async def get_progress_version(wp_types=None):
    project_versions = collections.defaultdict(lambda: collections.defaultdict(lambda: {"wp_total": 0, "wp_done": 0}))

    all_wp = await get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        version_name = item.get("at_version")
        wp_type = item.get("wp_type")

        if project_name is not None and version_name is not None:
            if wp_types is None or wp_type in wp_types:
                project_versions[project_name][version_name]["wp_total"] += 1

                if item.get("status") == "Done":
                    project_versions[project_name][version_name]["wp_done"] += 1

    result = []
    for project_name, versions in project_versions.items():
        project_total = {"wp_total": 0, "wp_done": 0}
        progress = []
        for version_name, data in versions.items():
            wp_total = data["wp_total"]
            wp_done = data["wp_done"]
            percentage_done = round((wp_done / wp_total) * 100)
            progress.append({
                "version_name": version_name,
                "wp_total": wp_total,
                "wp_done": wp_done,
                "percentage_done": percentage_done,
                "percentage_undone": 100 - percentage_done
            })
            project_total["wp_total"] += wp_total
            project_total["wp_done"] += wp_done

        project_percentage_done = round((project_total["wp_done"] / project_total["wp_total"]) * 100)
        project_progress = {
            "project_name": project_name,
            "percentage_done_project": project_percentage_done,
            "percentage_undone_project": 100 - project_percentage_done,
            "progress": progress
        }
        result.append(project_progress)

    return result

async def get_burndown_chart_project(wp_types=None):
    burndown_chart = {}
    all_wp = await get_all_wp()
    for item in all_wp:
        project_name = item.get("project_name")
        month = item.get("month")
        year = item.get("year")
        wp_type = item.get("wp_type")

        if month is not None and project_name is not None and year is not None:
            if wp_types is None or wp_type in wp_types:
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


async def get_burndown_chart_version(wp_types=None):
    burndown_chart = {}
    all_wp = await get_all_wp()
    
    for item in all_wp:
        project_name = item.get("project_name")
        version_name = item.get("at_version")
        date = item.get("date")
        wp_type = item.get("wp_type")

        if project_name is not None and version_name is not None and date is not None:
            if wp_types is None or wp_type in wp_types:
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

async def get_progress_assignee_version(wp_types=None):
    result = []
    data = await get_all_wp()
    for item in data:
        project_name = item['project_name']
        at_version = item['at_version']
        assignee = item['assignee']
        status = item['status']
        story_points = item['story_points']
        wp_type = item['wp_type']

        if at_version is not None and assignee is not None: 
            if wp_types is None or wp_type in wp_types:
                project_exists = False
                for project in result:
                    if project['project_name'] == project_name:
                        project_exists = True
                        version_exists = False
                        for version in project['versions']:
                            if version['version_name'] == at_version:
                                version_exists = True
                                member_exists = False
                                for member in version['progress']:
                                    if member['member_name'] == assignee:
                                        member_exists = True
                                        member['wp_total'] += 1
                                        if story_points is not None:
                                            member['story_points'] += story_points
                                        if status == 'Done':
                                            member['wp_done'] += 1
                                        break
                                if not member_exists:
                                    version['progress'].append({
                                        'member_name': assignee,
                                        'wp_total': 1,
                                        'wp_done': 1 if status == 'Done' else 0,
                                        'story_points': story_points,
                                        'progress': 0
                                    })
                                break
                        if not version_exists:
                            project['versions'].append({
                                'version_name': at_version,
                                'progress': [{
                                    'member_name': assignee,
                                    'wp_total': 1,
                                    'wp_done': 1 if status == 'Done' else 0,
                                    'story_points': story_points,
                                    'progress': 0
                                }]
                            })
                        break

                if not project_exists:
                    result.append({
                        'project_name': project_name,
                        'versions': [{
                            'version_name': at_version,
                            'progress': [{
                                'member_name': assignee,
                                'wp_total': 1,
                                'wp_done': 1 if status == 'Done' else 0,
                                'story_points': story_points,
                                'progress': 0
                            }]
                        }]
                    })

    for project in result:
        for version in project['versions']:
            for member in version['progress']:
                member['progress'] = (member['wp_done'] / member['wp_total']) * 100

    return result
