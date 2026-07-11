const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    front: String,
    back: String
})

cardSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
    }
})

const flashcardSetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    cards: [cardSchema]
})

flashcardSetSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema)