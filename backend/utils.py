from collections import Counter

def count_progress(items, key):
    progress_counts = {}
    for item in items:
        value = item.get(key)
        status = item.get("status")
        story_points = item.get("story_points")

        if value is not None:
            if value not in progress_counts:
                progress_counts[value] = {
                    "wp_total": 0,
                    "wp_done": 0,
                    "progress": 0,
                    "story_points": 0
                }

            progress_counts[value]["wp_total"] += 1

            if story_points is not None:
                progress_counts[value]["story_points"] += story_points

            if status == "Done":
                progress_counts[value]["wp_done"] += 1

    result = []
    for progress_name, counts in progress_counts.items():
        result.append({
            key: progress_name,
            "progress": {
                "wp_total": counts["wp_total"],
                "wp_done": counts["wp_done"],
                "progress": (counts["wp_done"] / counts["wp_total"])*100,
                "story_points": counts["story_points"]
            }
        })
    return result