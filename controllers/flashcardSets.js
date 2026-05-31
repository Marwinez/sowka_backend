const flashcardSetsRouter = require('express').Router()
const FlashcardSet = require('../models/flashcardSet')

flashcardSetsRouter.get('/', (req, res) => {
    FlashcardSet.find({}).then(flashcardSets => {
        res.json(flashcardSets)
    })
})

flashcardSetsRouter.get('/:id', (req, res) => {
    FlashcardSet.findById(req.params.id)
        .then(flashcardSet => {
            if (flashcardSet) {
                res.json(flashcardSet)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

flashcardSetsRouter.post('/', (req, res) => {
    const body = req.body

    const flashcardSet = new FlashcardSet({
        ownerId: body.ownerId,
        title: body.title,
        cards: body.cards,
    })

    flashcardSet.save()
        .then(savedFlashcardSet => {
            res.json(savedFlashcardSet)
        })
        .catch(error => next(error))
})

flashcardSetsRouter.delete('/:id', (req, res) => {
    FlashcardSet.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

flashcardSetsRouter.put('/:id', (req, res) => {
    const { ownerId, title, cards } = req.body

    FlashcardSet.findById(req.params.id)
        .then(flashcardSet => {
            if(!flashcardSet) {
                return res.status(404).end()
            }

            flashcardSet.ownerId = ownerId
            flashcardSet.title = title
            flashcardSet.cards = cards

            return flashcardSet.save().then(updatedFlashcardSet => {
                res.json(updatedFlashcardSet)
            })
        })
        .catch(error => next(error))
})

module.exports = flashcardSetsRouter