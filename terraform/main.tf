provider "aws" {
  region = var.aws_region
}

# 1. VPC Configuration
resource "aws_vpc" "insureflow_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "insureflow-vpc"
  }
}

# Public Subnets
resource "aws_subnet" "public_subnet_a" {
  vpc_id            = aws_vpc.insureflow_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "insureflow-public-subnet-a"
  }
}

resource "aws_subnet" "public_subnet_b" {
  vpc_id            = aws_vpc.insureflow_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = {
    Name = "insureflow-public-subnet-b"
  }
}

# Private Subnets for Databases and internal microservices
resource "aws_subnet" "private_subnet_a" {
  vpc_id            = aws_vpc.insureflow_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "insureflow-private-subnet-a"
  }
}

resource "aws_subnet" "private_subnet_b" {
  vpc_id            = aws_vpc.insureflow_vpc.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "insureflow-private-subnet-b"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.insureflow_vpc.id

  tags = {
    Name = "insureflow-igw"
  }
}

# Route Table for Public Subnets
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.insureflow_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "insureflow-public-rt"
  }
}

resource "aws_route_table_association" "public_rt_a" {
  subnet_id      = aws_subnet.public_subnet_a.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rt_b" {
  subnet_id      = aws_subnet.public_subnet_b.id
  route_table_id = aws_route_table.public_rt.id
}

# 2. RDS PostgreSQL Instance
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "insureflow-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]
}

resource "aws_security_group" "rds_sg" {
  name        = "insureflow-rds-sg"
  vpc_id      = aws_vpc.insureflow_vpc.id
  description = "Security group for PostgreSQL RDS instance"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # Restricted to internal VPC traffic
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "insureflow-rds-postgres"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t3.micro"
  db_name                = "insureflow_db"
  username               = "insureflow_admin"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true
}

# 3. ElastiCache Redis
resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "insureflow-redis-subnet"
  subnet_ids = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_b.id]
}

resource "aws_security_group" "redis_sg" {
  name   = "insureflow-redis-sg"
  vpc_id = aws_vpc.insureflow_vpc.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "insureflow-redis-cluster"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids   = [aws_security_group.redis_sg.id]
}

# 4. S3 Bucket for Document Storage (GED)
resource "aws_s3_bucket" "ged_bucket" {
  bucket = "insureflow-ged-storage-bucket"

  tags = {
    Environment = "Production"
    Name        = "insureflow-ged"
  }
}

# 5. ECS Fargate Cluster & Service definitions
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "insureflow-cluster"
}
