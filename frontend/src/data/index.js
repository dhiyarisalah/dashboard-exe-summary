/*PROJECT CHART */

export const projectStatus = [
  {
    "On track": 2,
    "Discontinued": 1,
    "At risk": 1
  }

];

export const projectPriority = [
    {
      "NORMAL": 3,
      "LOW": 1
    }
]

export const projectListStatus = [
  {
    "On track": [
      "DEXS23D",
      "SOFTWARE-INTERN"
    ],
    "Discontinued": [
      "tes"
    ],
    "At risk": [
      "Sandbox"
    ]
  }
  
]

export const projectListPriority = [
  {
    "NORMAL": [
      "DEXS23D",
      "tes",
      "SOFTWARE-INTERN"
    ],
    "LOW": [
      "Sandbox"
    ]
  }
  
]

export const totalCount = [
  {
    "total_project": 4,
    "total_wp": 36,
    "total_version": 6
  }
]

/* BAR CHART PROGRESS */


export const projectProgress = [
  {
    "project_name": "Sandbox",
    "wp_types": [
      "Epic",
      "User story",
      "Feature",
      "Milestone",
      "Task",
      "Bug",
      "Initiative",
      "Phase"
    ],
    "progress": {
      "wp_total": 21,
      "wp_done": 2,
      "progress_by_initiative": 0,
      "progress_by_wp": 10,
      "story_points": 343
    }
  },
  {
    "project_name": "DEXS23D",
    "wp_types": [
      "Epic",
      "User story",
      "Feature",
      "Milestone",
      "Task",
      "Bug",
      "Initiative",
      "Phase"
    ],
    "progress": {
      "wp_total": 45,
      "wp_done": 33,
      "progress_by_initiative": 73,
      "progress_by_wp": 73,
      "story_points": 0
    }
  }
]
  

/* BURNDOWN ALL */
export const burndownAll = [
  {
    "year": 2023,
    "progress" :[
      {
        "month": "March",
        "wp_done": 0,
        "wp_on_going": 2
      },
      {
        "month": "April",
        "wp_done": 10,
        "wp_on_going": 50
      },
    ]
  } 
]

/* Milestone Chart */
export const phaseTimeline = [
  {
  "projectName": "Sandbox",
  "phase": [
    {
      "phase": "initiating",
      "start_date": "2023-07-03",
      "end_date": "2023-07-25",
      "year": "2023"
    },
    {
      "phase": "planning",
      "start_date": "2023-09-04",
      "end_date": "2023-10-31",
      "year": "2023"
    },
    {
      "phase": "executing",
      "start_date": "2023-11-01",
      "end_date": "2023-12-29",
      "year": "2023"
    },
    {
      "phase": "monitoring",
      "start_date": "2024-01-01",
      "end_date": "2024-02-29",
      "year": "2023"
    }]
  },
    {
  "projectName": "11",
  "phase": [
    {
      "phase": "initiating",
      "start_date": "2023-07-03",
      "end_date": "2023-07-25",
      "year": "2023"
    },
    {
      "phase": "planning",
      "start_date": "2023-09-04",
      "end_date": "2023-10-31",
      "year": "2023"
    },
    {
      "phase": "executing",
      "start_date": "2023-11-01",
      "end_date": "2023-12-29",
      "year": "2023"
    },
    {
      "phase": "monitoring",
      "start_date": "2024-01-01",
      "end_date": "2024-02-29",
      "year": "2023"
    }]
  },
  {
  "projectName": "cc",
  "phase": [
    {
      "phase": "initiating",
      "start_date": "2023-01-02",
      "end_date": "2023-07-25",
      "year": "2023"
    },
    {
      "phase": "planning",
      "start_date": "2023-09-04",
      "end_date": "2023-10-31",
      "year": "2023"
    },
    {
      "phase": "executing",
      "start_date": "2023-11-01",
      "end_date": "2023-12-29",
      "year": "2023"
    },
    {
      "phase": "monitoring",
      "start_date": "2024-01-01",
      "end_date": "2024-02-29",
      "year": "2023"
    }]
  },
  {
  "projectName": "xx",
  "phase": [
    {
      "phase": "initiating",
      "start_date": "2023-07-03",
      "end_date": "2023-07-25",
      "year": "2023"
    },
    {
      "phase": "planning",
      "start_date": "2023-09-04",
      "end_date": "2023-10-31",
      "year": "2023"
    },
    {
      "phase": "executing",
      "start_date": "2023-11-01",
      "end_date": "2023-12-29",
      "year": "2023"
    },
    {
      "phase": "monitoring",
      "start_date": "2024-01-01",
      "end_date": "2024-02-29",
      "year": "2023"
    }]
  },
  {
    "projectName": "DRG",
    "phase": [
      {
        "phase": "initiating",
        "start_date": "2023-07-03",
        "end_date": "2023-08-25",
        "year": "2023"
      },
      {
        "phase": "planning",
        "start_date": "2023-09-04",
        "end_date": "2023-10-31",
        "year": "2023"
      },
      {
        "phase": "executing",
        "start_date": "2023-11-01",
        "end_date": "2023-12-29",
        "year": "2023"
      },
      {
        "phase": "monitoring",
        "start_date": "2024-01-01",
        "end_date": "2024-05-29",
        "year": "2023"
      }
    ]
  },
]


/* STACKED CHART USER PROGRESS*/

export const userProgress = [
  {
    "2023": {
      "April": {
        "Dhiya Risalah Ghaida": {
          "wp_total": 1,
          "wp_done": 0
        }
      },
      "August": {
        "Dhiya Risalah Ghaida": {
          "wp_total": 1,
          "wp_done": 0
        }
      },
      "July": {
        "Software-Intern ITB": {
          "wp_total": 24,
          "wp_done": 13
        }
      },
      "June": {
        "Dhiya Risalah Ghaida": {
          "wp_total": 7,
          "wp_done": 2
        },
        "Salsabila Asyifa": {
          "wp_total": 9,
          "wp_done": 3
        },
        "Software-Intern ITB": {
          "wp_total": 16,
          "wp_done": 16
        },
        "Salsabila d": {
          "wp_total": 9,
          "wp_done": 3
        },
        "Salsabila a": {
          "wp_total": 9,
          "wp_done": 3
        },
        "d Asyifa": {
          "wp_total": 9,
          "wp_done": 3
        },
        "d d": {
          "wp_total": 9,
          "wp_done": 3
        },
        "a a": {
          "wp_total": 9,
          "wp_done": 3
        },
        
      },
      "March": {
        "Anonymous Software": {
          "wp_total": 1,
          "wp_done": 1
        }
      }
    },
    "2024": {
      "November": {
        "Salsabila Asyifa": {
          "wp_total": 1,
          "wp_done": 0
        }
      }
    },
    "2027": {
      "July": {
        "Salsabila Asyifa": {
          "wp_total": 1,
          "wp_done": 0
        }
      }
    }
  }
]  

export const progressProject = [
  {
    "2023": {
      "April": {
        "Dhiya Risalah Ghaida": {
          "Sandbox": {
            "wp_total": 1,
            "wp_done": 0
          }
        }
      },
      "August": {
        "Dhiya Risalah Ghaida": {
          "Sandbox": {
            "wp_total": 1,
            "wp_done": 0
          }
        }
      },
      "July": {
        "Software-Intern ITB": {
          "DEXS23D": {
            "wp_total": 24,
            "wp_done": 13
          }
        }
      },
      "June": {
        "Dhiya Risalah Ghaida": {
          "DEXS23D": {
            "wp_total": 2,
            "wp_done": 2
          },
          "Sandbox": {
            "wp_total": 5,
            "wp_done": 0
          }
        },
        "Salsabila Asyifa": {
          "DEXS23D": {
            "wp_total": 2,
            "wp_done": 2
          },
          "Sandbox": {
            "wp_total": 7,
            "wp_done": 1
          }
        },
        "Software-Intern ITB": {
          "DEXS23D": {
            "wp_total": 16,
            "wp_done": 16
          }
        }
      },
      "March": {
        "Anonymous Software": {
          "Sandbox": {
            "wp_total": 1,
            "wp_done": 1
          }
        }
      }
    },
    "2024": {
      "November": {
        "Salsabila Asyifa": {
          "Sandbox": {
            "wp_total": 1,
            "wp_done": 0
          }
        }
      }
    },
    "2027": {
      "July": {
        "Salsabila Asyifa": {
          "Sandbox": {
            "wp_total": 1,
            "wp_done": 0
          }
        }
      }
    }
  }
]

/*PROJECT DETAILS PAGE*/
/*PROGRESS BAR */
export const projectDetails = [
  {
    "project_name": "DEXS23D",
    "progress": [
      {
        "version_name": "Week VI",
        "wp_total": 5,
        "wp_done": 4,
        "percentage_done": 80,
        "percentage_undone": 20
      },
      {
        "version_name": "Week VII",
        "wp_total": 5,
        "wp_done": 0,
        "percentage_done": 0,
        "percentage_undone": 100
      },
      {
        "version_name": "Week VIII",
        "wp_total": 5,
        "wp_done": 0,
        "percentage_done": 0,
        "percentage_undone": 100
      },   
      {
        "version_name": "Week V",
        "wp_total": 5,
        "wp_done": 5,
        "percentage_done": 100,
        "percentage_undone": 0
      }
    ]
  }
]
  

/*BURNDOWN CHART */
export const burndownData = [
  {
    "project_name": "Sandbox",
    "versions": [
      {
        "version_name": "Sprint Sandbox",
        "progress": [
          {
            "month": "March",
            "wp_done": 0,
            "wp_on_going": 2
          },
          {
            "month": "May",
            "wp_done": 1,
            "wp_on_going": 4
          },
          {
            "month": "July",
            "wp_done": 0,
            "wp_on_going": 1
          },
          {
            "month": "August",
            "wp_done": 0,
            "wp_on_going": 2
          }
        ]
      }
    ]
  },
  {
    "project_name": "DEXS23D",
    "versions": [
      {
        "version_name": "Week 3",
        "progress": [
          {
            "month": "January",
            "wp_done": 3,
            "wp_on_going": 2
          }
        ]
      },
      {
        "version_name": "Week 1",
        "progress": [
          {
            "month": "February",
            "wp_done": 5,
            "wp_on_going": 0
          }
        ]
      },
      {
        "version_name": "Week 2",
        "progress": [
          {
            "month": "March",
            "wp_done": 5,
            "wp_on_going": 0
          }
        ]
      }
    ]
  }
]

/*PROGRESS ASSIGNEE */

export const assigneeProject = [
  {
    "project_name": "Sandbox",
    "versions": [
      {
        "version_name": "Sprint Sandbox",
        "member_data": [
          {
            "member_name": "Salsabila Asyifa",
            "wpTotal": 4,
            "wpDone": 0,
            "storyPoints": 40,
            "progress": 0
          },
          {
            "member_name": "Dhiya Risalah Ghaida",
            "wpTotal": 5,
            "wpDone": 0,
            "storyPoints": 303,
            "progress": 0
          },
          {
            "member_name": "Anonymous Software",
            "wpTotal": 1,
            "wpDone": 1,
            "storyPoints": 0,
            "progress": 100
          }
        ]
      }
    ]
  },
  {
    "project_name": "DEXS23D",
    "versions": [
      {
        "version_name": "Week 1",
        "member_data": [
          {
            "member_name": "Software-Intern ITB",
            "wpTotal": 5,
            "wpDone": 5,
            "storyPoints": 0,
            "progress": 100
          }
        ]
      },
      {
        "version_name": "Week 2",
        "member_data": [
          {
            "member_name": "Software-Intern ITB",
            "wpTotal": 5,
            "wpDone": 5,
            "storyPoints": 10,
            "progress": 100
          }
        ]
      },
      {
        "version_name": "Week 3",
        "member_data": [
          {
            "member_name": "Software-Intern ITB",
            "wpTotal": 5,
            "wpDone": 5,
            "storyPoints": 30,
            "progress": 100
          }
        ]
      },
    ]
  }
]

/* USER DETAILS PAGE */

/*PIE CHART PROJECT PER USER */

export const userDetails = [
  {
    "user_name": "Salsabila Asyifa",
    "total_wp": 11,
    "total_sp": 40,
    "projects": [
      {
        "project_name": "Sandbox",
        "wp_assigned": 9,
        "story_points": 40
      },
      {
        "project_name": "DEXS23D",
        "wp_assigned": 2,
        "story_points": 0
      }
    ]
  },
  {
    "user_name": "Dhiya Risalah Ghaida",
    "total_wp": 7,
    "total_sp": 303,
    "projects": [
      {
        "project_name": "Sandbox",
        "wp_assigned": 7,
        "story_points": 303
      },
      {
        "project_name": "DEXS23D",
        "wp_assigned": 2,
        "story_points": 0
      }
    ]
  }
]
/* TABEL DETAIL WP*/

export const wpDetails = [
  {
    "user_name": "Salsabila Asyifa",
    "projects": [
      {
        "project_name": "Sandbox",
        "wp_assigned": [
          {
            "wp_name": "Epic 2",
            "progress": 16,
            "story_points": null
          },
          {
            "wp_name": "User story 1",
            "progress": 30,
            "story_points": 40
          },
          {
            "wp_name": "Task 1",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "Task 2",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "User story 2",
            "progress": 0,
            "story_points": null
          },
          {
            "wp_name": "Task 3",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "Bug 1",
            "progress": 0,
            "story_points": null
          },
          {
            "wp_name": "Task 9",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "Epic 1",
            "progress": 0,
            "story_points": null
          }
        ]
      },
      {
        "project_name": "DEXS23D",
        "wp_assigned": [
          {
            "wp_name": "Belajar mandiri #2",
            "progress": 100,
            "story_points": null
          },
          {
            "wp_name": "Requirement Specification #2",
            "progress": 100,
            "story_points": null
          }
        ]
      }
    ]
  },
  {
    "user_name": "Dhiya Risalah Ghaida",
    "projects": [
      {
        "project_name": "Sandbox",
        "wp_assigned": [
          {
            "wp_name": "Epic 21",
            "progress": 16,
            "story_points": null
          },
          {
            "wp_name": "User story 11",
            "progress": 30,
            "story_points": 40
          },
          {
            "wp_name": "Task 11",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "Task 21",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "User story 21",
            "progress": 0,
            "story_points": null
          },
          {
            "wp_name": "Task 31",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "Bug 11",
            "progress": 0,
            "story_points": null
          },
          {
            "wp_name": "Task 91",
            "progress": 0,
            "story_points": 0
          },
          {
            "wp_name": "Epic 11",
            "progress": 0,
            "story_points": null
          }
        ]
      },
      {
        "project_name": "DEXS23D",
        "wp_assigned": [
          {
            "wp_name": "Belajar mandiri #21",
            "progress": 100,
            "story_points": null
          },
          {
            "wp_name": "Requirement Specification #21",
            "progress": 100,
            "story_points": null
          }
        ]
      }
    ]
  }
]
  

  

export const milestoneData = [
  {
    "projectName": "Sandbox",
    "milestones": [
      {
        "wpName": "Task 1",
        "date": "2023-07-07",
        "month": "July",
        "year": "2027"
      },
      {
        "wpName": "Task 3",
        "date": "2024-11-07",
        "month": "November",
        "year": "2024"
      },
      {
        "wpName": "Milestone 1",
        "date": "2023-04-10",
        "month": "April",
        "year": "2023"
      },
      {
        "wpName": "Task 4",
        "date": "2023-08-11",
        "month": "August",
        "year": "2023"
      }
    ]
  }
]

/* Project Type */

export const projectData = [
  {
    "project_name": "Sandbox",
    "wp_types": [
      "Epic",
      "User story",
      "Feature",
      "Milestone",
      "Task",
      "Bug",
      "Initiative",
      "Phase"
    ],
    "progress": {
      "wp_total": 21,
      "wp_done": 2,
      "progress_by_initiative": 0,
      "progress_by_wp": 10,
      "story_points": 343
    }
  },
  {
    "project_name": "DEXS23D",
    "wp_types": [
      "Epic",
      "User story",
      "Feature",
      "Milestone",
      "Task",
      "Bug",
      "Initiative",
      "Phase"
    ],
    "progress": {
      "wp_total": 45,
      "wp_done": 33,
      "progress_by_initiative": 73,
      "progress_by_wp": 73,
      "story_points": 0
    }
  }
]
