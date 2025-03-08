import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function generateDiagnosis(
  symptoms: string,
  duration: string,
  severity: string,
  additionalNotes?: string,
  medicalHistory?: string,
) {
  try {
    const prompt = `
      As a medical AI assistant, analyze the following patient information and provide a preliminary diagnosis:
      
      Symptoms: ${symptoms}
      Duration: ${duration}
      Severity: ${severity}
      ${additionalNotes ? `Additional Notes: ${additionalNotes}` : ""}
      ${medicalHistory ? `Medical History: ${medicalHistory}` : ""}
      
      Please provide:
      1. A preliminary diagnosis
      2. Confidence level (as a percentage)
      3. List of possible conditions
      4. Recommendations for the patient
      
      Format your response as a JSON object with the following structure:
      {
        "diagnosis": "string",
        "confidence": number,
        "possibleConditions": ["string"],
        "recommendations": ["string"]
      }
      
      IMPORTANT: This is a preliminary AI diagnosis and should be verified by a medical professional. Do not include any disclaimers in the JSON output.
    `

    const { text } = await generateText({
      model: google("gemini-pro"),
      prompt,
    })

    // Parse the JSON response
    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating diagnosis:", error)
    throw new Error("Failed to generate AI diagnosis")
  }
}

