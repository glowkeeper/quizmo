import { useState, useEffect, type ReactNode } from 'react'

type AnswerGridType = ({questionNumber, onSetAnswer}: AnswerGridProps) => ReactNode 

interface AnswerGridProps {
  questionNumber: number
  onSetAnswer: Function
}

interface Grid {
  size: number
  css: string
}

interface GridData {
  value: number;
  className: string;
}


const gridDefs: Grid = {
  size: 25,
  css: "grid grid-cols-5 gap-2"
}

export const AnswerGrid: AnswerGridType = ({questionNumber, onSetAnswer}) => {

  const [data, setData] = useState<GridData[]>([])
  const [answers, setAnswers] = useState<boolean[]>(Array.from({ length: gridDefs.size + 1}, () => false))  
  const [question, setQuestion] = useState<number>(0)
  
  useEffect(() => {

    const buttonData: GridData[] = Array.from({ length: gridDefs.size }, (_, index) => ({
        value: index + 1,
        className: "grid-button"
    }))
    
    setData(buttonData)

  }, [])

  useEffect(() => {

    setQuestion(questionNumber)

  }, [questionNumber])


  const onNumberSelect = (value: number) => {

    const updatedNumber = answers.map(( _, index) => index === value ? true : false);
    setAnswers(updatedNumber)
    onSetAnswer(value, question)
  }

  return (

      <div className={gridDefs.css}>
        {data.map((button) => (
            <button 
              key={button.value} 
              className={button.className}
              onClick={() => onNumberSelect(button.value)}
            >
              { answers[button.value] ? (

                <div className='grid-text'>{ button.value < 10 ? <>0{button.value}</> : <>{button.value}</> }</div>

              ) : (

                <div className='grid-text-hidden'>00</div>

              )}
            </button>
        ))}
      </div>
  )
}
