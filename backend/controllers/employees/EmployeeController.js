const cloudinary = require("../cloudinary");
const User = require("../../database/userdb/UserSchema");
const Employees = require('../../database/employees/EmployeeSchema')
const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const mongoose = require("mongoose");
const moment = require("moment");


// adding an employee
const addEmployee = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
      const {
        employeeName,
        fatherName,
        address,
        email,
        phone,
        emergencyPhone,
        dob,
        cnic,
        salaryType,
        salary,
      } = req.body
      console.log('fatherName',fatherName)
      const existngEmployee = await Employees.findOne({ email })
      if (existngEmployee) {
        res.status(400).json({ message: `Employee with ${email} already existed` })

      }
      if (!existngEmployee) {
        const newEmployee = new Employees({
          employeeName,
          fatherName,
          address,
          email,
          phone,
          emergencyPhone,
          dob,
          cnic,
          salaryType,
          salary,
          entry_Date: new Date().toISOString().split("T")[0]
        })
        await newEmployee.save()
        res.status(200).json({ data: newEmployee, message: `${employeeName} added Successfully !` })
      }

    }



  } catch (error) {
    res.status(500).json({ message: error.message })

  }

}

//deleting an employee
const delEmployee = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
      const {
        employeeId
      } = req.body
      if (!employeeId) {
        res.status(404).json({ message: "Employee Id not found" })

      }
      const employee = await Employees.findById(employeeId)
      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        const employeeToDelete = await Employees.findByIdAndDelete(employeeId)
        res.status(200).json({ message: `${employee.employeeName} deleted Successfully !` })

      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }
}

//updating an employee
const updateEmployee = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
      const {
        employeeId,
        employeeName,
        fatherName,
        address,
        email,
        phone,
        emergencyPhone,
        dob,
        cnic,
        salaryType,
        salary,

      } = req.body

      if (!employeeId) {
        res.status(404).json({ message: "Employee Id not found" })
      }
      const employee = await Employees.findById(employeeId)

      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        employee.employeeName = employeeName
        employee.fatherName = fatherName
        employee.address = address
        employee.email = email
        employee.phone = phone
        employee.emergencyPhone = emergencyPhone
        employee.dob = dob
        employee.cnic = cnic
        employee.salaryType = salaryType
        employee.salary = salary
        await employee.save()
        res.status(200).json({ message: `Employee updated Successfully !` })

      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }
}

//getting all employees
const getEmployees = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {

      const employees = await Employees.find({})
      res.status(200).json({ data: employees })

    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }
}

//adding salary to an employee
const addSalary = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
      const {
        employeeId,
        category,
        payment_Via,
        payment_Type,
        slip_No,
        payment_Out,
        payment_Out_Curr,
        slip_Pic,
        date,
        curr_Rate,
        curr_Amount,
        open,
        close
      } = req.body
      const employee = await Employees.findById(employeeId)

      if (!employee) {
        res.status(404).json({ message: "Employee not found" })


      }
      if (employee) {
        let nextInvoiceNumber = 0;

            // Check if InvoiceNumber document exists
            const currentInvoiceNumber = await InvoiceNumber.findOne({});

            if (!currentInvoiceNumber) {
                // If not, create a new one
                const newInvoiceNumberDoc = new InvoiceNumber();
                await newInvoiceNumberDoc.save();
            }

            // Get the updated invoice number
            const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
                {},
                { $inc: { invoice_Number: 1 } },
                { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
            );

            if (updatedInvoiceNumber) {
                nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
            }

        const payment = {
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_Out,
          payment_Out_Curr,
          slip_Pic,
          date,
          curr_Rate,
          curr_Amount,
          invoice:nextInvoiceNumber
        }

        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
          const newCashInHandDoc = new CashInHand();
          await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
          $inc: {}
        };
        if (payment_Via.toLowerCase() === "cash") {
          cashInHandUpdate.$inc.cash = -payment_Out;
          cashInHandUpdate.$inc.total_Cash = -payment_Out;

        } else {
          cashInHandUpdate.$inc.bank_Cash = -payment_Out;
          cashInHandUpdate.$inc.total_Cash = -payment_Out;

        }
        await CashInHand.updateOne({}, cashInHandUpdate);

        employee.payment.push(payment)
        employee.open=open,
        employee.close=close
        await employee.save()
        res.status(200).json({ message: `Paymany Out: ${payment_Out} added Successfully to ${employee.employeeName}!` })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }

}




//deleting an employee'payment
const delSalary = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
      const {
        employeeId,
        paymentId
      } = req.body
      if (!employeeId) {
        res.status(404).json({ message: "Employee Id not found" })
      }
      if (!paymentId) {
        res.status(404).json({ message: "Payment Id not found" })
      }
      const employee = await Employees.findById(employeeId)
      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        const paymentToDelete=employee.payment.find(p=>p._id.toString() === paymentId)
        employee.payment=employee.payment.filter(p=>p._id.toString() !== paymentId)
        const cashInHandDoc = await CashInHand.findOne({});

        if (!cashInHandDoc) {
          const newCashInHandDoc = new CashInHand();
          await newCashInHandDoc.save();
        }

        const cashInHandUpdate = {
          $inc: {},
        };

        if (paymentToDelete.payment_Via.toLowerCase() === "cash" || paymentToDelete.payment_Via==="cash") {
          cashInHandUpdate.$inc.cash = -paymentToDelete.payment_Out;
          cashInHandUpdate.$inc.total_Cash = -paymentToDelete.payment_Out;
        }
        else{
          cashInHandUpdate.$inc.bank_Cash = -paymentToDelete.payment_Out;
          cashInHandUpdate.$inc.total_Cash = -paymentToDelete.payment_Out;
        }
        await CashInHand.updateOne({}, cashInHandUpdate);
        await employee.save()
        res.status(200).json({ message: `Payment deleted Successfully !` })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }
}

//updating an employee'payment
const updateSalary = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      const {
        employeeId,
        paymentId,
        category,
        payment_Via,
        payment_Type,
        slip_No,
        payment_Out,
        payment_Out_Curr,
        slip_Pic,
        details,
        date,
        curr_Amount,
        curr_Rate,
        open,
        close
      } = req.body
      if (!employeeId) {
        res.status(404).json({ message: "Employee Id not found" })
      }
      if (!paymentId) {
        res.status(404).json({ message: "Payment Id not found" })
      }
      const employee = await Employees.findById(employeeId)

      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        let paymentToUpdate=employee.payment.find(p=>p._id.toString() === paymentId)
        if(!paymentToUpdate){
        res.status(404).json({ message: "Payment not found" })

        }
        if(paymentToUpdate){
          paymentToUpdate.category = category
          paymentToUpdate.payment_Via = payment_Via
          paymentToUpdate.payment_Type = payment_Type
          paymentToUpdate.slip_No = slip_No
          paymentToUpdate.payment_Out = payment_Out
          paymentToUpdate.payment_Out_Curr = payment_Out_Curr
          paymentToUpdate.slip_Pic = slip_Pic
          paymentToUpdate.details = details
          paymentToUpdate.date = date
          paymentToUpdate.curr_Rate = curr_Rate
          paymentToUpdate.curr_Amount = curr_Amount
          employee.open=open,
          employee.close=close
          const cashInHandDoc = await CashInHand.findOne({});

                    if (!cashInHandDoc) {
                        const newCashInHandDoc = new CashInHand();
                        await newCashInHandDoc.save();
                    }

                    const cashInHandUpdate = {
                        $inc: {}
                    }

                    const newAmount = paymentToUpdate.payment_Out - payment_Out
                    if (paymentToUpdate.payment_Via.toLowerCase() === "cash" || paymentToUpdate.payment_Via === "cash") {
                        cashInHandUpdate.$inc.cash = -newAmount;
                        cashInHandUpdate.$inc.total_Cash = -newAmount;

                    } else  {
                        cashInHandUpdate.$inc.bankCash = -newAmount;
                        cashInHandUpdate.$inc.total_Cash = -newAmount;

                    }

                    await CashInHand.updateOne({}, cashInHandUpdate);

          await employee.save()
          res.status(200).json({ message: `Payment updated Successfully !` })
        }
    

      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }
}



//adding vacation for an employee
const addVacation = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
      const {
        employeeId,
        dateFrom,
        dateTo,
        days,
        timeIn,
        timeOut,
        date
      
      } = req.body
      const employee = await Employees.findById(employeeId)

      if (!employee) {
        res.status(404).json({ message: "Employee not found" })


      }
      if (employee) {
        let nextInvoiceNumber = 0;

        // Check if InvoiceNumber document exists
        const currentInvoiceNumber = await InvoiceNumber.findOne({});

        if (!currentInvoiceNumber) {
            // If not, create a new one
            const newInvoiceNumberDoc = new InvoiceNumber();
            await newInvoiceNumberDoc.save();
        }

        // Get the updated invoice number
        const updatedInvoiceNumber = await InvoiceNumber.findOneAndUpdate(
            {},
            { $inc: { invoice_Number: 1 } },
            { new: true, upsert: true } // Use upsert: true to create a new document if it doesn't exist
        );

        if (updatedInvoiceNumber) {
            nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
        }

        const vacation = {
        dateFrom,
        dateTo,
        days,
        timeIn,
        timeOut,
        date,
        invoice: nextInvoiceNumber,

        }

        employee.vacation.push(vacation)
        await employee.save()
        res.status(200).json({ message: `Vacation granted Successfully to ${employee.employeeName} for ${days} days!` })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }

}

//deleting an employee'vacation
const delVacation = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
      const {
        employeeId,
        vacationId
      } = req.body
      if (!employeeId) {
        res.status(404).json({ message: "Employee Id not found" })
      }
      if (!employeeId) {
        res.status(404).json({ message: "Vacation Id not found" })
      }
      const employee = await Employees.findById(employeeId)
      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        employee.vacation=employee.vacation.filter(v=>v._id.toString() !== vacationId)
        await employee.save()
        res.status(200).json({ message: `Vacation deleted Successfully !` })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }
}

//updating an employee'vacation
const updateVacation = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    if (user) {
      const {
        employeeId,
        vacationId,
        dateFrom,
        dateTo,
        days,
        timeIn,
        timeOut,
        date

      } = req.body

      if (!employeeId) {
        res.status(404).json({ message: "Employee Id not found" })
      }
      if (!employeeId) {
        res.status(404).json({ message: "Payment Id not found" })
      }
      const employee = await Employees.findById(employeeId)

      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        let vacationToUpdate=employee.vacation.find(v=>v._id.toString() === vacationId)
        if(!vacationToUpdate){
        res.status(404).json({ message: "Vacation not found" })

        }
        if(vacationToUpdate){
          vacationToUpdate.dateFrom = dateFrom
          vacationToUpdate.dateTo = dateTo
          vacationToUpdate.days = days
          vacationToUpdate.timeIn = timeIn
          vacationToUpdate.timeOut = timeOut
          vacationToUpdate.date = date
          await employee.save()
          res.status(200).json({ message: `Vacation updated Successfully !` })
        }
    

      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }
}


module.exports = {addEmployee,delEmployee,updateEmployee,getEmployees,addSalary,delSalary,updateSalary,addVacation,delVacation,updateVacation};
