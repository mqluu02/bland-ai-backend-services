import axios, { type AxiosResponse } from 'axios';
import type { OpenAIResponse, DateParseResponse } from '@/types';
import type { Environment } from '@/config/environment';
import { getLocaleDateString, getDateDayName, isDateInPast } from '@/utils/datetime';

export class OpenAIService {
  private readonly apiUrl = 'https://api.openai.com/v1/responses';
  
  constructor(private readonly config: Environment) {}

  /**
   * Parse natural language date descriptions into structured dates
   */
  async parseDate(
    dateDescription: string,
    timezone: string = 'America/Edmonton'
  ): Promise<{ date: string; timezone: string }> {
    const dayName = getDateDayName(new Date(), timezone);
    const currentDate = getLocaleDateString(new Date(), timezone);

    const prompt = `Your job is to take vague language like:
- "next Friday"
- "this weekend"
- "tomorrow night"

...and figure out the actual calendar date based on today's date.

Use the following rules when interpreting:

- "Today" = today's actual date
- "Tomorrow" = the next calendar day
- "This [weekday]" or "next [weekday]" = the **next upcoming** occurrence of that weekday, even if it falls within the current calendar week
  - Example: If today is Saturday, April 12, then "next Tuesday" = Tuesday, April 15 (not April 22)
- Specific dates (like "April 21") should be returned directly in ISO 8601 format
- Always return the result in:  
  **Interpreted Date: YYYY-MM-DD**
---------
Today's date is: ${dayName}, ${currentDate}

Return ONLY the date in JSON format like this (don't add any extra characters to format it or display it nicely, just plain JSON)
Make sure not to add any backticks or any other symbols to your output. It should only be JSON.
{
  "date": "YYYY-MM-DD"
}

Do not return anything else. No extra explanation.
----------------
Input: ${dateDescription}
`;

    // Try up to 3 times to get a valid response
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await this.makeOpenAIRequest(prompt);
        const parsedResponse = JSON.parse(
          response.data.output[0].content[0].text
        ) as DateParseResponse;

        // Validate that the date is not in the past
        if (isDateInPast(parsedResponse.date, timezone)) {
          throw new Error('Date is in the past');
        }

        return {
          date: parsedResponse.date,
          timezone,
        };
      } catch (error) {
        if (attempt === 2) {
          // On final attempt, throw the error
          if (error instanceof Error && error.message === 'Date is in the past') {
            throw new Error(
              'The date description specified returns a date in the past which is not acceptable.'
            );
          }
          throw new Error('There was an error parsing the date');
        }
        // Continue to next attempt
      }
    }

    throw new Error('Failed to parse date after 3 attempts');
  }

  /**
   * Make a request to OpenAI API
   */
  private async makeOpenAIRequest(prompt: string): Promise<AxiosResponse<OpenAIResponse>> {
    try {
      return await axios.post<OpenAIResponse>(
        this.apiUrl,
        {
          model: 'gpt-4o',
          input: prompt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.OPENAI_API_KEY}`,
          },
        }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`OpenAI API Error: ${error.message}`);
      }
      throw error;
    }
  }
} 