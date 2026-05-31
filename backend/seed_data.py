"""
seed_data.py
Run: python manage.py shell < seed_data.py
Creates realistic demo data for AI IT Recruitment Platform.
"""

from django.contrib.auth.models import User
from master.models import Department, TechSkill, JobLevel, AITool, EmploymentType, Location
from main.models import JobRequisition, Candidate, Application

# ─── Users ───────────────────────────────────────────────────
superuser, _ = User.objects.get_or_create(username="admin",
    defaults=dict(email="admin@airecruitment.com", is_staff=True, is_superuser=True,
                  first_name="Admin", last_name="User"))
superuser.set_password("Admin@1234")
superuser.save()

hr1, _ = User.objects.get_or_create(username="priya.sharma",
    defaults=dict(email="priya@airecruitment.com", first_name="Priya", last_name="Sharma"))
hr1.set_password("HR@1234")
hr1.save()

# ─── Departments ─────────────────────────────────────────────
depts = [
    ("Engineering",          "ENG"),
    ("Data Science & AI",    "DAI"),
    ("Product Management",   "PM"),
    ("Quality Assurance",    "QA"),
    ("DevOps & Cloud",       "OPS"),
    ("Cybersecurity",        "SEC"),
    ("HR Technology",        "HRT"),
]
dept_objs = {}
for name, code in depts:
    d, _ = Department.objects.get_or_create(name=name, defaults={"code": code})
    dept_objs[code] = d

# ─── Tech Skills ─────────────────────────────────────────────
skills_data = [
    ("Python", "language"), ("Java", "language"), ("JavaScript", "language"),
    ("TypeScript", "language"), ("Go", "language"), ("Rust", "language"),
    ("React", "framework"), ("Django", "framework"), ("Node.js", "framework"),
    ("FastAPI", "framework"), ("Spring Boot", "framework"),
    ("PostgreSQL", "database"), ("MongoDB", "database"), ("Redis", "database"),
    ("AWS", "cloud"), ("Azure", "cloud"), ("GCP", "cloud"), ("Kubernetes", "cloud"),
    ("TensorFlow", "ai_ml"), ("PyTorch", "ai_ml"), ("Scikit-learn", "ai_ml"),
    ("Machine Learning", "ai_ml"), ("NLP", "ai_ml"), ("Computer Vision", "ai_ml"),
    ("Communication", "soft_skill"), ("Leadership", "soft_skill"), ("Problem Solving", "soft_skill"),
]
skill_objs = {}
for name, cat in skills_data:
    s, _ = TechSkill.objects.get_or_create(name=name, defaults={"category": cat})
    skill_objs[name] = s

# ─── Job Levels ───────────────────────────────────────────────
levels_data = [
    ("Junior", "JR", 0, 3), ("Mid-Level", "MID", 3, 6),
    ("Senior", "SR", 6, 10), ("Lead", "LEAD", 8, 15), ("Principal", "PRIN", 12, 30),
]
level_objs = {}
for name, code, mn, mx in levels_data:
    l, _ = JobLevel.objects.get_or_create(name=name,
        defaults={"code": code, "min_exp_years": mn, "max_exp_years": mx})
    level_objs[code] = l

# ─── Employment Types ─────────────────────────────────────────
et_objs = {}
for name, code in [("Full-time", "FT"), ("Contract", "CT"), ("Part-time", "PT"), ("Internship", "INT")]:
    et, _ = EmploymentType.objects.get_or_create(name=name, defaults={"code": code})
    et_objs[code] = et

# ─── Locations ────────────────────────────────────────────────
loc_objs = {}
for city, state in [("Bangalore", "Karnataka"), ("Hyderabad", "Telangana"),
                     ("Pune", "Maharashtra"), ("Mumbai", "Maharashtra"),
                     ("Chennai", "Tamil Nadu"), ("Delhi", "Delhi")]:
    loc, _ = Location.objects.get_or_create(city=city, state=state,
        defaults={"country": "India"})
    loc_objs[city] = loc

# Remote
remote_loc, _ = Location.objects.get_or_create(city="Remote", state="Any",
    defaults={"country": "India", "is_remote": True})
loc_objs["Remote"] = remote_loc

# ─── AI Tools ─────────────────────────────────────────────────
ai_tools_data = [
    ("ResumeAI Pro",    "screening",    "TalentTech",    92.5, True),
    ("HireBot",         "chatbot",      "BotRecruit",    88.0, True),
    ("SmartATS",        "ats",          "ATS Corp",      95.0, True),
    ("VideoIQ",         "video_ai",     "InterviewAI",   85.5, True),
    ("TalentPredict",   "predictive",   "DataHire",      79.3, True),
    ("JDOptimizer",     "jd_optimizer", "WriteHire",     90.1, False),
    ("SourceBot",       "sourcing",     "LinkedAI",      83.7, True),
]
for name, ttype, vendor, acc, integrated in ai_tools_data:
    AITool.objects.get_or_create(name=name,
        defaults={"tool_type": ttype, "vendor": vendor,
                  "accuracy_pct": acc, "is_integrated": integrated})

# ─── Job Requisitions ─────────────────────────────────────────
reqs_data = [
    ("Senior Python Developer",    "ENG",  "SR",   "FT",  "Bangalore", ["Python","Django","PostgreSQL","AWS"],       7, 10, 1800000, 2500000),
    ("ML Engineer",                "DAI",  "MID",  "FT",  "Hyderabad", ["Python","TensorFlow","Machine Learning"],   3, 6,  1200000, 1800000),
    ("Frontend Developer (React)", "ENG",  "MID",  "FT",  "Pune",      ["React","TypeScript","JavaScript"],           3, 6,  1000000, 1500000),
    ("DevOps Engineer",            "OPS",  "SR",   "FT",  "Bangalore", ["Kubernetes","AWS","GCP"],                   6, 10, 1500000, 2200000),
    ("Data Scientist",             "DAI",  "SR",   "FT",  "Remote",    ["Python","PyTorch","NLP","Machine Learning"],5, 9,  1600000, 2300000),
    ("QA Automation Engineer",     "QA",   "MID",  "FT",  "Chennai",   ["Python","Java"],                             3, 7,  900000,  1300000),
    ("Backend Developer (Java)",   "ENG",  "MID",  "FT",  "Mumbai",    ["Java","Spring Boot","PostgreSQL"],           3, 7,  1100000, 1700000),
    ("AI Research Intern",         "DAI",  "JR",   "INT", "Bangalore", ["Python","TensorFlow","Machine Learning"],   0, 1,  40000,   60000),
]
req_objs = []
for title, dept_code, level_code, et_code, loc_name, skill_names, mn_exp, mx_exp, min_sal, max_sal in reqs_data:
    req, _ = JobRequisition.objects.get_or_create(title=title,
        defaults={
            "department": dept_objs[dept_code], "level": level_objs[level_code],
            "employment_type": et_objs[et_code], "location": loc_objs[loc_name],
            "min_experience": mn_exp, "max_experience": mx_exp,
            "min_salary": min_sal, "max_salary": max_sal,
            "status": "open", "vacancies": 2,
            "description": f"We are looking for an experienced {title} to join our {dept_objs[dept_code].name} team.",
            "posted_by": hr1,
        })
    for sname in skill_names:
        if sname in skill_objs:
            req.required_skills.add(skill_objs[sname])
    req_objs.append(req)

# ─── Candidates ───────────────────────────────────────────────
candidates_data = [
    ("Arjun",   "Mehta",    "arjun.mehta@email.com",    "9876543210", 7.5,  "TCS",       "Python Developer",   ["Python","Django","PostgreSQL"], "portal"),
    ("Sneha",   "Patel",    "sneha.patel@email.com",     "9876543211", 4.0,  "Infosys",   "ML Engineer",        ["Python","TensorFlow","Machine Learning"], "linkedin"),
    ("Rahul",   "Singh",    "rahul.singh@email.com",     "9876543212", 5.0,  "Wipro",     "Frontend Dev",       ["React","TypeScript","JavaScript"], "referral"),
    ("Priyanka","Nair",     "priyanka.nair@email.com",   "9876543213", 8.0,  "Accenture", "DevOps Lead",        ["Kubernetes","AWS","GCP"], "linkedin"),
    ("Kiran",   "Rao",      "kiran.rao@email.com",       "9876543214", 6.0,  "HCL",       "Data Scientist",     ["Python","PyTorch","NLP"], "portal"),
    ("Divya",   "Kumar",    "divya.kumar@email.com",     "9876543215", 3.5,  "Cognizant", "QA Engineer",        ["Python","Java"], "campus"),
    ("Amit",    "Sharma",   "amit.sharma@email.com",     "9876543216", 5.5,  "IBM",       "Java Developer",     ["Java","Spring Boot","PostgreSQL"], "agency"),
    ("Meera",   "Joshi",    "meera.joshi@email.com",     "9876543217", 1.0,  "Fresher",   "AI Intern",          ["Python","TensorFlow"], "campus"),
    ("Vikram",  "Gupta",    "vikram.gupta@email.com",    "9876543218", 9.0,  "Microsoft", "Principal Engineer", ["Python","AWS","Machine Learning"], "linkedin"),
    ("Anjali",  "Desai",    "anjali.desai@email.com",    "9876543219", 4.5,  "Zepto",     "Full Stack Dev",     ["React","Node.js","MongoDB"], "portal"),
]
can_objs = []
for fname, lname, email, phone, exp, company, title, skill_names, source in candidates_data:
    can, _ = Candidate.objects.get_or_create(email=email,
        defaults={
            "first_name": fname, "last_name": lname, "phone": phone,
            "total_experience": exp, "current_company": company,
            "current_title": title, "source": source, "added_by": hr1,
        })
    for sname in skill_names:
        if sname in skill_objs:
            can.skills.add(skill_objs[sname])
    can_objs.append(can)

# ─── Applications ─────────────────────────────────────────────
app_data = [
    (0, 0, "shortlisted",  85.5, True),
    (1, 1, "interviewed",  91.2, True),
    (2, 2, "applied",       None, False),
    (3, 3, "offer_extended",88.0, True),
    (4, 4, "shortlisted",  78.3, True),
    (5, 5, "applied",       None, False),
    (6, 6, "ai_screening",  62.1, False),
    (7, 7, "applied",       None, False),
    (8, 0, "hired",         95.0, True),
    (9, 2, "rejected",      45.2, False),
]
for can_idx, req_idx, status, ai_score, auto_sl in app_data:
    Application.objects.get_or_create(
        candidate=can_objs[can_idx], requisition=req_objs[req_idx],
        defaults={
            "status": status,
            "ai_match_score": ai_score,
            "is_auto_shortlisted": auto_sl,
            "ai_screening_notes": f"AI Score: {ai_score}%" if ai_score else "",
        })

print("✅ Seed data created successfully!")
print(f"   Departments: {Department.objects.count()}")
print(f"   Skills:      {TechSkill.objects.count()}")
print(f"   Jobs:        {JobRequisition.objects.count()}")
print(f"   Candidates:  {Candidate.objects.count()}")
print(f"   Applications:{Application.objects.count()}")
print("\n🔑 Credentials:")
print("   Admin → admin / Admin@1234")
print("   HR    → priya.sharma / HR@1234")
