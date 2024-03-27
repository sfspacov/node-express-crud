// Import the Student model
const Student = require("../model/studantdata");

// Mock the Student model
jest.mock('../model/studantdata.js');

// Import the function to be tested
const { getStudents } = require('./students');

// Mock the response object
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('getStudents', () => {
    test('should return a list of students', async () => {
        const studentsData = [{ name: 'Student 1' }, { name: 'Student 2' }];
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
