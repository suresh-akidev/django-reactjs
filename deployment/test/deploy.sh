#!/bin/bash

# Provision environment

# aws cli set environment
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region us-east-1
export TF_VAR_aat_account_id=`aws sts get-caller-identity | grep Account | awk -F\" '{ print $(NF-1) }'`


# Download terraform
mkdir terraform ; cd terraform
wget -q https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip
unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip
mv terraform /usr/local/bin/
cd ../
# Terraform steps

export ARTIFACTORY_USERNAME=${ARTIFACTORY_USER}
echo "docker_credentials = {username = \"${ARTIFACTORY_USER}\",password = \"${ARTIFACTORY_PASSWORD}\"}" > secrets.tfvars
terraform init -input=false -backend=true -backend-config=backend.tf .
terraform plan -input=false -var-file=aat.tfvars -var-file=secrets.tfvars -out=tfplan
terraform apply -input=false tfplan
cd ../..
LBDNS=`aws elb describe-load-balancers --load-balancer-name aat-opstool-elb | grep DNSName | awk -F\" '{ print $(NF-1) }'`
echo "LBDNSURL=$LBDNS" > env.props
