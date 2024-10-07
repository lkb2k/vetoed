"use client"

import { useState, useEffect, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'

type Person = {
  name: string
  choice: string
}

export function VetoSelection() {
  const [people, setPeople] = useState<Person[]>([])
  const [currentName, setCurrentName] = useState('')
  const [currentChoice, setCurrentChoice] = useState('')
  const [stage, setStage] = useState<'names' | 'choices' | 'veto' | 'winner'>('names')
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0)
  const [remainingChoices, setRemainingChoices] = useState<string[]>([])
  const [winner, setWinner] = useState('')

  const addPerson = () => {
    if (currentName.trim()) {
      setPeople([...people, { name: currentName, choice: '' }])
      setCurrentName('')
    }
  }

  const addChoice = () => {
    if (currentChoice.trim()) {
      const updatedPeople = [...people]
      updatedPeople[currentPersonIndex].choice = currentChoice
      setPeople(updatedPeople)
      setCurrentChoice('')
      if (currentPersonIndex < people.length - 1) {
        setCurrentPersonIndex(currentPersonIndex + 1)
      } else {
        shufflePeople()
        setStage('veto')
        setCurrentPersonIndex(0)
        setRemainingChoices(people.map(p => p.choice))
      }
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

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  const resetGame = () => {
    setPeople([])
    setCurrentName('')
    setCurrentChoice('')
    setStage('names')
    setCurrentPersonIndex(0)
    setRemainingChoices([])
    setWinner('')
  }

  useEffect(() => {
    if (stage === 'choices') {
      shufflePeople()
    }
  }, [stage])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#0d1b2a' }}>
      <Card className="w-full max-w-md" style={{ backgroundColor: '#1b263b' }}>
        <CardContent className="p-6">
          {stage === 'names' && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#e0e1dd' }}>Enter Names</h2>
              <Input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addPerson)}
                placeholder="Enter name"
                className="w-full text-xl p-6 h-20"
                style={{ backgroundColor: '#415a77', color: '#e0e1dd' }}
              />
              <Button onClick={addPerson} className="w-full text-xl p-8 h-20" style={{ backgroundColor: '#778da9', color: '#0d1b2a' }}>
                Add Person
              </Button>
              {people.length > 1 && (
                <Button onClick={() => setStage('choices')} className="w-full text-xl p-8 h-20" style={{ backgroundColor: '#778da9', color: '#0d1b2a' }}>
                  Done
                </Button>
              )}
            </div>
          )}

          {stage === 'choices' && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#e0e1dd' }}>
                {people[currentPersonIndex].name}, enter your choice
              </h2>
              <Input
                type="text"
                value={currentChoice}
                onChange={(e) => setCurrentChoice(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addChoice)}
                placeholder="Enter choice"
                className="w-full text-xl p-6 h-20"
                style={{ backgroundColor: '#415a77', color: '#e0e1dd' }}
              />
              <Button onClick={addChoice} className="w-full text-xl p-8 h-20" style={{ backgroundColor: '#778da9', color: '#0d1b2a' }}>
                Submit Choice
              </Button>
            </div>
          )}

          {stage === 'veto' && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#e0e1dd' }}>
                {people[currentPersonIndex].name}, select an option to veto
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
    </div>
  )
}