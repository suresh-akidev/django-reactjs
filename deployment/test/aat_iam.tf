/* ecs iam role and policies */
resource "aws_iam_role" "aat_ecs_role" {
  name               = "aat_ecs_role"
  assume_role_policy = file("policies/aat-ecs-role.json")
}

resource "aws_iam_service_linked_role" "AWSServiceRoleForECS" {
  aws_service_name = "ecs.amazonaws.com"
  description = "Role to enable Amazon ECS to manage your cluster."
}
/* ecs service scheduler role */
resource "aws_iam_role_policy" "aat_ecs_service_role_policy" {
  name     = "aat_ecs_service_role_policy"
  policy   = file("policies/aat-ecs-service-role-policy.json")
  role     = aws_iam_role.aat_ecs_role.id
}

/* ec2 container instance role & policy */
resource "aws_iam_role_policy" "aat_ecs_instance_role_policy" {
  name     = "aat_ecs_instance_role_policy"
  policy   = file("policies/aat-ecs-instance-role-policy.json")
  role     = aws_iam_role.aat_ecs_role.id
}

/**
 * IAM profile to be used in auto-scaling launch configuration.
 */
resource "aws_iam_instance_profile" "aat_ecs_instance_profile" {
  name = "aat_ecs_instance_profile"
  path = "/"
  role = aws_iam_role.aat_ecs_role.name
}