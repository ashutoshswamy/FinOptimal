'use server';

/**
 * @fileOverview Generates plain-English explanations of factors influencing financial decisions, based on user inputs.
 *
 * - generateFinancialInsights - A function that generates financial insights.
 * - FinancialInsightsInput - The input type for the generateFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the generateFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialInsightsInputSchema = z.object({
  financialSituation: z
    .string()
    .describe('Description of the user financial situation and decision.'),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;

const FinancialInsightsOutputSchema = z.object({
  explanation: z.string().describe('A plain-English explanation of the factors influencing the financial decision, formatted as Markdown.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function generateFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: {schema: FinancialInsightsInputSchema},
  output: {schema: FinancialInsightsOutputSchema},
  prompt: `You are a financial advisor whose job is to explain financial topics in plain English.

  Based on the following financial situation, provide a clear and concise explanation of the key factors influencing this financial decision. Make sure to provide reasoning for your explanation.

  Format your response using Markdown for clear presentation, including headings, bullet points, and bold text where appropriate.

  Financial Situation: {{{financialSituation}}}`,
});

const financialInsightsFlow = ai.defineFlow(
  {
    name: 'financialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
