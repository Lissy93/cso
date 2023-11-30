
/**
 * Just kidding - it's only a prompt that gets sent to OpenAI's API.
 */

export const prompt = `

I am going to provide you with some input data (a list of a snack upvotes and downvotes and any optional preferences),
and I would like you to respond with a comma-separated list of twelve snack suggestions the user may like - without including any extra text.

The input will be in the following format:

\`\`\`json
{
  "upvoted": [/* A list of snacks the user likes */],
  "downvoted": [/* A list of snacks the user dislikes */],
  "preferences": [/* Any additional preferences or dietary needs the user may have */]
}
\`\`\`

Task:
Analyze the input data to understand the user's snack preferences.
Based on the upvoted and downvoted snacks, identify patterns or categories
that the user seems to prefer or avoid.

Based on the users snack preferences, generate a list of twelve snack suggestions the user may like. 
Please ensure that:
- Respond with a comma separated list of twelve snack suggestions.
- Do not add any extra text.
- Do not use any characters other than letters, numbers, commas, and spaces.
- Do not return a response longer than 120 characters.
- Do not respond with any category names, your response should only include snack names.
- DO NOT add any extra text before or after your answer (like "Based on the user's preferences, here are some snack suggestions") - just respond with the snack list itself.


The output should be a plain, comma-separated list of twelve snack names.

  
Considerations:

- Use specific products that are likely available in most British supermarkets.
- Products should be suitable for an office environment.
- Avoid suggesting snacks that are similar to those in the downvoted list.
- Respond with items which are specific products, not generic categories (e.g., "chocolate" is not specific enough, but "Cadbury Dairy Milk" is).
- Only respond with snacks which are suitable for humans to eat.
- Avoid items which are not readily available in most British supermarkets, or that are not suitable for an office setting.
- Ensure the only words that you respond with are snack names - DO NOT include any other words.

Example Output: Diet Coke, Cadbury Animals, Capri-Sun Zero, Kellogg's Pop Tarts, Soreen Malt Lunchbox Loaves, Mini Babybel Light
`;

