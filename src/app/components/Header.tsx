'use client'

import Image, { StaticImageData } from 'next/image'

import logo from '../../assets/images/quizmoLogo.png'

export const Header = () => {
  return (
    <div className="header">
      <div className="flex flex-row items-center justify-center w-1/2">
        <Image className="logo" src={logo as StaticImageData} alt="Quizmo Logo" />
      </div>
      <div className="flex flex-row items-center justify-center w-1/2">
        <button
          className="btn bg-button text-button-foreground border-button-border cursor-pointer hover:bg-button-hover active:shadow-xl"
          onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}
        >
          <p className="font-bold">?</p>
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h2>Quizmo</h2>
            <p>Quizmo is rapid-fire 25 questions. The answers are anything from 1 to 25.</p>
            <p>
              You input your answer by selecting a button on a 5x5 grid, which runs from left to
              right and top to bottom. The top left button represents 1. The bottom right button
              represents 25.
            </p>
            <p>
              You have just 10 seconds to decide on each answer, and the quicker you are, the higher
              you can score.
            </p>
            <p>
              <b>Think fast and react quickly!</b>
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  )
}
