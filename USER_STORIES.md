# 📖 User Stories: Student Experience

## Student Persona

**Name:** Amina  
**Age:** 16  
**Location:** Nairobi, Kenya  
**Grade:** Form 2 (Grade 10)  
**Situation:** Lives with single mother, low income, wants to continue education  
**Goals:** Find scholarships to pay for high school and university  
**Pain Points:** Doesn't know where to look, worried about scams, application process is confusing

---

## User Story 1: First Login & Onboarding

### As a student,
**I want to** complete my profile when I first log in  
**So that** the system can match me with relevant scholarships

### Acceptance Criteria:
- [ ] After sign-up, redirect to profile completion
- [ ] Show progress indicator (e.g., "Step 1 of 5")
- [ ] Collect: Location, Grade, Curriculum, Academic Performance, Financial Situation, Special Circumstances
- [ ] Save progress (can come back later)
- [ ] Show preview of profile before saving
- [ ] After completion, show welcome message with next steps

### User Flow:
```
Sign Up → Email Verification → First Login → 
Profile Completion (5 steps) → Welcome Screen → Dashboard
```

---

## User Story 2: Dashboard Overview

### As a student,
**I want to** see a personalized dashboard when I log in  
**So that** I can quickly see my scholarship matches and next steps

### What Student Sees on Dashboard:

#### Top Section: Welcome & Quick Stats
```
┌─────────────────────────────────────────┐
│ 👋 Karibu, Amina!                       │
│                                         │
│ 📊 Your Scholarship Status:            │
│ • 12 Matches Found                     │
│ • 3 Applications Submitted             │
│ • 2 Deadlines This Month               │
└─────────────────────────────────────────┘
```

#### Main Content: Action Cards
```
┌─────────────────────────────────────────┐
│ 🎯 Quick Actions                        │
│                                         │
│ [Find Scholarships] [View Matches]    │
│ [Track Applications] [Update Profile]  │
└─────────────────────────────────────────┘
```

#### Scholarship Matches Preview
```
┌─────────────────────────────────────────┐
│ 🏆 Your Top Matches (3)                 │
│                                         │
│ 1. Nairobi County Bursary              │
│    Match: 95% | Deadline: Mar 31       │
│    [View Details] [Apply Now]           │
│                                         │
│ 2. Equity Wings to Fly                  │
│    Match: 88% | Deadline: Jan 31       │
│    [View Details] [Apply Now]           │
│                                         │
│ 3. NG-CDF Bursary                       │
│    Match: 82% | Deadline: Feb 15       │
│    [View Details] [Apply Now]           │
│                                         │
│ [View All Matches →]                    │
└─────────────────────────────────────────┘
```

#### Upcoming Deadlines
```
┌─────────────────────────────────────────┐
│ ⏰ Upcoming Deadlines                   │
│                                         │
│ Jan 31 - Equity Wings to Fly           │
│ Feb 15 - NG-CDF Bursary                │
│                                         │
│ [View Calendar] [Set Reminders]        │
└─────────────────────────────────────────┘
```

#### Application Status
```
┌─────────────────────────────────────────┐
│ 📝 My Applications                      │
│                                         │
│ ✅ Submitted (2)                        │
│ ⏳ In Progress (1)                      │
│ 📋 Draft (0)                            │
│                                         │
│ [View All Applications →]               │
└─────────────────────────────────────────┘
```

#### Profile Completeness
```
┌─────────────────────────────────────────┐
│ 👤 Your Profile                         │
│                                         │
│ ████████░░ 80% Complete                │
│                                         │
│ Missing: Preferred field of study       │
│ [Complete Profile →]                    │
└─────────────────────────────────────────┘
```

---

## User Story 3: Find Scholarships

### As a student,
**I want to** find scholarships that match my profile  
**So that** I can apply to opportunities I qualify for

### Acceptance Criteria:
- [ ] Can access from dashboard "Find Scholarships" button
- [ ] Shows matching questionnaire (if profile incomplete)
- [ ] Displays ranked list of matches
- [ ] Shows match score and reasons
- [ ] Can filter by: deadline, amount, type, county
- [ ] Can search by name
- [ ] Can save scholarships to "Interested" list
- [ ] Shows "New" badge for recently added scholarships

### User Flow:
```
Dashboard → Find Scholarships → 
(If profile incomplete) Complete Profile →
View Matches → Filter/Search → 
View Details → Save/Apply
```

---

## User Story 4: View Scholarship Details

### As a student,
**I want to** see detailed information about a scholarship  
**So that** I can decide if I want to apply

### What Student Sees:
- Scholarship name and description
- Provider information
- Eligibility criteria (with match indicators)
- Award amount and coverage
- Application deadline (with countdown)
- Required documents list
- Application steps
- Match score and reasons
- "Apply Now" or "Get Application Form" button
- "Save to Interested" button
- "Share" button

---

## User Story 5: Download Application Form

### As a student,
**I want to** download the application form for a scholarship  
**So that** I can fill it out and submit

### Acceptance Criteria:
- [ ] Can download form as PDF
- [ ] Can view form online
- [ ] Form is pre-filled with profile data (where applicable)
- [ ] Shows required documents checklist
- [ ] Provides document templates
- [ ] Shows submission instructions
- [ ] Can track form download

### User Flow:
```
Scholarship Details → Get Application Form →
Choose Format (PDF/Online) → Download/View →
Fill Form → Submit (if online) or Print (if PDF)
```

---

## User Story 6: Track Applications

### As a student,
**I want to** track my scholarship applications  
**So that** I know which ones I've applied to and their status

### Acceptance Criteria:
- [ ] See all applications in one place
- [ ] Filter by status (Interested, Applied, Accepted, Rejected)
- [ ] See application date and deadline
- [ ] See current status
- [ ] Get deadline reminders
- [ ] Can mark as "Accepted" or "Rejected" when notified
- [ ] Can add notes to each application
- [ ] Can view application details

### Status Types:
- **Interested** - Saved but not applied
- **Draft** - Started application but not submitted
- **Applied** - Submitted application
- **Under Review** - Provider is reviewing
- **Accepted** - Got the scholarship! 🎉
- **Rejected** - Not selected
- **Withdrawn** - Student withdrew application

---

## User Story 7: Get Deadline Reminders

### As a student,
**I want to** receive reminders about upcoming deadlines  
**So that** I don't miss application opportunities

### Acceptance Criteria:
- [ ] See upcoming deadlines on dashboard
- [ ] Get email reminders (7 days, 3 days, 1 day before)
- [ ] Get in-app notifications
- [ ] Can set custom reminders
- [ ] Can dismiss reminders
- [ ] Shows countdown timer

---

## User Story 8: Update Profile

### As a student,
**I want to** update my profile information  
**So that** I get better matches as my situation changes

### Acceptance Criteria:
- [ ] Can access profile from dashboard
- [ ] Can edit all profile fields
- [ ] Changes trigger re-matching
- [ ] Shows "New matches available" notification
- [ ] Can see profile completeness percentage
- [ ] Can see what's missing

---

## User Story 9: View Document Templates

### As a student,
**I want to** download document templates  
**So that** I know what documents I need and how to get them

### Acceptance Criteria:
- [ ] Can access templates from scholarship details
- [ ] Can download templates (PDF, DOCX)
- [ ] Templates are Kenya-specific
- [ ] Includes instructions on where to get documents
- [ ] Shows example filled templates
- [ ] Can request help if confused

### Templates Needed:
- Birth Certificate Request Form
- Income Declaration Template
- Recommendation Letter Template
- Application Letter Template
- School Admission Letter Request

---

## User Story 10: Get Application Help

### As a student,
**I want to** get help with the application process  
**So that** I can successfully apply for scholarships

### Acceptance Criteria:
- [ ] Can access help from any page
- [ ] AI chatbot answers questions
- [ ] Step-by-step guides for each scholarship
- [ ] FAQ section
- [ ] Can contact support
- [ ] Help is in Kiswahili and English

---

## User Story 11: View Application History

### As a student,
**I want to** see my application history  
**So that** I can learn from past applications and track my progress

### Acceptance Criteria:
- [ ] See all past applications
- [ ] Filter by year, status, scholarship type
- [ ] See success rate (accepted/applied)
- [ ] Can export application history
- [ ] Shows trends over time

---

## User Story 12: Save Scholarships

### As a student,
**I want to** save scholarships I'm interested in  
**So that** I can come back to them later

### Acceptance Criteria:
- [ ] Can save from scholarship details page
- [ ] Can view saved scholarships
- [ ] Can organize into folders/categories
- [ ] Can add notes to saved scholarships
- [ ] Can remove from saved list
- [ ] Saved scholarships show on dashboard

---

## User Story 13: Compare Scholarships

### As a student,
**I want to** compare multiple scholarships side-by-side  
**So that** I can decide which ones to prioritize

### Acceptance Criteria:
- [ ] Can select multiple scholarships
- [ ] Shows comparison table
- [ ] Compares: amount, deadline, requirements, match score
- [ ] Can export comparison
- [ ] Can apply to multiple from comparison view

---

## User Story 14: Get Personalized Recommendations

### As a student,
**I want to** get personalized scholarship recommendations  
**So that** I discover opportunities I might have missed

### Acceptance Criteria:
- [ ] Recommendations based on profile
- [ ] "You might also qualify for..." section
- [ ] Recommendations update as profile changes
- [ ] Can dismiss recommendations
- [ ] Shows why each is recommended

---

## User Story 15: Offline Access

### As a student,
**I want to** access my saved scholarships and applications offline  
**So that** I can work on applications even without internet

### Acceptance Criteria:
- [ ] Can view saved scholarships offline
- [ ] Can view downloaded forms offline
- [ ] Can draft applications offline
- [ ] Data syncs when online
- [ ] Shows offline indicator
- [ ] Can queue actions for when online

---

## Feature Priority Matrix

### Must-Have (MVP):
1. ✅ Dashboard with matches
2. ✅ View scholarship details
3. ✅ Download application forms
4. ✅ Track applications
5. ✅ Update profile
6. ✅ Deadline reminders

### Should-Have (Phase 2):
7. ⚠️ Document templates
8. ⚠️ Application help (chatbot)
9. ⚠️ Save scholarships
10. ⚠️ Profile completeness indicator

### Nice-to-Have (Phase 3):
11. ❓ Compare scholarships
12. ❓ Application history analytics
13. ❓ Personalized recommendations
14. ❓ Advanced filtering

---

## Dashboard Layout (Detailed)

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | Search | Notifications | Profile        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Welcome Section                                  │   │
│  │ 👋 Karibu, Amina!                               │   │
│  │                                                  │   │
│  │ Quick Stats:                                     │   │
│  │ • 12 Matches | 3 Applied | 2 Deadlines          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Find        │  │ Track        │  │ Update       │  │
│  │ Scholarships│  │ Applications │  │ Profile      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🏆 Top Matches (3)                              │   │
│  │                                                  │   │
│  │ [Match Card 1] [Match Card 2] [Match Card 3]   │   │
│  │                                                  │   │
│  │ [View All Matches →]                            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ ⏰ Deadlines     │  │ 📝 Applications             │ │
│  │                  │  │                             │ │
│  │ Jan 31 - Equity │  │ ✅ Submitted: 2             │ │
│  │ Feb 15 - NG-CDF │  │ ⏳ In Progress: 1           │ │
│  │                  │  │                             │ │
│  │ [View All →]     │  │ [View All →]                │ │
│  └──────────────────┘  └──────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 👤 Profile Completeness                         │   │
│  │ ████████░░ 80% Complete                         │   │
│  │ Missing: Field of study                         │   │
│  │ [Complete →]                                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## User Journey Map

### First-Time User:
```
Sign Up → Email Verification → 
First Login → Profile Setup (5 min) → 
View Matches → Explore Scholarships → 
Save Favorites → Download Forms → 
Start Applications
```

### Returning User:
```
Login → Dashboard → 
Check New Matches → 
Review Deadlines → 
Track Applications → 
Update Profile (if needed)
```

### Active User (Applying):
```
Login → Dashboard → 
View Saved Scholarships → 
Check Deadlines → 
Download Forms → 
Fill & Submit → 
Track Status → 
Mark Outcomes
```

---

## Success Metrics

### Engagement:
- Daily active users
- Time spent on platform
- Scholarships viewed per session
- Applications started vs completed

### Conversion:
- Profile completion rate
- Match-to-application rate
- Application completion rate
- Save-to-apply rate

### Satisfaction:
- User ratings
- Feature usage
- Support requests
- Success stories

---

## Next Steps

1. ✅ Define user stories
2. ⚠️ Design dashboard UI
3. ⚠️ Build dashboard components
4. ⚠️ Implement features in priority order
5. ⚠️ Test with real students
6. ⚠️ Iterate based on feedback


