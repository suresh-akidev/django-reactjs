[
    {
      "name": "${aat_opstool_appname1}",
      "image": "${aat_opstool_image1}",
      "repositoryCredentials": {
        "credentialsParameter": "${aat_opstool_docker_secret}"
    },
      "hostname": "${aat_opstool_appname1}",
      "cpu": 1,
      "memory": 256,
      "essential": true,
      "portMappings": [{
        "hostPort": 80,
        "protocol": "tcp",
        "containerPort": 80
        },
        {
        "hostPort": 443,
        "protocol": "tcp",
        "containerPort": 443
        }
      ],
      "links": [
         "${aat_opstool_appname2}",
         "${aat_opstool_appname3}",
         "${aat_opstool_appname4}",
         "${aat_opstool_appname5}"
       ],
      "mountPoints":
      [
        {
        "sourceVolume": "app1",
        "containerPath": "/opt/app"
        }
      ]
    },
    {
      "name": "${aat_opstool_appname2}",
      "image": "${aat_opstool_image2}",
      "repositoryCredentials": {
        "credentialsParameter": "${aat_opstool_docker_secret}"
    },
      "hostname": "${aat_opstool_appname2}",
      "cpu": 1,
      "memory": 256,
      "essential": false,
      "mountPoints":
      [
        {
        "sourceVolume": "app2",
        "containerPath": "/opt/app"
        }
      ],
      "portMappings": [{
        "hostPort": 7656,
        "protocol": "tcp",
        "containerPort": 7656
        }
      ]
    },
    {
      "name": "${aat_opstool_appname3}",
      "image": "${aat_opstool_image3}",
      "repositoryCredentials": {
        "credentialsParameter": "${aat_opstool_docker_secret}"
    },
      "hostname": "${aat_opstool_appname3}",
      "cpu": 1,
      "memory": 256,
      "essential": false,
      "mountPoints":
      [
        {
        "sourceVolume": "app3",
        "containerPath": "/opt/app"
        }
      ],
      "portMappings": [{
        "hostPort": 8656,
        "protocol": "tcp",
        "containerPort": 8656
        }
      ]
    },
    {
      "name": "${aat_opstool_appname4}",
      "image": "${aat_opstool_image4}",
      "repositoryCredentials": {
        "credentialsParameter": "${aat_opstool_docker_secret}"
    },
      "hostname": "${aat_opstool_appname4}",
      "cpu": 1,
      "memory": 256,
      "essential": false,
      "mountPoints":
      [
        {
        "sourceVolume": "app4",
        "containerPath": "/opt/app"
        }
      ],
      "portMappings": [{
        "hostPort": 9656,
        "protocol": "tcp",
        "containerPort": 9656
        }
      ]
    },
    {
      "name": "${aat_opstool_appname5}",
      "image": "${aat_opstool_image5}",
      "repositoryCredentials": {
        "credentialsParameter": "${aat_opstool_docker_secret}"
    },
      "hostname": "${aat_opstool_appname5}",
      "cpu": 1,
      "memory": 256,
      "essential": false,
      "mountPoints":
      [
        {
        "sourceVolume": "app5",
        "containerPath": "/opt/app/OpsTool/working"
        }
      ],
      "portMappings": [{
        "hostPort": 5656,
        "protocol": "tcp",
        "containerPort": 5656
        }
      ]
    }
]