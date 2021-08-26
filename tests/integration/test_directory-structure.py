from OpsMate.testing import *
import os
import os.path
from pathlib import Path

def test_ProjectSetup(client):
    root_files = ['README.md', 'CHANGELOG.md', 'ISSUE_TEMPLATE.md', 'requirements.txt', 'manage.py', 'pytest.ini']
    BASE_DIR = Path(__file__).resolve().parent.parent.parent
    for items in root_files:
        print('Checking %s on root folder.....' %items)
        x = os.path.exists(os.path.join(BASE_DIR, '%s'%items))
        assert x == True
    folder_list = ['OpsMate', 'scripts', 'tests']
    for folders in folder_list:
        print('Check if %s exist.....' %folders)
        x = os.path.exists(os.path.join(BASE_DIR, '%s'%folders))
        assert x == True
        print('Check %s is a folder.....' % folders)
        i = os.path.isdir(os.path.join(BASE_DIR, '%s' % folders))
        assert i == True
    print('Check if an is App Installed....')
    folder = os.listdir(os.path.join(BASE_DIR, 'patch_management'))
    assert len(folder) > 0
    opsmate_file = ['wsgi.py','urls.py']
    print('Check if OpsMate has urls.py and wsgi.py....')
    for x in opsmate_file:
        i = os.path.exists(os.path.join(BASE_DIR, 'OpsMate/%s'%x))
        assert i == True

