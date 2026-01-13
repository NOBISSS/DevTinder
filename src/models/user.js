const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["Male", "Female", "Other"],
            message: `{VALUE} is not a valid gender type`,
        },
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL")
            }
        }
    },
    about: {
        type: String,
        default: "This is a Default Description"
    },
    skills: {
        type: [String],
    }
})

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790", { expiresIn: "7d" })
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    console.log("CALLED");
    const isPasswordValid = await bcrypt.compare(password, this.password);
    if (!isPasswordValid) {
        throw new Error("Invalid Password");
    }
    return isPasswordValid;
}

userSchema.methods.hashPassword = async function (newPassword) {
    try {
        this.password = await bcrypt.hash(newPassword, 10);
        await this.save();
        return true;
    } catch (error) {
        console.log("Error:" + error.message);
        return false;
    }
}

userSchema.methods.isSamePassword = async function (newPassword) {
    return await bcrypt.compare(newPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);