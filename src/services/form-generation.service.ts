/**
 * Form Generation Service
 * AI-powered scholarship form generation
 */

import { AIService } from './ai.service'

export interface FormField {
  type: 'text' | 'email' | 'number' | 'date' | 'file' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  name: string
  required: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
  options?: string[]
  placeholder?: string
  helpText?: string
  accept?: string // For file fields
}

export interface FormSection {
  name: string
  description?: string
  fields: FormField[]
}

export interface FormStructure {
  title: string
  description?: string
  sections: FormSection[]
  instructions?: string
  footer?: string
}

export class FormGenerationService {
  /**
   * Generate form using AI
   */
  static async generateForm(
    scholarshipDescription: string,
    requirements: string[],
    eligibility?: any
  ): Promise<FormStructure> {
    const prompt = `You are a scholarship form generator. Create a comprehensive application form in JSON format.

Scholarship Description:
${scholarshipDescription}

Requirements:
${requirements.join('\n')}

${eligibility ? `Eligibility Criteria:\n${JSON.stringify(eligibility, null, 2)}` : ''}

Generate a complete application form with the following structure:

1. Personal Information Section
   - Full name, date of birth, gender, ID number, contact info

2. Academic Information Section
   - Current grade, curriculum, school name, KCPE/KCSE scores

3. Financial Information Section (if needed)
   - Family income, number of dependents, financial need

4. Documents Section
   - File upload fields for required documents

5. Personal Statement Section (if needed)
   - Essay or statement field

Return ONLY valid JSON in this exact format:
{
  "title": "Scholarship Application Form",
  "description": "Brief description",
  "sections": [
    {
      "name": "Section Name",
      "description": "Optional description",
      "fields": [
        {
          "type": "text|email|number|date|file|textarea|select|checkbox|radio",
          "label": "Field Label",
          "name": "field_name",
          "required": true|false,
          "validation": {
            "minLength": 3,
            "maxLength": 100
          },
          "placeholder": "Optional placeholder",
          "helpText": "Optional help text"
        }
      ]
    }
  ],
  "instructions": "Form instructions",
  "footer": "Footer text"
}

Important:
- Use appropriate field types (file for documents, textarea for essays)
- Mark required fields as required: true
- Add validation rules where appropriate
- Use clear, descriptive labels
- Include help text for complex fields
- Return ONLY JSON, no markdown, no explanations`

    try {
      const response = await AIService.generateResponse({
        message: prompt,
        context: {
          language: 'en',
          curriculum: 'CBC',
        },
      })

      // Extract JSON from response (AI might add markdown)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const formStructure = JSON.parse(jsonMatch[0]) as FormStructure

      // Validate structure
      this.validateFormStructure(formStructure)

      return formStructure
    } catch (error: any) {
      console.error('Error generating form:', error)
      throw new Error(`Failed to generate form: ${error.message}`)
    }
  }

  /**
   * Validate form structure
   */
  private static validateFormStructure(form: FormStructure): void {
    if (!form.title) {
      throw new Error('Form must have a title')
    }

    if (!form.sections || form.sections.length === 0) {
      throw new Error('Form must have at least one section')
    }

    for (const section of form.sections) {
      if (!section.name) {
        throw new Error('Section must have a name')
      }

      if (!section.fields || section.fields.length === 0) {
        throw new Error('Section must have at least one field')
      }

      for (const field of section.fields) {
        if (!field.type || !field.label || !field.name) {
          throw new Error('Field must have type, label, and name')
        }
      }
    }
  }

  /**
   * Extract form structure from uploaded document (Future: OCR + NLP)
   */
  static async extractFromDocument(fileUrl: string): Promise<FormStructure> {
    // TODO: Implement OCR + NLP extraction
    // For now, return error
    throw new Error('Document extraction not yet implemented')
  }

  /**
   * Convert form structure to PDF (Future)
   */
  static async generatePDF(form: FormStructure): Promise<Buffer> {
    // TODO: Implement PDF generation
    // Use library like pdfkit or puppeteer
    throw new Error('PDF generation not yet implemented')
  }

  /**
   * Convert form structure to HTML form
   */
  static generateHTMLForm(form: FormStructure): string {
    let html = `
      <form id="scholarship-form" class="space-y-6">
        <h2 class="text-2xl font-bold mb-4">${form.title}</h2>
        ${form.description ? `<p class="text-muted-foreground mb-6">${form.description}</p>` : ''}
    `

    for (const section of form.sections) {
      html += `
        <div class="form-section border rounded-lg p-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">${section.name}</h3>
          ${section.description ? `<p class="text-sm text-muted-foreground mb-4">${section.description}</p>` : ''}
      `

      for (const field of section.fields) {
        html += this.generateFieldHTML(field)
      }

      html += `</div>`
    }

    if (form.instructions) {
      html += `<div class="instructions bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6"><p>${form.instructions}</p></div>`
    }

    html += `
        <button type="submit" class="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold">
          Submit Application
        </button>
      </form>
    `

    return html
  }

  /**
   * Generate HTML for a single field
   */
  private static generateFieldHTML(field: FormField): string {
    const required = field.required ? 'required' : ''
    const requiredStar = field.required ? '<span class="text-red-500">*</span>' : ''

    switch (field.type) {
      case 'textarea':
        return `
          <div class="form-field mb-4">
            <label class="block text-sm font-medium mb-2">
              ${field.label} ${requiredStar}
            </label>
            <textarea
              name="${field.name}"
              ${required}
              ${field.validation?.minLength ? `minlength="${field.validation.minLength}"` : ''}
              ${field.validation?.maxLength ? `maxlength="${field.validation.maxLength}"` : ''}
              placeholder="${field.placeholder || ''}"
              class="w-full p-3 border rounded-lg"
              rows="4"
            ></textarea>
            ${field.helpText ? `<p class="text-xs text-muted-foreground mt-1">${field.helpText}</p>` : ''}
          </div>
        `

      case 'file':
        return `
          <div class="form-field mb-4">
            <label class="block text-sm font-medium mb-2">
              ${field.label} ${requiredStar}
            </label>
            <input
              type="file"
              name="${field.name}"
              ${required}
              ${field.accept ? `accept="${field.accept}"` : ''}
              class="w-full p-3 border rounded-lg"
            />
            ${field.helpText ? `<p class="text-xs text-muted-foreground mt-1">${field.helpText}</p>` : ''}
          </div>
        `

      case 'select':
        return `
          <div class="form-field mb-4">
            <label class="block text-sm font-medium mb-2">
              ${field.label} ${requiredStar}
            </label>
            <select
              name="${field.name}"
              ${required}
              class="w-full p-3 border rounded-lg"
            >
              <option value="">Select ${field.label}</option>
              ${field.options?.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
            ${field.helpText ? `<p class="text-xs text-muted-foreground mt-1">${field.helpText}</p>` : ''}
          </div>
        `

      case 'checkbox':
      case 'radio':
        return `
          <div class="form-field mb-4">
            <label class="block text-sm font-medium mb-2">
              ${field.label} ${requiredStar}
            </label>
            <div class="space-y-2">
              ${field.options?.map(opt => `
                <label class="flex items-center space-x-2">
                  <input
                    type="${field.type}"
                    name="${field.name}"
                    value="${opt}"
                    ${required}
                    class="rounded"
                  />
                  <span>${opt}</span>
                </label>
              `).join('')}
            </div>
            ${field.helpText ? `<p class="text-xs text-muted-foreground mt-1">${field.helpText}</p>` : ''}
          </div>
        `

      default:
        return `
          <div class="form-field mb-4">
            <label class="block text-sm font-medium mb-2">
              ${field.label} ${requiredStar}
            </label>
            <input
              type="${field.type}"
              name="${field.name}"
              ${required}
              ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
              ${field.validation?.minLength ? `minlength="${field.validation.minLength}"` : ''}
              ${field.validation?.maxLength ? `maxlength="${field.validation.maxLength}"` : ''}
              ${field.validation?.pattern ? `pattern="${field.validation.pattern}"` : ''}
              class="w-full p-3 border rounded-lg"
            />
            ${field.helpText ? `<p class="text-xs text-muted-foreground mt-1">${field.helpText}</p>` : ''}
          </div>
        `
    }
  }
}


