OVERAL ARCHITECTURE
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

Terraform/IaC Folder Structure

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


