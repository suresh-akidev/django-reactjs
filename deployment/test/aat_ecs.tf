# Identify AMI for EC2 instance
data "aws_ami" "aat_opstool_ami" {
  owners      = ["amazon"]
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

# Create launch configuration
resource "aws_launch_configuration" "aat_opstool_launch_configuration" {
  name_prefix  = "aat_opstool_lc-"
  image_id      = data.aws_ami.aat_opstool_ami.id
  instance_type = var.aat_instance_type
  security_groups = [aws_security_group.aat_allow_tls.id]
  iam_instance_profile = aws_iam_instance_profile.aat_ecs_instance_profile.name
  user_data = "#!/bin/bash\necho ECS_CLUSTER='aat_ecs_cluster' > /etc/ecs/ecs.config"
  associate_public_ip_address = true

  lifecycle {
    create_before_destroy = true
  }
}

# Create Auto scaling group
resource "aws_autoscaling_group" "aat_opstool_asg" {
  name_prefix          = "aat_opstool_asg-"
  launch_configuration = aws_launch_configuration.aat_opstool_launch_configuration.name
  vpc_zone_identifier  = [aws_subnet.aat_subnet.id]
  min_size             = 1
  max_size             = 1
  protect_from_scale_in = true
  load_balancers    = [aws_elb.aat-opstool-elb.name]

  lifecycle {
    create_before_destroy = true
  }
}

# Create ECS capacity provider
resource "aws_ecs_capacity_provider" "aat_opstool_ecs_capacity_provider" {
  name = "aat_opstool_ecs_cp_${aws_autoscaling_group.aat_opstool_asg.name}"

  auto_scaling_group_provider {
    auto_scaling_group_arn         = aws_autoscaling_group.aat_opstool_asg.arn
    managed_termination_protection = "ENABLED"

    managed_scaling {
      maximum_scaling_step_size = 1
      minimum_scaling_step_size = 1
      status                    = "ENABLED"
      target_capacity           = 70
    }
  }
}

# Create secret

resource "aws_secretsmanager_secret" "aat_opstool_docker_secret" {
  name = "aat_opstool_docker_secret"
  description = "This secret is used to connect to artifactory"
}

resource "aws_secretsmanager_secret_version" "aat_opstool_docker_secret_version" {
  secret_id     = aws_secretsmanager_secret.aat_opstool_docker_secret.id
  secret_string = jsonencode(var.docker_credentials)
}

#data "aws_secretsmanager_secret" "aat_opstool_docker_secret" {
#  name = "aat_opstool_docker_secret"
#}

# Create cluster

resource "aws_ecs_cluster" "aat_ecs_cluster" {
  name = "aat_ecs_cluster"
  capacity_providers = [
            aws_ecs_capacity_provider.aat_opstool_ecs_capacity_provider.name
        ]
  default_capacity_provider_strategy {
      capacity_provider=aws_ecs_capacity_provider.aat_opstool_ecs_capacity_provider.name
  }
}

# Load config from template

data "template_file" "aat-opstool-task-def" {
  template = file("templates/opstool-task-def.tpl")
  vars = {
    aat_ecs_region = var.aat_ecs_region
    aat_account_id = var.aat_account_id
    aat_opstool_docker_secret = aws_secretsmanager_secret.aat_opstool_docker_secret.arn
    aat_opstool_appname1 = var.aat_opstool_appname1
    aat_opstool_image1 = var.aat_opstool_image1
    aat_opstool_appname2 = var.aat_opstool_appname2
    aat_opstool_image2 = var.aat_opstool_image2
    aat_opstool_appname3 = var.aat_opstool_appname3
    aat_opstool_image3 = var.aat_opstool_image3
    aat_opstool_appname4 = var.aat_opstool_appname4
    aat_opstool_image4 = var.aat_opstool_image4
    aat_opstool_appname5 = var.aat_opstool_appname5
    aat_opstool_image5 = var.aat_opstool_image5
  }
}

# Create task definition

resource "aws_ecs_task_definition" "aat_opstool_task_def" {
  family                = "aat_opstool_task_def"
  volume {
    name = "app1"
    docker_volume_configuration {
      scope = "task"
      driver = "local"
      labels = {
        appname = var.aat_opstool_appname1
      }
    }
  }
  volume {
    name = "app2"
    docker_volume_configuration {
      scope = "task"
      driver = "local"
      labels = {
        appname = var.aat_opstool_appname2
      }
    }
  }
  volume {
    name = "app3"
    docker_volume_configuration {
      scope = "task"
      driver = "local"
      labels = {
        appname = var.aat_opstool_appname3
      }
    }
  }
  volume {
    name = "app4"
    docker_volume_configuration {
      scope = "task"
      driver = "local"
      labels = {
        appname = var.aat_opstool_appname4
      }
    }
  }
  volume {
    name = "app5"
    docker_volume_configuration {
      scope = "task"
      driver = "local"
      labels = {
        appname = var.aat_opstool_appname5
      }
    }
  }
  network_mode = "bridge"
  container_definitions = data.template_file.aat-opstool-task-def.rendered
  execution_role_arn = aws_iam_role.aat_ecs_role.arn
}

# Create service

resource "aws_ecs_service" "aat_opstool_task_service" {
  name            = "aat_opstool_task_def"
  cluster         = aws_ecs_cluster.aat_ecs_cluster.id
  task_definition = aws_ecs_task_definition.aat_opstool_task_def.arn
  launch_type     = "EC2"
  force_new_deployment = true
  desired_count   = 1
  #iam_role        = aws_iam_role.aat_ecs_role.arn
  depends_on      = [aws_iam_role_policy.aat_ecs_service_role_policy,aws_iam_role_policy.aat_ecs_instance_role_policy]
  load_balancer {
    elb_name = aws_elb.aat-opstool-elb.name
    container_name   = var.aat_opstool_appname1
    container_port   = 80
  }
}

