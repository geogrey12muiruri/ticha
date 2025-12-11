# 🎓 Academic Profile Design: LinkedIn-Style

## Philosophy

**No Financial Information** - Financial details are handled in actual scholarship applications, not in the profile. This:
- Protects student privacy
- Reduces barriers to entry
- Focuses on academic merit
- Aligns with LinkedIn-style professional profiles

## Profile Structure

### 1. **Location** (Basic)
- County (required)
- Constituency (optional)
- **Purpose**: Location-specific opportunities

### 2. **Academic Information** (Core)
- Current Grade/Form (1-12)
- Curriculum (8-4-4 or CBC)
- Current School (optional)
- School Type (optional)
- **Purpose**: Academic level matching

### 3. **Academic Performance** (Qualifications)
- KCPE Score (if completed)
- KCSE Grade (if completed)
- Current Average Grade
- **Purpose**: Merit-based matching

### 4. **Career Interests** (Goals)
- Primary Career Interest (required)
- Preferred Field of Study
- Additional Career Goals (multiple)
- **Purpose**: Career-aligned opportunities

### 5. **Skills & Learning** (Development)
- Current Skills (what student knows)
- Skills Wanted (what student wants to learn)
- Learning Goals
- Bio/Summary
- **Purpose**: Skills-based course/bootcamp matching

## Matching Logic

### Updated Weights (Academic-Focused)

1. **Academic Match** (35 points)
   - Grade level compatibility
   - Curriculum match
   - KCPE/KCSE scores
   - Current performance

2. **Location Match** (20 points)
   - County-specific opportunities
   - Regional availability

3. **Career/Field Match** (20 points)
   - Career interest alignment
   - Field of study match
   - **Replaces financial matching**

4. **Skills Match** (15 points)
   - Current skills compatibility
   - Skills wanted alignment
   - **Replaces special circumstances**

5. **Field Match** (10 points)
   - Subject/field preferences

## What Gets Matched

### Scholarships
- Academic requirements (grade, scores)
- Location (county)
- Field of study
- Career interests

### Bootcamps
- Career interests (primary)
- Skills wanted
- Current skills (prerequisites)
- Learning goals

### Learning Opportunities
- Career interests
- Skills gap (wanted but don't have)
- Learning goals
- Format preferences

## Benefits

1. **Privacy**: No sensitive financial data
2. **Merit-Based**: Focus on academic achievement
3. **Career-Focused**: Aligns with student goals
4. **Skills Development**: Matches courses to skills needed
5. **Professional**: LinkedIn-style profile

## Example Profile

```typescript
{
  county: "Nairobi",
  curriculum: "8-4-4",
  grade: 10,
  currentSchool: "Nairobi High School",
  kcpeScore: 380,
  averageGrade: "B+",
  careerInterest: "Software Engineering",
  preferredField: "Computer Science",
  careerGoals: ["Full-Stack Developer", "Data Scientist"],
  currentSkills: ["Mathematics", "English", "Basic Computer Skills"],
  skillsWanted: ["JavaScript", "Python", "Web Development"],
  learningGoals: ["Build web applications", "Learn data analysis"],
  bio: "Passionate about technology and coding..."
}
```

## Matching Examples

### Example 1: Software Engineering Bootcamp
**Profile**: Career interest = "Software Engineering", Skills wanted = ["JavaScript", "Python"]
**Match**: 85% - Strong career alignment, skills wanted match

### Example 2: County Bursary
**Profile**: County = "Nairobi", Grade = 10, KCPE = 380
**Match**: 75% - Location match, academic requirements met

### Example 3: Free Python Course
**Profile**: Skills wanted = ["Python"], Career interest = "Data Science"
**Match**: 90% - Perfect skills gap match, career aligned

## Removed Fields

❌ **Financial Information**:
- familyIncome
- orphanStatus
- singleParent
- disability

**Why Removed:**
- Privacy concerns
- Handled in actual applications
- Not needed for initial matching
- Reduces barriers

## New Fields

✅ **Academic & Career**:
- subjects (subjects student is taking)
- careerGoals (multiple career interests)
- certifications (certifications earned)
- achievements (academic achievements)
- extracurriculars (activities)
- languages (languages spoken)
- bio (professional summary)

## Database Schema Update

```sql
-- Student profiles table (academic-focused)
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  
  -- Location
  county VARCHAR(100),
  constituency VARCHAR(100),
  
  -- Academic
  grade INTEGER,
  curriculum VARCHAR(10),
  current_school VARCHAR(255),
  school_type VARCHAR(50),
  
  -- Performance
  kcpe_score INTEGER,
  kcse_grade VARCHAR(5),
  average_grade VARCHAR(5),
  subjects TEXT[],
  
  -- Career
  career_interest VARCHAR(255),
  preferred_field VARCHAR(255),
  career_goals TEXT[],
  
  -- Skills
  current_skills TEXT[],
  skills_wanted TEXT[],
  learning_goals TEXT[],
  certifications TEXT[],
  
  -- Additional
  achievements TEXT[],
  extracurriculars TEXT[],
  languages TEXT[],
  bio TEXT,
  
  -- Preferences
  preferred_format VARCHAR(50),
  time_availability VARCHAR(50),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Migration Path

1. ✅ Update `ScholarshipProfile` type
2. ✅ Redesign `ProfileCompletionWizard`
3. ✅ Update matching service
4. ⚠️ Update database schema
5. ⚠️ Migrate existing profiles (if any)

## Summary

✅ **Academic-Focused**: Qualifications and achievements
✅ **Career-Aligned**: Interests and goals
✅ **Skills-Based**: Current and wanted skills
✅ **Privacy-First**: No financial information
✅ **Professional**: LinkedIn-style profile

The profile is now a **professional academic profile** that focuses on what students can do and want to achieve, not their financial situation.


