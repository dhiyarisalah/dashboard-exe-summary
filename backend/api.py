from fastapi import APIRouter
from project import get_all_projects, count_all, project_count_by_status, project_count_by_priority,get_progress_project, get_project_details
from work_package import get_all_wp, miles_by_project
from version import get_all_versions, get_progress_version
from user import get_all_memberships, get_progress_assignee

router = APIRouter()

@router.get("/")
def read_root():
    return {"dashboard infoglobal"}

# ----------------------- ALL ----------------------- 
@router.get("/get-all-projects")
def all_projects():
    return get_all_projects()

@router.get("/get-all-version")
def all_versions():
    return get_all_versions()

@router.get("/get-all-wp")
def all_wp():
    return get_all_wp()

@router.get("/get-all-memberships")
def all_memberships():
    return get_all_memberships()

# ----------------------- OVERVIEW PAGE ----------------------- 

# Pie Chart Overview
@router.get("/count-all")
def count_all_projects():
    return count_all()

@router.get("/project-count-by-status")
def count_by_status():
    return project_count_by_status()

@router.get("/project-count-by-priority")
def count_by_priority():
    return project_count_by_priority()

# Bar Chart Overview (- : harusnya child aja parent gausa)
@router.get("/get-progress-project")
def progress_projects():
    return get_progress_project()

# Milestone Overview 
@router.get("/get-miles-by-project")
def get_miles_by_project():
    return miles_by_project()

# User Progress Overview 
@router.get("/get-progress-assignee")
def progress_assignee():
    return get_progress_assignee()

# ----------------------- PROJECT DETAILS PAGE ----------------------- 

# Progress Bar 
@router.get("/get-progress-version")
def progress_version():
    return get_progress_version()

# Burndown Chart
# version progress tp dibagi perbulan untuk project X

# User Progress Project Details (kembangin fungsi ini tp gausa dicampur antara version dan member, 2 endpoint yg beda aja)
# buat per nama project ada member, role, progress
@router.get("/get-project-details")
def project_details():
    return get_project_details()


# ----------------------- USER DETAILS PAGE ----------------------- 

# Pie Chart Overview User
# dibuat tiap nama user, projectnya apa aja didalem projectnya ada info progress isinya brp wp & sp

# tabel project details
# dibuat tiap nama user, projectnya apa aja didalem projectnya ada info wp isinya nama wp, progress, sp

