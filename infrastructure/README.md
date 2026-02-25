# FashionLink Infrastructure & CI/CD Architecture

This repository contains the Infrastructure as Code (IaC), CI/CD configuration, and cloud architecture design for the FashionLink application.

---

## 🏗 Overall Architecture

```text
┌──────────────────────────────────────────────────────────────────────┐
│                              AWS Cloud                               │
│                                                                      │
│  ┌─────────────────┐              ┌──────────────────────────────┐  │
│  │   Public Subnet │              │         Private Subnets       │  │
│  │   (AZ-a & AZ-b) │              │  ┌────────────────────────┐  │  │
│  │                 │              │  │  App Tier (Private)    │  │  │
│  │  ┌───────────┐  │              │  │  ┌──────────────────┐  │  │  │
│  │  │  Jenkins  │  │              │  │  │ Backend Containers│  │  │  │
│  │  │  Server   │◄─┼──────────────┼──┼──│(Node.js on ECS/   │  │  │  │
│  │  └───────────┘  │   CI/CD      │  │  │   Fargate)        │  │  │  │
│  │                 │   Trigger    │  │  └──────────────────┘  │  │  │
│  │  ┌───────────┐  │              │  │          │             │  │  │
│  │  │  Frontend │  │              │  │          ▼             │  │  │
│  │  │Containers │◄─┼──────────────┼──┼──┌──────────────────┐  │  │  │
│  │  │(Nginx/React│ │   Internal   │  │  │   Internal ALB   │  │  │  │
│  │  │ on ECS/    │ │     ALB      │  │  └──────────────────┘  │  │  │
│  │  │  Fargate)  │ │              │  │          │             │  │  │
│  │  └───────────┘  │              │  │          ▼             │  │  │
│  │       ▲         │              │  │  ┌──────────────────┐  │  │  │
│  │       │         │              │  │  │   Database Tier  │  │  │  │
│  │  ┌────┴────┐    │              │  │  │  ┌────────────┐  │  │  │  │
│  │  │External │    │              │  │  │  │  Supabase  │  │  │  │  │
│  │  │   ALB   │    │              │  │  │  │ (via AWS   │  │  │  │  │
│  │  └─────────┘    │              │  │  │  │ PrivateLink)│  │  │  │  │
│  └─────────────────┘              │  │  │  └────────────┘  │  │  │  │
│                                    │  └──────────────────────┘  │  │
│                                    └────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │              Amazon ECR (Container Registry)               │     │
│  └────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Architecture Overview

- **Jenkins (Public Subnet)**  
  Handles CI/CD pipeline automation and deployment triggers.

- **Amazon ECS (Fargate)**  
  Runs frontend and backend containers in private subnets.

- **Application Load Balancers**
  - External ALB for public traffic
  - Internal ALB for private service communication

- **Supabase (Database Layer)**  
  Connected securely via AWS PrivateLink.

- **Amazon ECR**  
  Stores Docker container images.

---

## 📦 Terraform / IaC Folder Structure

```text
infrastructure/
├── modules/
│   ├── networking/
│   │   ├── vpc.tf
│   │   ├── subnets.tf
│   │   ├── route-tables.tf
│   │   └── outputs.tf
│   ├── compute/
│   │   ├── ecs-cluster.tf
│   │   ├── task-definitions/
│   │   │   ├── frontend.json
│   │   │   └── backend.json
│   │   └── services.tf
│   ├── load-balancing/
│   │   ├── external-alb.tf
│   │   ├── internal-alb.tf
│   │   └── target-groups.tf
│   └── security/
│       ├── security-groups.tf
│       ├── iam-roles.tf
│       └── secrets-manager.tf
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── prod/
└── Jenkinsfile
```

---

## 🔄 CI/CD Workflow

1. Developer pushes code to GitHub.
2. Jenkins pipeline is triggered.
3. Docker images are built.
4. Images are pushed to Amazon ECR.
5. ECS services are updated.
6. Application redeploys automatically.

---

## 🛠 Technology Stack

- AWS VPC
- Amazon ECS (Fargate)
- Amazon ECR
- Jenkins
- Terraform
- Docker
- Supabase
- Nginx
- React
- Node.js

---

## 📌 Deployment Strategy

- Infrastructure managed using Terraform.
- Separate environments for dev, staging, and production.
- Containers deployed via ECS with rolling updates.
- Secure secrets management via AWS Secrets Manager.

---

## 🔐 Security Considerations

- Private subnets for application and database tiers.
- Security groups restricting inbound/outbound traffic.
- IAM roles with least-privilege policies.
- Secrets managed securely.

---

## 📈 Scalability

- ECS services configured for horizontal scaling.
- ALBs distribute traffic across containers.
- Infrastructure modularized for expansion.

---

## 👩🏽‍💻 Maintainers

FashionLink DevOps Team  
Women Techsters Capstone – Team 68
