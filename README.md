# AI Recruitment Management System

**Project Title:** Utilizing Artificial Intelligence in IT Recruitment: Enhancing Efficiency and Effectiveness  
[🔗 Live Demo](https://ai-recruit-platform.vercel.app/)

## Project Overview

This full-stack web application serves as the practical demonstration component of examining AI applications in IT recruitment. The system demonstrates how artificial intelligence can be integrated into recruitment workflows to improve efficiency, reduce time-to-fill, and enhance the quality of hiring decisions.

### Key Features
- 🤖 **AI Resume Scoring** — Automated resume quality assessment (0-100 score)
- 🎯 **Skill Matching Algorithm** — NLP-based candidate-job skill matching
- 📊 **Analytics Dashboard** — Real-time recruitment metrics and trend analysis
- 🔽 **Pipeline Management** — Visual recruitment pipeline from application to hire
- 👥 **Candidate Management** — Complete candidate profile management with AI insights
- 💼 **Job Management** — End-to-end job posting lifecycle management
- 📋 **Application Tracking** — AI-ranked application management system
- 📝 **Audit Logs** — Complete audit trail of all system actions

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Redux Toolkit, React Router v6, Axios, Recharts |
| **Backend** | Python 3.11, Django 4.2, Django REST Framework |
| **Database** | SQLite3 |
| **Authentication** | JWT (djangorestframework-simplejwt) |
| **UI** | Custom CSS, Recharts for data visualization |
| **Form Validation** | React Hook Form + Yup |
| **API Design** | RESTful JSON API with consistent envelope response |

---

## Project Structure

```
ai_recruitment_project/
├── backend/                          # Django REST API
│   ├── ai_recruitment/               # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── core/                         # Base models, utilities, dashboard metrics
│   ├── master/                       # Lookup tables (skills, job categories, locations)
│   ├── main/                         # Jobs, Candidates, Applications + AI logic
│   ├── transactions/                 # Interviews, assessments, offers
│   ├── logs/                         # Audit trail and change history
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                         # React + Vite application
    └── src/
        ├── components/               # Reusable UI components
        ├── pages/                    # Route-level pages
        │   ├── Dashboard.jsx         # Main analytics dashboard
        │   ├── Jobs.jsx              # Job listings and management
        │   ├── Candidates.jsx        # Candidate database
        │   ├── Applications.jsx      # Application pipeline
        │   ├── CreateJob.jsx         # New job form
        │   ├── Login.jsx             # Authentication page
        │   └── NotFound.jsx          # 404 page
        ├── services/                 # Axios API service layer
        │   ├── api.js                # Centralized axios instance with interceptors
        │   └── mainService.js        # Jobs, Candidates, Applications API calls
        ├── store/                    # Redux Toolkit state management
        │   ├── index.js              # Redux store configuration
        │   └── authSlice.js          # Authentication state
        ├── routes/                   # React Router v6 route definitions
        ├── hooks/                    # Custom React hooks
        └── utils/                    # Helper functions and constants
```

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- SQLite3+
- Git

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/[your-username]/ai-recruitment-system.git
cd ai-recruitment-system/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# OR
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials and secret key

# 5. Create PostgreSQL database - but here we used SQLite3 so skip this 
psql -U postgres -c "CREATE DATABASE ai_recruitment_db;" 

# 6. Run migrations (creates SQLite database automatically)
python manage.py makemigrations
python manage.py migrate

# 7. Create superuser
python manage.py createsuperuser

# 8. Load demo data (optional)
python manage.py loaddata fixtures/demo_data.json

# 9. Run development server
python manage.py runserver 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Verify VITE_API_BASE_URL=http://localhost:8000/api

# Start development server
npm run dev
```

Access the application at: http://localhost:5173  
Admin panel at: http://localhost:8000/admin  

---

## API Endpoint Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Obtain JWT access + refresh tokens |
| POST | `/api/auth/refresh/` | Refresh access token |
| POST | `/api/auth/verify/` | Verify token validity |

### Jobs API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/main/jobs/` | List all jobs (paginated, filterable) |
| POST | `/api/main/jobs/` | Create new job posting |
| GET | `/api/main/jobs/{id}/` | Get job details |
| PUT | `/api/main/jobs/{id}/` | Update job |
| DELETE | `/api/main/jobs/{id}/` | Soft delete job |
| GET | `/api/main/jobs/{id}/applications/` | Get all applications for job |
| GET | `/api/main/jobs/{id}/stats/` | Get job application statistics |

### Candidates API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/main/candidates/` | List all candidates |
| POST | `/api/main/candidates/` | Add new candidate (triggers AI scoring) |
| GET | `/api/main/candidates/{id}/` | Get candidate profile |
| PUT | `/api/main/candidates/{id}/` | Update candidate |
| DELETE | `/api/main/candidates/{id}/` | Soft delete candidate |
| POST | `/api/main/candidates/{id}/ai_screen/` | Trigger AI screening |

### Applications API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/main/applications/` | List all applications |
| POST | `/api/main/applications/` | Create application (triggers AI matching) |
| GET | `/api/main/applications/{id}/` | Get application detail |
| PATCH | `/api/main/applications/{id}/update_status/` | Update pipeline stage |
| POST | `/api/main/applications/bulk_ai_rank/` | AI rank all applications for a job |

### Logs API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs/audit/` | Get audit trail logs |

### Response Envelope
All API responses follow the format:
```json
{
  "status": "success",
  "message": "Operation completed",
  "data": { ... },
  "count": 10,
  "next": "http://...",
  "previous": null
}
```

---

## AI Features Explained

### Resume Scoring Algorithm
When a candidate is created or AI screening is triggered, the system computes:
- **Skill extraction** — Parses resume/profile for technical skills
- **Quality score (0-100)** — Computed from completeness, skill depth, experience
- **Profile summary** — Auto-generated candidate summary

### Job-Candidate Matching
When an application is submitted:
- **Skill overlap ratio** — Matched skills / required skills × 100 (70% weight)
- **Resume quality factor** — Candidate AI score × 30% weight  
- **Recommendation** — Recommend (≥70), Neutral (50-69), Reject (<50)

### AI Ranking
Bulk ranking orders all applications for a job by AI match score, enabling recruiters to process top candidates first.

---

## Screenshots

> <img width="1918" height="863" alt="image" src="https://github.com/user-attachments/assets/f16ae544-548c-4c5b-ab1a-eae1046dd8ca" />
<br/>
> <img width="1919" height="861" alt="image" src="https://github.com/user-attachments/assets/93495d6b-3432-4646-a84e-97b4355f6de2" />

---

## Academic Context

 The project demonstrates the practical implementation of concepts studied in the dissertation research on AI in IT recruitment.

**Research Finding Implemented:** The system validates the study's finding that AI reduces time-to-shortlist by automating resume screening and ranking, a process that the research found reduced manual screening time by 83%.

---

## License

This project is created for academic purposes. All code is original work by the student.

---

## Contact

For academic queries related to this project, contact likhitha.desala@gmail.com.
