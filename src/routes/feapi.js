const express = require('express')
const routerAPI = express.Router()
const mongoose = require('mongoose');
const { getUsersAPI, postImageUser, postCreateUserAPI, putUpdateUserAPI, deleteUserAPI, getUserAPIById, loginUser, registerUser }
    = require('../controller/userController')

const { postCreateCTDT, deleteCTDT, updateCTDT }
    = require('../controller/ctdtController')

const { postCreateCourse, getAllCourse, deleteCourse, updateCourse }
    = require('../controller/courseController')

const { postCreateClass, getAllClass, deleteClass, updateClass }
    = require('../controller/classController')

const { postCreateClassExam, getAllClassExam, deleteClassExam, updateClassExam }
    = require('../controller/classExamController')

const { postCreateKqht, getAllKqht, deleteKqht, updateKqht }
    = require('../controller/kqhtController')

const middleware = require('../middleware/middleware')

const { getHomePage, getData } = require('../controller/homeController')

const { getMain, searchTeacher, searchStudentByName,
    deleteACTDT, postNewCTDT, putEditCTDT, searchCTDTByName,
    getStudentByClassExam, searchClassExamsByName,
    getClassExams, Login, getClass, getClassbyCourse,
    getCourse, getTeachers, getStudentByCTDTAPI, getStudentAPI,
    getAllCTDT, getTeacherAPI, getTeacherByCTDTAPI, searchCourse } = require('../controller/mainController')
//Trang chủ
routerAPI.get('/main', middleware.verifyToken, getMain)
//Login
routerAPI.get('/', Login)
routerAPI.post('/login', loginUser);
routerAPI.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});
const User = require('../models/user');
const CTDT = require('../models/ctdt');

routerAPI.get('/profile', middleware.verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('idCtdt').exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Construct image path based on mssv and stored image filename
        const imagePath = user.image ? `/img/avt/${user.image}` : '/img/avt/default.jpg';

        res.render('build/pages/profile.ejs', {
            user: user,
            imagePath: imagePath
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


// routerAPI.get('/profile', middleware.verifyToken, middleware.roleAdmin, async (req, res) => {
//     return res.json({
//         info: req.user
//     });
//     // res.render('build/index.ejs')
// });
//Khoa viện
routerAPI.get('/ctdts', middleware.verifyToken, getAllCTDT)
routerAPI.get('/ctdtsSearchName', searchCTDTByName);
routerAPI.put('/ctdts/:id', putEditCTDT); // PUT route to update data
//Sinh viên/ giáo viên
routerAPI.get('/students', middleware.verifyToken, getStudentAPI)
routerAPI.get('/students/ctdts', getStudentByCTDTAPI)
routerAPI.get('/teachers/ctdts', getTeacherByCTDTAPI)
routerAPI.get('/studentSearchName', searchStudentByName)

routerAPI.get('/teacherSearch', searchTeacher)
routerAPI.put('/students/:id', async (req, res) => {
    const id = req.params.id;

    const newData = req.body;

    try {
        const updatedData = await User.findByIdAndUpdate(id, newData, { new: true });
        res.status(200).json(updatedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})




routerAPI.get('/teachers', getTeacherAPI)

routerAPI.put('/teachers/:id', async (req, res) => {

    const id = req.params.id;

    const newData = req.body;

    // Đảm bảo newData.role được đặt thành 'teacher'
    newData.role = 'teacher';
    try {
        const updatedData = await User.findByIdAndUpdate(id, newData, { new: true });
        if (!updatedData) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
routerAPI.delete('/teachers/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Xóa dữ liệu từ cơ sở dữ liệu dựa trên _id
        await User.findOneAndDelete({ _id: id });
        res.status(204).end(); // Trả về mã trạng thái 204 (No Content) khi xóa thành công
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})






//Khóa học
routerAPI.get('/courses', getCourse)
routerAPI.get('/courses/:idCourse', getClassbyCourse)
routerAPI.get('/courseSearch', searchCourse)
routerAPI.post('/courses', postCreateCourse)


//Lớp học
routerAPI.get('/class', getClass)
//Lớp thi
routerAPI.get('/classExams', getClassExams)
routerAPI.post('/classExams/search', searchClassExamsByName);
routerAPI.get('/classExamsStudents/:idClassExam', getStudentByClassExam);
// Route để xử lý yêu cầu thêm mới dữ liệu
routerAPI.post('/ctdts', postNewCTDT);
// Route để xử lý yêu cầu xóa dữ liệu dựa trên _id
routerAPI.delete('/ctdts/:id', deleteACTDT);

routerAPI.post('/users', async (req, res) => {
    const newData = req.body;
    try {
        const createdData = await User.create(newData);
        res.status(201).json(createdData); // Trả về dữ liệu mới đã được thêm vào
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
routerAPI.post('/teachers', async (req, res) => {
    const newData = req.body;
    newData.role = 'teacher'
    try {
        const createdData = await User.create(newData);
        res.status(201).json(createdData); // Trả về dữ liệu mới đã được thêm vào
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

routerAPI.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Xóa dữ liệu từ cơ sở dữ liệu dựa trên _id
        await User.findByIdAndDelete(id);
        res.status(204).end(); // Trả về mã trạng thái 204 (No Content) khi xóa thành công
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

//Điểm danh lớp thi
const faceController = require('../controller/faceController');
routerAPI.post('/post-face', faceController.postFace);
routerAPI.post('/check-face', faceController.checkFace);

routerAPI.get('/faceCheckAttend', faceController.renderForm);
routerAPI.get('/faceCheckAttend/:idClassExam', faceController.renderForm);
routerAPI.post('/check-face/:idClassExam', faceController.checkFaceByClassExam);
routerAPI.get('/get-recognized-name/:userId', faceController.getFaceByName);



module.exports = routerAPI;