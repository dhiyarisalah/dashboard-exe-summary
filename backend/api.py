from fastapi import APIRouter
from project import get_all_projects, count_all, project_count_by_status, project_count_by_priority,get_progress_project, get_project_details
from work_package import get_all_wp, miles_by_project
from version import get_all_versions, get_progress_version
from user import get_all_memberships, get_progress_assignee

router = APIRouter()


@router.get("/")
def read_root():
    return {"dashboard infoglobal"}


@router.get("/count-all")
def count_all_projects():
    return count_all()


@router.get("/get-all-projects")
def get_projects():
    return get_all_projects()


@router.get("/get-all-wp")
def get_work_packages():
    return get_all_wp()


@router.get("/get-all-versions")
def get_versions():
    return get_all_versions()


@router.get("/get-all-memberships")
def get_memberships():
    return get_all_memberships()


@router.get("/project-count-by-status")
def count_by_status():
    return project_count_by_status()


@router.get("/project-count-by-priority")
def count_by_priority():
    return project_count_by_priority()


@router.get("/get-progress-project")
def progress_projects():
    return get_progress_project()


@router.get("/get-progress-version")
def progress_version():
    return get_progress_version()


@router.get("/get-progress-assignee")
def progress_assignee():
    return get_progress_assignee()


@router.get("/get-project-details")
def project_details():
    return get_project_details()


@router.get("/get-miles-by-project")
def get_miles_by_project():
    return miles_by_project()

