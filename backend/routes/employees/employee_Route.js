const userAuth = require('../../middleware/userMiddleware/userAuth')
const { addEmployee,delEmployee,updateEmployee,getEmployees,addNewSalaryMonth,deleteSalaryMonth,updateSalaryMonth,addSalary,delSalary,updateSalary,addVacation,delVacation,updateVacation } = require('../../controllers/employees/EmployeeController')
const express = require('express');
const router = express.Router()

router.use(userAuth)

//Employees

router.post('/add/employee', addEmployee)

router.delete('/delete/employee', delEmployee)

router.patch('/update/employee', updateEmployee)

router.get('/get/employees', getEmployees)

//Add Salary Month
router.post('/add/salary_month', addNewSalaryMonth)
router.delete('/delete/salary_month', deleteSalaryMonth)
router.patch('/update/salary_month', updateSalaryMonth)



//Employees Payments
router.post('/add/employee/payment', addSalary)

router.delete('/delete/employee/payment', delSalary)

router.patch('/update/employee/payment', updateSalary)

//Employees Vacations
router.post('/add/employee/vacation', addVacation)

router.delete('/delete/employee/vacation', delVacation)

router.patch('/update/employee/vacation', updateVacation)

module.exports = router
