from ..models import MiniAppDefinition
from .reflect_and_check import REFLECT_AND_CHECK
from .follow_the_thread import FOLLOW_THE_THREAD
from .read_between_the_lines import READ_BETWEEN_THE_LINES
from .say_it_with_context import SAY_IT_WITH_CONTEXT
from .under_the_surface import UNDER_THE_SURFACE
from .what_did_you_mean import WHAT_DID_YOU_MEAN

ALL_DEFINITIONS: list[MiniAppDefinition] = [
    REFLECT_AND_CHECK,
    FOLLOW_THE_THREAD,
    READ_BETWEEN_THE_LINES,
    SAY_IT_WITH_CONTEXT,
    UNDER_THE_SURFACE,
    WHAT_DID_YOU_MEAN,
]
