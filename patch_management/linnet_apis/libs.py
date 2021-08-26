import os
import os.path
from pathlib import Path, PureWindowsPath


BASE_DIR = Path(__file__).resolve().parent.parent.parent
# Modified to os.path.join format as below

PATCH_DIR = os.path.join(BASE_DIR, 'patch_management/')
WORKING_DIR = os.path.join(BASE_DIR, 'working/')
# -------------------------------------------
if os.name == 'nt':
    BASE_DIR = PureWindowsPath(__file__).parent.parent.parent.as_posix()
    # Below were not working on server
    PATCH_DIR = BASE_DIR + '/patch_management/'
    # PATCHSCRIPT_DIR = PATCH_DIR + "patch_scripts/"
    # CONFIGFILE_DIR = PATCHSCRIPT_DIR + 'patch_configurations/'

    WORKING_DIR = BASE_DIR + "/working/"
    # -----------------------------------------
PATCHSCRIPT_DIR = os.path.join(PATCH_DIR, 'patch_scripts/')
CONFIGFILE_DIR = os.path.join(PATCHSCRIPT_DIR, 'patch_configurations/')
