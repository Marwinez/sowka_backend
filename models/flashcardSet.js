const mongoose = require('mongoose')

const flashcardSetSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    cards: {
        type: Array,
        required: true,
    }
})

flashcardSetSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        return ret.__v
    }
})

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema)