# Create VPC
resource "aws_vpc" "aat_vpc" {
  cidr_block = "10.10.0.0/16"
  tags = {
    Name = "aat_vpc"
  }
}
# Provision a subnet
resource "aws_subnet" "aat_subnet" {
  vpc_id     = aws_vpc.aat_vpc.id
  cidr_block = "10.10.1.0/24"
  availability_zone = var.aat_ecs_availability_zone

  tags = {
    Name = "aat_subnet"
  }
}

resource "aws_security_group" "aat_allow_tls" {
  name        = "aat_allow_tls"
  description = "Allow TLS inbound traffic on 443 and 80 port"
  vpc_id      = aws_vpc.aat_vpc.id

  ingress {
    description = "TLS from outside"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "plaintext from outside"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "aat_allow_tls"
  }
}

# Create Internet gateway
resource "aws_internet_gateway" "aat_public_subnet_igw" {
  vpc_id = aws_vpc.aat_vpc.id

  tags = {
    Name = "aat_public_subnet_igw"
  }
}

# Create route table
resource "aws_route_table" "aat_route_table" {
  vpc_id = aws_vpc.aat_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.aat_public_subnet_igw.id
  }

  tags = {
    Name = "aat_route_table"
  }
}

# Create route table association
resource "aws_route_table_association" "aat_route_table_association" {
  subnet_id      = aws_subnet.aat_subnet.id
  route_table_id = aws_route_table.aat_route_table.id
}

# Create Load balancer

resource "aws_elb" "aat-opstool-elb" {
    name = "aat-opstool-elb"
    security_groups = [aws_security_group.aat_allow_tls.id]
    subnets = [aws_subnet.aat_subnet.id]

    listener {
        lb_protocol = "http"
        lb_port = 80

        instance_protocol = "http"
        instance_port = 80
    }
    cross_zone_load_balancing = true
}
