import type { Questions } from './setQuestions'

export const shuffle = (array: Questions[]): Questions[] => {
  const thisArray = [...array]
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[thisArray[currentIndex], thisArray[randomIndex]] = [
      thisArray[randomIndex],
      thisArray[currentIndex],
    ]
  }

  return thisArray
}

// Used like so
// let arr: Questions[] = [
//   {
//     question: 'In a game of hearts, what is the total number of hearts and the Queen of Spades?',
//     answer: 14,
//   },
//   {
//     question: 'In a standard game of bowling, how many frames are there?',
//     answer: 10,
//   },
//   {
//     question: 'In a game of Dungeons and Dragons, how many sides does a d20 have?',
//     answer: 20,
//   },
//   {
//     question: 'In a standard layout for a netball court, how many players are there on each team?',
//     answer: 7,
//   },
// ]
// const newArray = shuffle(arr)
// console.log(arr, newArray)
