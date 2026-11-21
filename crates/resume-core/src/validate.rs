use crate::types::ResumeData;

/// Validates Resume data against the expected schema, returning the first
/// violation found (mirrors the Go implementation's fail-fast behaviour).
pub fn validate(data: &ResumeData) -> Result<(), String> {
    if data.personal.full_name.is_empty() {
        return Err("personal.fullName is required".into());
    }
    if data.contact.email.is_empty() {
        return Err("contact.email is required".into());
    }
    if data.personal.job_title.is_empty() {
        return Err("personal.jobTitle is required".into());
    }

    if data.experience.is_empty() {
        return Err("at least one experience entry is required".into());
    }
    for (i, exp) in data.experience.iter().enumerate() {
        if exp.company.is_empty() {
            return Err(format!("experience[{i}].company is required"));
        }
        if exp.role.is_empty() {
            return Err(format!("experience[{i}].role is required"));
        }
        if exp.start_date.is_empty() {
            return Err(format!("experience[{i}].startDate is required"));
        }
    }

    if data.education.is_empty() {
        return Err("at least one education entry is required".into());
    }
    for (i, edu) in data.education.iter().enumerate() {
        if edu.school.is_empty() {
            return Err(format!("education[{i}].school is required"));
        }
        if edu.degree.is_empty() {
            return Err(format!("education[{i}].degree is required"));
        }
    }

    if data.skills.is_empty() {
        return Err("at least one skill group is required".into());
    }
    for (i, skill) in data.skills.iter().enumerate() {
        if skill.category.is_empty() {
            return Err(format!("skills[{i}].category is required"));
        }
        if skill.items.is_empty() {
            return Err(format!("skills[{i}].items is required"));
        }
    }

    for (i, reference) in data.references.iter().enumerate() {
        if reference.name.is_empty() {
            return Err(format!("references[{i}].name is required"));
        }
        if reference.title.is_empty() {
            return Err(format!("references[{i}].title is required"));
        }
        if reference.organization.is_empty() {
            return Err(format!("references[{i}].organization is required"));
        }
        if reference.email.is_empty() {
            return Err(format!("references[{i}].email is required"));
        }
    }

    Ok(())
}
