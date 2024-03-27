// Import necessary modules and functions
const { getStudents, getSpecStudent, createStudent, updateStudent, deleteStudent } = require('./students');
const Student = require("../model/studantdata");

// Mock the Student model
jest.mock('../model/studantdata.js');

// Mock the response object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('getStudents', () => {
    test('should return a list of students', async () => {
        const studentsData = [
            { name: 'Student 1', roll: '123456', registration: '2023001', subjects: ['Math', 'Science'] },
            { name: 'Student 2', roll: '789012', registration: '2044151', subjects: ['English', 'Physics'] }];
        // Mocking the behavior of Student.find() to return studentsData
        Student.find.mockResolvedValue(studentsData);

        const req = {}; // Mock request object
        const res = mockResponse(); // Mock response object

        await getStudents(req, res);

        // Expectations
        expect(Student.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(studentsData);
    });

    test('should return a list of students from the database', async () => {
        // Insert some mock data into the in-memory database
        await Student.create([
            { name: 'Student 1', roll: '123456', registration: '2023001', subjects: ['Math', 'Science'] },
            { name: 'Student 2', roll: '789012', registration: '2044151', subjects: ['English', 'Physics'] }
        ]);

        const req = {}; // Mock request object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }; // Mock response object

        await getStudents(req, res);

        // Expectations
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ name: 'Student 1' }),
            expect.objectContaining({ name: 'Student 2' })
        ]));
    });

    test('should handle errors', async () => {
        const errorMessage = 'An error occurred';
        // Mocking the behavior of Student.find() to throw an error
        Student.find.mockRejectedValue(new Error(errorMessage));

        const req = {}; // Mock request object
        const res = mockResponse(); // Mock response object

        await getStudents(req, res);

        // Expectations
        expect(Student.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});

describe('getSpecStudent', () => {
    test('should return a specific student', async () => {
        const studentData = { name: 'Student 1', roll: '123456', registration: '2023001', subjects: ['Math', 'Science'] };
        // Mocking the behavior of Student.findOne() to return studentData
        Student.findOne.mockResolvedValue(studentData);

        const req = { params: { roll: '123456' } }; // Mock request object with roll parameter
        const res = mockResponse(); // Mock response object

        await getSpecStudent(req, res);

        // Expectations
        expect(Student.findOne).toHaveBeenCalledWith({ roll: '123456' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(studentData);
    });

    test('should handle errors', async () => {
        const errorMessage = 'Student not found';
        // Mocking the behavior of Student.findOne() to throw an error
        Student.findOne.mockRejectedValue(new Error(errorMessage));

        const req = { params: { roll: '123456' } }; // Mock request object with roll parameter
        const res = mockResponse(); // Mock response object

        await getSpecStudent(req, res);

        // Expectations
        expect(Student.findOne).toHaveBeenCalledWith({ roll: '123456' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});

describe('createStudent', () => {
    test('should create a new student', async () => {
        const newStudentData = { name: 'New Student', roll: '789012', registration: '2023002', subjects: ['History', 'English'] };
        // Mocking the behavior of Student.create() to return newStudentData
        Student.create.mockResolvedValue(newStudentData);

        const req = { body: newStudentData }; // Mock request object with new student data in body
        const res = mockResponse(); // Mock response object

        await createStudent(req, res);

        // Expectations
        expect(Student.create).toHaveBeenCalledWith(newStudentData);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(newStudentData);
    });

    test('should handle errors', async () => {
        const errorMessage = 'Error creating student';
        // Mocking the behavior of Student.create() to throw an error
        Student.create.mockRejectedValue(new Error(errorMessage));

        const req = { body: { name: 'New Student', roll: '789012', registration: '2023002', subjects: ['History', 'English'] } }; // Mock request object with new student data in body
        const res = mockResponse(); // Mock response object

        await createStudent(req, res);

        // Expectations
        expect(Student.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});

describe('updateStudent', () => {
    test('should update a student', async () => {
        const updatedStudentData = { name: 'Updated Student', roll: '123456', registration: '2023001', subjects: ['Math', 'Science'] };
        // Mocking the behavior of Student.findOneAndUpdate() to return updatedStudentData
        Student.findOneAndUpdate.mockResolvedValue(updatedStudentData);

        const req = { params: { roll: '123456' }, body: { name: 'Updated Student' } }; // Mock request object with roll parameter and updated data in body
        const res = mockResponse(); // Mock response object

        await updateStudent(req, res);

        // Expectations
        expect(Student.findOneAndUpdate).toHaveBeenCalledWith({ roll: '123456' }, { name: 'Updated Student' }, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedStudentData);
    });

    test('should handle errors', async () => {
        const errorMessage = 'Error updating student';
        // Mocking the behavior of Student.findOneAndUpdate() to throw an error
        Student.findOneAndUpdate.mockRejectedValue(new Error(errorMessage));

        const req = { params: { roll: '123456' }, body: { name: 'Updated Student' } }; // Mock request object with roll parameter and updated data in body
        const res = mockResponse(); // Mock response object

        await updateStudent(req, res);

        // Expectations
        expect(Student.findOneAndUpdate).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});

describe('deleteStudent', () => {
    test('should delete a student', async () => {
        const req = { params: { roll: '123456' } }; // Mock request object with roll parameter
        const res = mockResponse(); // Mock response object

        await deleteStudent(req, res);

        // Expectations
        expect(Student.findOneAndDelete).toHaveBeenCalledWith({ roll: '123456' });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "Student deleted successfully" });
    });

    test('should handle errors', async () => {
        const errorMessage = 'Error deleting student';
        // Mocking the behavior of Student.findOneAndDelete() to throw an error
        Student.findOneAndDelete.mockRejectedValue(new Error(errorMessage));

        const req = { params: { roll: '123456' } }; // Mock request object with roll parameter
        const res = mockResponse(); // Mock response object

        await deleteStudent(req, res);

        // Expectations
        expect(Student.findOneAndDelete).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});