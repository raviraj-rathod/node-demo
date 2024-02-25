const express = require('express');
const router = express.Router();
const Todos = require('../modals/todo');
const Joi = require('joi');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/todo');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    status: Joi.boolean().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    cb(null, false);
  } else {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    }
    else {
      cb(null, false);
    }
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter
});

// run();
// async function run() {
//   try {
//     // ?todoSchema.static example
//     const todo = await Todos.findTodoById('651d708667f44b8ca9686c65')
//     // const todo = await Todos.findTodoByName('Test');

//     // todoSchema.query example
//     // const todo = await Todos.where().findTodoByName('Test');

//     console.log(todo);

//     // todoSchema.virtual example
//     // console.log(todo.namedEmail)


//     // ?todoSchema.methods example
//     // todo.sayHi();
//   } catch(err) {
//     console.log(err);
//   }
// }

// ? get All
router.get('/', async (req, res) => {
  try {
    const todos = await Todos.find();
    res.json(ResponseToSend('success', 'todos get successfully.', todos));
  } catch (err) {
    res.status(500).json(ResponseToSend('false', err.message));
  }
});

// ? get single
router.get('/:id', getTodoById, (req, res) => {
  res.json(ResponseToSend('success', 'todos get successfully.', res.todo));
});



// ? Create
// router.post('/add',  upload.single('todoImage'), upload.array('multiImage', 5), async (req, res) => {
router.post('/add', upload.fields([{ name: 'todoImage', maxCount: 1 }, { name: 'multiImage', maxCount: 5 }]), async (req, res) => {
  // res.send(req)
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    status: Joi.boolean().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0]);;
  try {
    // console.log(req.files);
    // console.log(req);
    // req.body.image = req.file.path
    let imagePath = '';
    // if (req.file) {
    //   imagePath = req.file.filename;
    // }
    let multiImage = [];
    const singleImage = req.files['todoImage'];
    const multiImages = req.files['multiImage'];
    if (singleImage) {
      // console.log(singleImage);
      const singleFile = singleImage[0];
      imagePath = singleFile.filename;
      // console.log('Single image uploaded:', singleFile.originalname);
    }
    if (multiImages && multiImages.length > 0) {
      // console.log('Multiple images uploaded:');
      multiImage = multiImages.map((m) => {
        return { image: m.filename };
      });
    }
    const todo = new Todos({
      name: req.body.name,
      status: req.body.status,
      multiImage: multiImage,
      image: imagePath, // Set image only if req.file is available
    });

    const newTodo = await todo.save();
    res.status(201).json(ResponseToSend('success', 'todos get successfully.', newTodo));
  } catch (err) {
    res.status(400).json(ResponseToSend('false', err.message));
  }
});



// ? update 
router.put('/:id', upload.fields([{ name: 'todoImage', maxCount: 1 }, { name: 'multiImage', maxCount: 5 }]), getTodoById, async (req, res) => {
  if(req.body.name){
    res.todo.name = req.body.name
  }
  if (req.body.status){
    res.todo.status = req.body.status
  }
  try{
    let imagePath = '';
    let multiImage = [];
    const singleImage = req.files['todoImage'];
    const multiImages = req.files['multiImage'];
    if (singleImage) {
      const singleFile = singleImage[0];
      imagePath = singleFile.filename;
    }
    if (multiImages && multiImages.length > 0) {
      multiImage = multiImages.map((m) => {
        return { image: m.filename };
      });
    }
    if (imagePath != ''){
      res.todo.image = imagePath;
    }
    if (multiImage.length > 0){
      res.todo.multiImage = multiImage;
    }
    let newTodo = await res.todo.save();
    res.json(ResponseToSend('success', 'todo deleted successfully.', newTodo))
  } catch (err) {
    res.status(400).json(ResponseToSend('false', err.message))
  }
});

// ? Delete 
router.delete('/:id', getTodoById, async (req, res) => {
  try {
    if (res.todo) {
      await Todos.deleteOne(res.todo);
      res.json(ResponseToSend('success', 'todo deleted successfully.'));
    }
  } catch (error) {
    res.status(500).json(ResponseToSend('false', error.message));
  }
});

async function getTodoById(req, res, next) {

  try {
    const todo = await Todos.findById(req.params.id);
    if (!todo) {
      return res.status(400).json(ResponseToSend('false', 'Cannot find the todo'));
    }
    res.todo = todo; // Assign the Mongoose model instance to res.todo
    next();
    res.todo = todo;
  } catch (error) {
    return res.status(500).json(ResponseToSend('false', err.message));
  }
}

function ResponseToSend(type, message, res = undefined) {
  if (type == 'success') {
    return {
      data: res,
      message: message,
      success: true,
    };
  } else {
    return {
      data: res,
      message: message,
      success: false,
    };
  }
}

module.exports = router;