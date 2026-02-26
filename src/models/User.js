import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    age: {
        type: Number,
        required: true,
        default: 18
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
        default: 'Other'
    },
    city: {
        type: String,
        required: true,
        index: true,
        default: 'Update later'
    },
    genderPreference: { type: String, enum: ['Male', 'Female', 'Both'], default: 'Both', index: true },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    isActivated: { type: Boolean, default: false },
    activationToken: { type: String },
    activationTokenExpires: { type: Date },
    hasCompletedOnboarding: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.index({ city: 1, gender: 1, age: 1 });

export default mongoose.model('User', userSchema);