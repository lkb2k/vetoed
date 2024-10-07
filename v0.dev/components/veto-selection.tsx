"use client"

import { useState, useEffect, KeyboardEvent, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'

type Person = {
  name: string
  choice: string
}

type Stage = 'input' | 'veto' | 'winner' | 'choices';

export function VetoSelection() {
  const [people, setPeople] = useState<Person[]>([])
  const [currentName, setCurrentName] = useState('')
  const [currentChoice, setCurrentChoice] = useState('')
  const [stage, setStage] = useState<Stage>('input')
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0)
  const [remainingChoices, setRemainingChoices] = useState<string[]>([])
  const [winner, setWinner] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  const addPerson = () => {
    if (currentName.trim() && currentChoice.trim()) {
      setPeople([...people, { name: currentName, choice: currentChoice }])
      setCurrentName('')
      setCurrentChoice('')
      nameInputRef.current?.focus()
    }
  }

  const shufflePeople = () => {
    setPeople([...people].sort(() => Math.random() - 0.5))
  }

  const handleVeto = (choice: string) => {
    const newRemainingChoices = remainingChoices.filter(c => c !== choice)
    setRemainingChoices(newRemainingChoices)
    if (newRemainingChoices.length === 1) {
      setWinner(newRemainingChoices[0])
      setStage('winner')
    } else {
      setCurrentPersonIndex((currentPersonIndex + 1) % people.length)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  const resetGame = () => {
    setPeople([])
    setCurrentName('')
    setCurrentChoice('')
    setStage('input') // Changed from 'names' to 'input'
    setCurrentPersonIndex(0)
    setRemainingChoices([])
    setWinner('')
  }

  useEffect(() => {
    if (stage === 'choices') {
      shufflePeople()
    }
  }, [stage])

  const startVetoProcess = () => {
    shufflePeople();
    setStage('veto');
    setCurrentPersonIndex(0);
    setRemainingChoices(people.map(p => p.choice));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#0d1b2a' }}>
      <Card className="w-full max-w-md" style={{ backgroundColor: '#1b263b' }}>
        <CardContent className="p-6">
          {stage === 'input' && (
            <div className="space-y-4">
              <Input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, () => {/* Do nothing, let it focus on textarea */})}
                placeholder="Voter"
                className="w-full text-xl p-6 h-20"
                style={{ backgroundColor: '#415a77', color: '#e0e1dd' }}
                ref={nameInputRef}
              />
              <textarea
                value={currentChoice}
                onChange={(e) => setCurrentChoice(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addPerson)}
                placeholder="Option"
                className="w-full text-xl p-6 h-40 resize-none rounded-md"
                style={{ backgroundColor: '#415a77', color: '#e0e1dd' }}
              />
              <Button onClick={addPerson} className="w-full text-xl p-8 h-20" style={{ backgroundColor: '#778da9', color: '#0d1b2a' }}>
                Add Vote
              </Button>
            </div>
          )}

          {stage === 'veto' && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#e0e1dd' }}>
                {people[currentPersonIndex].name}, what's your veto?
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {remainingChoices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleVeto(choice)}
                    className="w-full text-xl p-8 h-20"
                    style={{ backgroundColor: '#778da9', color: '#0d1b2a' }}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {stage === 'winner' && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#e0e1dd' }}>Winner!</h2>
              <AnimatePresence>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="w-full p-8 text-center text-4xl font-bold h-20 flex items-center justify-center"
                  style={{ backgroundColor: '#778da9', color: '#0d1b2a', borderRadius: '0.5rem' }}
                >
                  {winner}
                </motion.div>
              </AnimatePresence>
              <button
                onClick={resetGame}
                className="mt-6 text-lg underline"
                style={{ color: '#e0e1dd' }}
              >
                Reset
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Display entered names and choices */}
      {stage === 'input' && people.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-2xl font-semibold mb-3" style={{ color: '#e0e1dd' }}>Choices so far</h3>
          <ul className="space-y-2 mb-3">
            {people.map((person, index) => (
              <li
                key={index}
                className="bg-opacity-50 rounded p-2 text-lg flex justify-between"
                style={{ backgroundColor: '#415a77', color: '#e0e1dd' }}
              >
                <span>{person.name}</span>
                <span>{person.choice}</span>
              </li>
            ))}
          </ul>
          {people.length > 1 && (
                <Button onClick={startVetoProcess} className="w-full text-xl p-8 h-20" style={{ backgroundColor: '#778da9', color: '#0d1b2a' }}>
                  Lets Veto
                </Button>
              )}
        </div>
      )}
    </div>
  )
}