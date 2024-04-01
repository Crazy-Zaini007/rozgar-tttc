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
        
      } = req.body
      
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



// Adding Salary month
const addNewSalaryMonth = async (req, res) => {
  const { employeeId, month, salary } = req.body;

  try {
    const employee = await Employees.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if the month already exists
    const existingMonth = employee.payments.find(payment => payment.month.toLowerCase() === month.toLowerCase());
    if (existingMonth) {
      return res.status(400).json({ message: "This Salary Month already added" });
    }

    // Create a new object for the month and salary
    const newPayment = {
      month,
      salary,
      remain:salary,
      payment: []
    };

    // Add the new payment object to the payments array
    employee.payments.push(newPayment);
    employee.remaining+=salary
    await employee.save();

    res.status(200).json({ message: "New Salary Month added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


// Deleting a Salary Month
const deleteSalaryMonth = async (req, res) => {
  const { employeeId, monthId, salary } = req.body;

  try {
    const employee = await Employees.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if the month already exists
    const existingMonth = employee.payments.find(payment => payment._id.toString() === monthId.toString());
    if(existingMonth){
      employee.payments = employee.payments.filter(payment => payment._id.toString() !== monthId.toString());
// Add the new payment object to the payments array
   
employee.remaining-=existingMonth.salary
await employee.save();

res.status(200).json({ message: "Salary Month deleted successfully" });
    }

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}

// Updating Salary Month
const updateSalaryMonth = async (req, res) => {
  const { employeeId, monthId,month,salary } = req.body;

  try {
    const employee = await Employees.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Check if the month already exists
    let monthToUpdate = employee.payments.find(payment => payment._id.toString() === monthId.toString());
if(monthToUpdate.month!== month ){
  const existingMonth = employee.payments.find(payment => payment.month.toLowerCase() === month.toLowerCase());
  if (existingMonth) {
    return res.status(400).json({ message: "This Salary Month already added" });
  }
  monthToUpdate.month=month
  const salaryDiff=monthToUpdate.salary-salary
  let newSaLaryDiff=Number(salaryDiff)
  monthToUpdate.salary=salary
  monthToUpdate.remain-=newSaLaryDiff
  employee.remaining-=newSaLaryDiff
  await employee.save();

  res.status(200).json({ message: "Salary Month deleted successfully" });
}
if(monthToUpdate.month=== month){
  monthToUpdate.month=month
  const salaryDiff=monthToUpdate.salary-salary
  let newSaLaryDiff=Number(salaryDiff)
  monthToUpdate.salary=salary
  monthToUpdate.remain-=newSaLaryDiff
  employee.remaining-=newSaLaryDiff
  await employee.save();
  res.status(200).json({ message: "Salary Month deleted successfully" });
}
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};



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
        month,
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
        const parsedPaymentOut = Number(payment_Out);
        


    // Find the payment object corresponding to the provided month
    const paymentObject = employee.payments.find(payment => payment.month.toLowerCase() === month.toLowerCase());

    if (!paymentObject) {
      return res.status(404).json({ message: "Salary Month for the provided month not found" });
    }
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
            )
            if (updatedInvoiceNumber) {
                nextInvoiceNumber = updatedInvoiceNumber.invoice_Number;
            }

        const payment = {
          _id: new mongoose.Types.ObjectId(),
          category,
          payment_Via,
          payment_Type,
          slip_No,
          payment_Out:parsedPaymentOut,
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

        paymentObject.payment.push(payment)
        paymentObject.remain-=payment_Out
        employee.open=open,
        employee.close=close
        employee.remaining-=payment_Out
        await employee.save()
        res.status(200).json({ message: `Salary amount: ${payment_Out} added Successfully to ${employee.employeeName}!` })
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
        paymentId,
        
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
        // Find the payment object corresponding to the provided month
        let allMonths = employee.payments;

        for (const month of allMonths){
          let allPayments=month.payment
         let paymentFind=allPayments.find(p=>p._id.toString()===paymentId.toString())
         if(paymentFind){
          
         let paymentToDelete=allPayments.filter(p=>p._id.toString() !==paymentId.toString())
         const cashInHandDoc = await CashInHand.findOne({});
         if (!cashInHandDoc) {
           const newCashInHandDoc = new CashInHand();
           await newCashInHandDoc.save();
         }
 
         const cashInHandUpdate = {
           $inc: {},
         };
 
         if (paymentFind.payment_Via.toLowerCase() === "cash") {
           cashInHandUpdate.$inc.cash = paymentFind.payment_Out;
           cashInHandUpdate.$inc.total_Cash = paymentFind.payment_Out;
         }
         else{
           cashInHandUpdate.$inc.bank_Cash = -paymentFind.payment_Out;
           cashInHandUpdate.$inc.total_Cash = -paymentFind.payment_Out;
         }
         await CashInHand.updateOne({}, cashInHandUpdate);
         employee.remaining+=paymentFind.payment_Out
         month.remain+=paymentFind.payment_Out
         await employee.save()
         res.status(200).json({ message: `Payment deleted Successfully !` })
         break
               }
         }
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
        let allMonths = employee.payments;
        for (const month of allMonths){
          let allPayments=month.payment
         let paymentToUpdate=allPayments.find(p=>p._id.toString()===paymentId.toString())
         if(paymentToUpdate){
          let uploadImage;
          if (slip_Pic) {
              uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                  upload_preset: 'rozgar'
              });
          }
          const cashInHandDoc = await CashInHand.findOne({});

          if (!cashInHandDoc) {
              const newCashInHandDoc = new CashInHand();
              await newCashInHandDoc.save();
          }
          const cashInHandUpdate = {
              $inc: {}
          }
          const newPaymenOut=Number(payment_Out)
          const newAmount = paymentToUpdate.payment_Out - newPaymenOut
          if (paymentToUpdate.payment_Via.toLowerCase() === "cash") {
            
              cashInHandUpdate.$inc.cash = newAmount;
              cashInHandUpdate.$inc.total_Cash = newAmount;

          } else  {
              cashInHandUpdate.$inc.bank_Cash = newAmount;
              cashInHandUpdate.$inc.total_Cash = newAmount;

          }
          await CashInHand.updateOne({}, cashInHandUpdate);
          paymentToUpdate.category = category
          paymentToUpdate.payment_Via = payment_Via
          paymentToUpdate.payment_Type = payment_Type
          paymentToUpdate.slip_No = slip_No
          paymentToUpdate.payment_Out = newPaymenOut
          paymentToUpdate.payment_Out_Curr = payment_Out_Curr
          paymentToUpdate.slip_Pic = uploadImage?.slip_Pic || ""
          paymentToUpdate.details = details
          paymentToUpdate.date = date
          paymentToUpdate.curr_Rate = curr_Rate
          paymentToUpdate.curr_Amount = curr_Amount
          employee.open=open,
          employee.close=close
          employee.remaining+=newAmount
          month.payment = allPayments;
          month.remain+=newAmount
         await employee.save()
            res.status(200).json({ message: `Payment updated Successfully !` })
               }
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


module.exports = {addEmployee,delEmployee,updateEmployee,getEmployees,addNewSalaryMonth,deleteSalaryMonth,updateSalaryMonth,addSalary,delSalary,updateSalary,addVacation,delVacation,updateVacation };
