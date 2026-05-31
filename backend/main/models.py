"""
main/models.py
Primary business logic: Job Requisitions, Candidates, Applications.
"""

from django.db import models
from django.contrib.auth.models import User
from core.models import BaseModel
from master.models import Department, TechSkill, JobLevel, EmploymentType, Location, RejectionReason


class JobRequisition(BaseModel):
    """A job opening raised by a department."""

    STATUS_CHOICES = [
        ("draft",     "Draft"),
        ("open",      "Open"),
        ("on_hold",   "On Hold"),
        ("closed",    "Closed"),
        ("filled",    "Filled"),
    ]

    job_id          = models.CharField(max_length=20, unique=True, editable=False)
    title           = models.CharField(max_length=200)
    department      = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="requisitions")
    level           = models.ForeignKey(JobLevel, on_delete=models.PROTECT, related_name="requisitions")
    employment_type = models.ForeignKey(EmploymentType, on_delete=models.PROTECT, related_name="requisitions")
    location        = models.ForeignKey(Location, on_delete=models.PROTECT, related_name="requisitions")
    required_skills = models.ManyToManyField(TechSkill, related_name="requisitions", blank=True)
    description     = models.TextField()
    responsibilities = models.TextField(blank=True)
    min_experience  = models.PositiveIntegerField(default=0)
    max_experience  = models.PositiveIntegerField(default=20)
    min_salary      = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    max_salary      = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    vacancies       = models.PositiveIntegerField(default=1)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    ai_score_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=70.00,
                                              help_text="Minimum AI match score (%) for auto-shortlist")
    posted_by       = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="requisitions_posted")
    target_date     = models.DateField(null=True, blank=True)
    ai_optimized_jd = models.TextField(blank=True, help_text="AI-optimized job description")

    class Meta:
        db_table  = "main_job_requisition"
        ordering  = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.job_id:
            last = JobRequisition.objects.order_by("-id").first()
            num  = (last.id + 1) if last else 1
            self.job_id = f"JR-{num:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.job_id} — {self.title}"


class Candidate(BaseModel):
    """A job seeker / applicant profile."""

    GENDER_CHOICES  = [("M", "Male"), ("F", "Female"), ("O", "Other"), ("N", "Prefer not to say")]
    SOURCE_CHOICES  = [
        ("portal",   "Job Portal"),
        ("linkedin", "LinkedIn"),
        ("referral", "Referral"),
        ("campus",   "Campus Recruitment"),
        ("agency",   "Agency"),
        ("direct",   "Direct Application"),
        ("ai_sourced","AI Sourced"),
    ]

    candidate_id    = models.CharField(max_length=20, unique=True, editable=False)
    first_name      = models.CharField(max_length=100)
    last_name       = models.CharField(max_length=100)
    email           = models.EmailField(unique=True)
    phone           = models.CharField(max_length=15)
    gender          = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    date_of_birth   = models.DateField(null=True, blank=True)
    current_location = models.CharField(max_length=200, blank=True)
    current_company = models.CharField(max_length=200, blank=True)
    current_title   = models.CharField(max_length=200, blank=True)
    total_experience = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    skills          = models.ManyToManyField(TechSkill, related_name="candidates", blank=True)
    resume          = models.FileField(upload_to="resumes/", null=True, blank=True)
    resume_text     = models.TextField(blank=True, help_text="Extracted resume text for AI processing")
    linkedin_url    = models.URLField(blank=True)
    github_url      = models.URLField(blank=True)
    portfolio_url   = models.URLField(blank=True)
    source          = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="portal")
    ai_profile_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                            help_text="Overall AI-assessed profile strength")
    notes           = models.TextField(blank=True)
    added_by        = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="candidates_added")

    class Meta:
        db_table  = "main_candidate"
        ordering  = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.candidate_id:
            last = Candidate.objects.order_by("-id").first()
            num  = (last.id + 1) if last else 1
            self.candidate_id = f"CAN-{num:05d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.candidate_id} — {self.first_name} {self.last_name}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Application(BaseModel):
    """Links a Candidate to a JobRequisition."""

    STATUS_CHOICES = [
        ("applied",         "Applied"),
        ("ai_screening",    "AI Screening"),
        ("shortlisted",     "Shortlisted"),
        ("interview_scheduled", "Interview Scheduled"),
        ("interviewed",     "Interviewed"),
        ("offer_extended",  "Offer Extended"),
        ("hired",           "Hired"),
        ("rejected",        "Rejected"),
        ("withdrawn",       "Withdrawn"),
    ]

    application_id  = models.CharField(max_length=20, unique=True, editable=False)
    candidate       = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="applications")
    requisition     = models.ForeignKey(JobRequisition, on_delete=models.CASCADE, related_name="applications")
    status          = models.CharField(max_length=30, choices=STATUS_CHOICES, default="applied")
    applied_date    = models.DateField(auto_now_add=True)
    cover_letter    = models.TextField(blank=True)

    # AI Screening fields
    ai_match_score  = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                                          help_text="AI computed match score (0-100)")
    ai_screening_notes = models.TextField(blank=True)
    ai_screened_at  = models.DateTimeField(null=True, blank=True)
    is_auto_shortlisted = models.BooleanField(default=False)

    # Manual review
    reviewed_by     = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                         related_name="applications_reviewed")
    reviewer_notes  = models.TextField(blank=True)
    rejection_reason = models.ForeignKey(RejectionReason, on_delete=models.SET_NULL,
                                          null=True, blank=True, related_name="applications")

    class Meta:
        db_table        = "main_application"
        ordering        = ["-created_at"]
        unique_together = ["candidate", "requisition"]

    def save(self, *args, **kwargs):
        if not self.application_id:
            last = Application.objects.order_by("-id").first()
            num  = (last.id + 1) if last else 1
            self.application_id = f"APP-{num:05d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.application_id} — {self.candidate} → {self.requisition}"
