variable "aat_account_id" {
  description = "Account ID"
  type        = string
}
variable "aat_opstool_aws_user" {
  description = "AWS IAM User"
  type        = string
}
variable "aat_ecs_region" {
  description = "Region for this ecs cluster"
  type        = string
}
variable "aat_ecs_availability_zone" {
  description = "Availability zone for this ecs cluster"
  type        = string
}
variable "aat_ecs_cluster" {
  description = "The ECS cluster name"
  type        = string
}

variable "docker_credentials" {
  default = {
    "username" = "default_username"
    "password" = "default_password"
  }

  type = map
}

variable "aat_instance_type" {
    description = "Instance type"
    type        = string
}

variable "aat_opstool_appname1" {
    description = "Opstool UI name"
    type        = string
}

variable "aat_opstool_image1" {
    description = "Opstool UI image location"
    type        = string
}

variable "aat_opstool_appname2" {
    description = "Opstool OCDF App name"
    type        = string
}

variable "aat_opstool_image2" {
    description = "Opstool OCDF image location"
    type        = string
}

variable "aat_opstool_appname3" {
    description = "Opstool uamsecurityaudit App name"
    type        = string
}

variable "aat_opstool_image3" {
    description = "Opstool uamsecurityaudit image location"
    type        = string
}

variable "aat_opstool_appname4" {
    description = "Opstool drclite App name"
    type        = string
}

variable "aat_opstool_image4" {
    description = "Opstool drclite image location"
    type        = string
}

variable "aat_opstool_appname5" {
    description = "Opstool healthcheck App name"
    type        = string
}

variable "aat_opstool_image5" {
    description = "Opstool healthcheck image location"
    type        = string
}