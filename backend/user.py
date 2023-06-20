from work_package import get_all_wp
import requests

header = {"Authorization": "Basic YXBpa2V5OmVlMjUzM2I0OTBjMmQ5M2M1ZDNkN2U2OGZlOGNkY2ViODAyMjc2ZTQxZjkyZTQxODU3MjBhM2M0OTgyMTM2ZjQ="}
url = "https://nirmala.infoglobal.id/api/v3"
memberships = requests.get(f"{url}/memberships",headers=header)

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
    
def get_progress_assignee():
    assignee_progress = {}
    all_wp = get_all_wp()
    for item in all_wp:
        month = item.get("month")
        assignee = item.get("assignee")

        if month is not None and assignee is not None:
            if month not in assignee_progress:
                assignee_progress[month] = []

            assignee_data = None
            for data in assignee_progress[month]:
                if data["userName"] == assignee:
                    assignee_data = data
                    break

            if assignee_data is None:
                assignee_data = {
                    "userName": assignee,
                    "wpTotal": 0,
                    "wpDone": 0
                }
                assignee_progress[month].append(assignee_data)

            assignee_data["wpTotal"] += 1

            if item.get("status") == "Done":
                assignee_data["wpDone"] += 1

    result = []
    for month, progress in assignee_progress.items():
        result.append({
            "month": month,
            "progress": progress
        })
    return result
