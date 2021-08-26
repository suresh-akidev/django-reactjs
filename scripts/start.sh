#!/bin/bash

# Start sshd service

/etc/init.d/ssh restart
python manage.py makemigrations
python manage.py migrate
if ls /var/run/celery/*.pid 1>/dev/null 2>&1; then
    rm /var/run/celery/*.pid
fi
/etc/init.d/celeryd restart
/etc/init.d/celerybeat restart

# Run CMD

exec "$@"