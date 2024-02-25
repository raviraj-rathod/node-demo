const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    uppercase: true,
  },
  image: {
    type: String,
    // required: true,
    default: '',
  },
  multiImage: {
    type:Array,
  },
  age: {
    type: Number,
    min: 1,
    max: 100,
    validate: {
      validator: (v) => v % 2 === 0,
      message: (props) => `${props.value} is ---`
    }
  },
  status: {
    type: Boolean,
    required: true,
    lowercase: true,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    immutable: true,
    default: Date.now,
  }
});


todoSchema.statics.findTodoById = function (id) {
  return this.findById(id);
};


todoSchema.statics.findTodoByName = function (name) {
  console.log('enter');
  return this.find({ name: new RegExp(name, 'i') });
};


todoSchema.query.findTodoByName = function (name) {
  console.log('enter');
  return this.where({ name: new RegExp(name, 'i') });
};


todoSchema.methods.sayHi = function () {
  console.log('hi my task is', this.name);
};


todoSchema.virtual('namedEmail').get(function () {
  return `${this.name} <${this.status}>`;
});


todoSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('Todos', todoSchema);