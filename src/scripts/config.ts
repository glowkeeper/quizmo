export const numLiveQuestions = 25
export const maxFetchTries = 5
export const maxAnswer = 5
export const maxQuestions = 150
export const maxTime = 10

export const aIPrompt =
  `You are a quiz master requiring ${maxQuestions} reasonably challenging questions for a quiz. Generate ${maxQuestions} general knowledge questions where the answer must be a number between 1 and 25. Ensure an even distributiopn of answers across that 1 - ${maxAnswer} range. Return results as a single JSON object where the first question has key "1", the second "2" and the 150th "150", so that the result looks something like this: { "1": { "question": "How many times have England won the World Cup?", "answer": "1" }, "2": { "question": "How many wise men were there?", "answer": "3" }} and so on. Return nothing but the JSON and ensure the JSON you return is syntactically valid. Finally, do not enclose that valid JSON in` +
  '```json markers.'

export const aIPromptInvalidJSONPt1 =
  'The JSON object you returned is not syntactically valid. I have placed what you returned inbetween json markers: ```json'
export const aIPromptInvalidJSONPt2 =
  '```. Please amend the JSON so it is a single, syntactically valid JSON object. Do not return any other text outside of the JSON object and do not enclose that valid JSON in ```json markers'
