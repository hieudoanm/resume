use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct ResumeData {
    pub personal: Personal,
    pub contact: Contact,
    pub websites: Websites,
    pub summary: String,
    pub experience: Vec<Experience>,
    pub education: Vec<Education>,
    pub projects: Vec<Project>,
    pub skills: Vec<SkillGroup>,
    pub certifications: Vec<Certification>,
    pub languages: Vec<Language>,
    pub interests: String,
    pub references: Vec<Reference>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Personal {
    pub full_name: String,
    pub job_title: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Contact {
    pub email: String,
    pub phone: String,
    pub address: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Websites {
    pub website: String,
    pub linkedin: String,
    pub github: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Experience {
    pub id: String,
    pub company: String,
    pub role: String,
    pub location: String,
    pub start_date: String,
    pub end_date: String,
    pub description: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Education {
    pub id: String,
    pub school: String,
    pub degree: String,
    pub field: String,
    pub location: String,
    pub start_date: String,
    pub end_date: String,
    pub gpa: String,
    pub description: String,
    pub relevant_subjects: String,
    pub interests: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub organization: String,
    pub description: String,
    pub technologies: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct SkillGroup {
    pub id: String,
    pub category: String,
    pub items: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Certification {
    pub id: String,
    pub name: String,
    pub issuer: String,
    pub date: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Language {
    pub id: String,
    pub name: String,
    pub proficiency: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", default)]
pub struct Reference {
    pub id: String,
    pub name: String,
    pub title: String,
    pub organization: String,
    pub email: String,
}
