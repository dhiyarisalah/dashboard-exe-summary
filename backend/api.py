from fastapi import APIRouter
from project import *
from work_package import *
from version import *
from user import *

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

# Burndown Chart All Project
@router.get("/get-burndown-chart-overview")
async def burndown_chart_overview():
    return await get_burndown_chart_overview()

# User Progress Overview 
# dibagi lagi per project dan per year
@router.get("/get-progress-assignee")
async def progress_assignee():
    return await get_progress_assignee()

# ----------------------- PROJECT DETAILS PAGE ----------------------- 

# Progress Bar 
@router.get("/get-progress-version")
async def progress_version():
    return await get_progress_version()

# Burndown Chart Project
@router.get("/get-burndown-chart-project")
async def burndown_chart_project():
    return await get_burndown_chart_project()

# Burndown Version
@router.get("/get-burndown-chart-version")
async def burndown_chart():
    return await get_burndown_chart_version()

# User Progress Project Details
@router.get("/get-project-members")
async def project_members():
    return await get_project_members()

@router.get("/get-progress-assignee-project")
async def progress_assignee_project():
    return await get_progress_assignee_project()

@router.get("/get-progress-assignee-version")
async def progress_assignee_version():
    return await get_progress_assignee_version()

# Milestone Project
# pake endpoint Milestone Overview 

# ----------------------- USER DETAILS PAGE ----------------------- 
# semuanya tambahin keterangan tgl biar bisa di filter

# Pie Chart Overview User
@router.get("/get-assignee-details")
async def assignee_details():
    return await get_assignee_details()

# tabel project details
@router.get("/get-assignee-wp-details")
async def assignee_wp_details():
    return await get_assignee_wp_details()