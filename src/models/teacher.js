const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const mongoose_delete = require('mongoose-delete');

const teacherSchema = new mongoose.Schema({
    mssv: { type: String, required: true, unique: true },
    name: String,

    sex: { type: String, enum: ["male", "female"], required: true, default: 'male' },

    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: "123456" },

    phone: String,

    description: Array,
});

teacherSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

teacherSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const Teacher = mongoose.model('teacher', teacherSchema);

module.exports = Teacher;
