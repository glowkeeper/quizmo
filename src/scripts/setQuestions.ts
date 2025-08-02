import { fetchData } from './fetchData'
import type { Choices } from './fetchData'

import {
  maxFetchTries,
  maxAnswer,
  aIPrompt,
  aIPromptInvalidJSONPt1,
  aIPromptInvalidJSONPt2,
} from '../config'

type ParseQuestions = (unParsed: string) => DataReturned
type ParseGeneratedQuestions = (questions: Choices[]) => DataReturned
type GenerateQuestions = () => Promise<DataReturned>

export interface Questions {
  question: string
  answer: string
  game: string
}

export interface DataReturned {
  unParsed: string
  parsed: Questions[]
}

export const parseQuestions: ParseQuestions = (unParsed) => {
  const questions: DataReturned = {
    unParsed: unParsed,
    parsed: [],
  }

  try {
    const theseQuestions = JSON.parse(unParsed)
    //console.log('got these questions', theseQuestions)

    Object.keys(theseQuestions).forEach((question) => {
      //console.log('this question', question)

      const thisAnswer = Number(theseQuestions[question].answer)
      if (Number(thisAnswer) >= 1 && Number(thisAnswer) <= maxAnswer) {
        questions.parsed.push(theseQuestions[question])
      }
    })
  } catch (e: any) {
    console.log('Caught: ' + e.message)
  }

  return questions
}

const parseGeneratedQuestions: ParseGeneratedQuestions = (questions) => {
  //console.log('Got Questions', questions)
  const theseQuestions = questions[0].message?.content
  const parsedQuestions = parseQuestions(theseQuestions)
  //console.log('Parsed Questions', parsedQuestions)
  return parsedQuestions
}

export const generateQuestions: GenerateQuestions = async () => {
  //meta-llama/llama-4-maverick:free
  //deepseek/deepseek-r1-0528-qwen3-8b:free
  // qwen/qwen3-32b:free

  //console.log('key', process.env.OPENROUTER_KEY)

  let data: DataReturned = {
    unParsed: '',
    parsed: [],
  }
  let numFetchTries = 0

  let content = aIPrompt

  while (data.parsed.length == 0 && numFetchTries < maxFetchTries) {
    numFetchTries++
    const fetchOptions: object = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://quizmo.fun',
        'X-Title': 'Quizmo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: 'user',
            content: content,
          },
        ],
      }),
    }

    const fetchParams = {
      url: process.env.OPENROUTER_URL as string,
      fetchOptions: fetchOptions,
    }

    const fetchedChoices = await fetchData(fetchParams)
    const thisData = parseGeneratedQuestions(fetchedChoices)

    data = {
      unParsed: thisData.unParsed,
      parsed: thisData.parsed,
    }

    content = aIPromptInvalidJSONPt1 + data.unParsed + aIPromptInvalidJSONPt2
  }

  return data
}
