from fastapi import APIRouter, HTTPException

from ..lib.registry import REGISTRY, UnknownMiniAppError

router = APIRouter()


@router.get("/mini-apps")
async def list_mini_apps():
    return [
        {
            "id": d.id,
            "name": d.name,
            "skill_one_liner": d.skill_one_liner,
            "estimated_time": d.estimated_time,
        }
        for d in REGISTRY.list()
    ]


@router.get("/mini-apps/{mini_app_id}")
async def get_mini_app(mini_app_id: str):
    try:
        d = REGISTRY.get(mini_app_id)
    except UnknownMiniAppError:
        raise HTTPException(status_code=404, detail={"code": "mini_app_not_found"})
    return {
        "id": d.id,
        "name": d.name,
        "skill_one_liner": d.skill_one_liner,
        "estimated_time": d.estimated_time,
        "orientation_copy": d.orientation_copy,
        "criteria": [
            {"name": c.name, "label": c.label, "description": c.description}
            for c in d.criteria
        ],
    }
