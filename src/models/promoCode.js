const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true, // Kiritilganda avtomatik katta harf bo‘ladi
        trim: true
    },
    discountType: {
        type: String,
        enum: ['percent', 'amount'], // foiz yoki summa
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    maxUsage: {
        type: Number,
        default: 1 // nechta user ishlatishi mumkin
    },
    usedCount: {
        type: Number,
        default: 0 // hozirgacha ishlatilganlar soni
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // admin yoki moderator
        required: true
    },
    usedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
