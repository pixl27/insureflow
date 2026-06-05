variable "aws_region" {
  type        = string
  default     = "eu-west-3"
  description = "The AWS Region to deploy resources in"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Password for the RDS PostgreSQL database"
}
