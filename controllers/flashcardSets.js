const flashcardSetsRouter = require('express').Router()
const FlashcardSet = require('../models/flashcardSet')
const {userExtractor} = require("../utils/middleware");

flashcardSetsRouter.get('/', async (req, res) => {
    const flashcardSets = await FlashcardSet
        .find({}).populate('userId', { username: 1, name: 1 })
    res.json(flashcardSets)
})

flashcardSetsRouter.get('/:id', async (req, res) => {
    const flashcardSet = await FlashcardSet(req.params.id)
    if (flashcardSet) {
        res.json(flashcardSet)
    } else {
        res.status(404).end()
    }
})

flashcardSetsRouter.post('/', userExtractor, async (req, res) => {
    const body = req.body

    const user = req.user

    if (!user) {
        return res.status(400).json({ error: 'userId not valid or missing' })
    }

    const flashcardSet = new FlashcardSet({
        title: body.title,
        cards: body.cards,
        userId: user._id,
    })

    const savedFlashcardSet = await flashcardSet.save()
    console.log("TUTAJ: ", savedFlashcardSet)
    user.flashcardSets = user.flashcardSets.concat(savedFlashcardSet._id)
    await user.save()

    res.status(201).json(savedFlashcardSet)
})

flashcardSetsRouter.delete('/:id', userExtractor, async (req, res) => {
    const user = req.user

    if (!user) {
        return res.status(400).json({ error: 'userId not valid or missing' })
    }

    const flashcardSet = await FlashcardSet.findById(req.params.id)
    if (flashcardSet.userId.toString() === user._id.toString()) {
        await FlashcardSet.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } else {
        res.status(400).json({ error: 'userId not valid' })
    }


})

flashcardSetsRouter.put('/:id', (req, res, next) => {
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