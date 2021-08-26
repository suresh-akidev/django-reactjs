terraform {
  backend "artifactory" {
    url      = "https://artifactory.dxc.com/artifactory"
    repo     = "aatopstool-docker"
    subpath  = "aws-test-env/terraform-state-files/aatopstool.tfstate"
  }
}
