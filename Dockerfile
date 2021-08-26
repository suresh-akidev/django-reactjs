FROM python:3.9-slim

# Create app directory
WORKDIR /opt/app

# Bundle app source
COPY . /opt/app/

# copy celery init.d files
COPY scripts/celery-startup/daemon-config/celery* /etc/default/

COPY scripts/celery-startup/init.d/celery* /etc/init.d/

RUN apt-get update && \
    apt-get install -y openssh-server sshpass gcc libmariadb-dev curl g++ make iputils-ping bzip2 zip && apt-get clean all && \
    pip install -r requirements.txt && \
    chmod +x /etc/init.d/celeryd /etc/init.d/celerybeat && \
    update-rc.d celeryd defaults && update-rc.d celerybeat defaults

WORKDIR /opt/app/patch_frontend

RUN curl -sL https://deb.nodesource.com/setup_15.x | bash - && \
    apt-get install -y nodejs && apt-get clean all && \
    npm i; npm run build

WORKDIR /opt/app

EXPOSE 10656

ENTRYPOINT ["sh", "/opt/app/scripts/start.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:10656"]
