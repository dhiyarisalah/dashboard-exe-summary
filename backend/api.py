from fastapi import APIRouter
from project import *
from work_package import *
from version import *
from user import *
from typing import Optional

router = APIRouter()

@router.get("/")
async def read_root():
    return {"dashboard infoglobal"}

# ----------------------- ALL ----------------------- 
@router.get("/get-all-projects")
async def all_projects():
    return await get_all_projects()

@router.get("/get-all-version")
async def all_versions():
    return await get_all_versions()

@router.get("/get-all-wp")
async def all_wp():
    return await get_all_wp()

@router.get("/get-all-memberships")
async def all_memberships():
    return await get_all_memberships()

@router.get("/get-project-list")
async def list_projects():
    return await project_list()

# ----------------------- OVERVIEW PAGE ----------------------- 

# Pie Chart Overview
@router.get("/count-all")
async def count_all_projects():
    return await count_all()

@router.get("/project-count-by-status")
async def count_by_status():
    return await project_count_by_status()

@router.get("/project-count-by-priority")
async def count_by_priority():
    return await project_count_by_priority()

@router.get("/project-list-by-status")
async def list_by_status():
    return await project_list_by_status()

@router.get("/project-list-by-priority")
async def list_by_priority():
    return await project_list_by_priority()

# Bar Chart Overview 
@router.get("/get-progress-project")
async def progress_projects():
    return await get_progress_project()

# Milestone Overview 
@router.get("/get-miles-by-project")
async def get_miles_by_project():
    return await miles_by_project()

# Phase Overview
@router.get("/get-phase-by-project")
async def get_phase_by_project():
    return await phase_by_project()

# Burndown Chart All Project
@router.get("/get-burndown-chart-overview")
async def burndown_chart_overview():
    return await get_burndown_chart_overview()

# User Progress Overview
@router.get("/get-progress-assignee-total")
async def progress_assignee_total():
    return await get_progress_assignee_total()
 
@router.get("/get-progress-assignee")
async def progress_assignee():
    return await get_progress_assignee()

# ----------------------- PROJECT DETAILS PAGE ----------------------- 

# Progress Bar 
@router.get("/get-progress-version")
async def progress_version(wp_types: Optional[str] = None):
    return await get_progress_version(wp_types)

# Burndown Chart Project
@router.get("/get-burndown-chart-project")
async def burndown_chart_project(wp_types: Optional[str] = None):
    return await get_burndown_chart_project(wp_types)

# Burndown Version
@router.get("/get-burndown-chart-version")
async def burndown_chart(wp_types: Optional[str] = None):
    return await get_burndown_chart_version(wp_types)

# User Progress Project Details
@router.get("/get-project-members")
async def project_members():
    return await get_project_members()

@router.get("/get-progress-assignee-project")
async def progress_assignee_project(wp_types: Optional[str] = None):
    return await get_progress_assignee_project(wp_types)

@router.get("/get-progress-assignee-version")
async def progress_assignee_version(wp_types: Optional[str] = None):
    return await get_progress_assignee_version(wp_types)

# Milestone Project
# pake endpoint Milestone Overview 

# ----------------------- USER DETAILS PAGE ----------------------- 

# Pie Chart Overview User
@router.get("/get-assignee-details")
async def assignee_details(start_date: Optional[str] = None, end_date: Optional[str] = None):
    return await get_assignee_details(start_date, end_date)

# tabel project details
@router.get("/get-assignee-wp-details")
async def assignee_wp_details(start_date: Optional[str] = None, end_date: Optional[str] = None):
    return await get_assignee_wp_details(start_date, end_date)