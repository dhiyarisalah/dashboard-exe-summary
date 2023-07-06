from fastapi import APIRouter
from project import *
from work_package import *
from version import *
from user import *

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

@router.get("/get-project-list")
def list():
    return project_list()

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

@router.get("/project-list-by-status")
def list_by_status():
    return project_list_by_status()

@router.get("/project-list-by-priority")
def list_by_priority():
    return project_list_by_priority()

# Bar Chart Overview 
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
@router.get("/get-burndown-chart")
def burndown_chart():
    return get_burndown_chart()

# User Progress Project Details
@router.get("/get-project-members")
def project_members():
    return get_project_members()

@router.get("/get-progress-assignee-project")
def progress_assignee_project():
    return get_progress_assignee_project()


# ----------------------- USER DETAILS PAGE ----------------------- 

# Pie Chart Overview User
@router.get("/get-assignee-details")
def assignee_details():
    return get_assignee_details()

# tabel project details
@router.get("/get-assignee-wp-details")
def assignee_wp_details():
    return get_assignee_wp_details()