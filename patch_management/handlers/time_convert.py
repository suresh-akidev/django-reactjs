import pytz
from datetime import datetime
import maya

def time_convert(time_str,zone_to_convert):
    """
    time_str = time in string format
    zone_to_convert = ex 'Asia/Kuala_Lumpur'
    """
    converted_time = maya.parse(time_str).datetime(to_timezone=zone_to_convert, naive=False)
    converted_time = converted_time.strftime("%Y-%m-%dT%H:%M")
    return converted_time