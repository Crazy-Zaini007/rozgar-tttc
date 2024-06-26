const cloudinary = require("../cloudinary");
const User = require("../../database/userdb/UserSchema");
const Employees = require('../../database/employees/EmployeeSchema')
const InvoiceNumber = require("../../database/invoiceNumber/InvoiceNumberSchema");
const CashInHand = require("../../database/cashInHand/CashInHandSchema");
const mongoose = require("mongoose");
const moment = require("moment");
const RecycleBin=require('../../database/recyclebin/RecycleBinModel.js')

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
  const newSalary=Number(salary)
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
    employee.remaining+=newSalary
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
          date:date?date:new Date().toISOString().split("T")[0],
          curr_Rate,
          curr_Amount,
          cash_Out:0,
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

        employee.employeePayments.push(payment)
        await employee.save()
        res.status(200).json({ message: `Salary amount: ${payment_Out} added Successfully to ${employee.employeeName}!` })
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }

}

//adding salary to an employee
const addMultipleSalaries = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" })

    }

    if (user) {
    const multiplePayments = req.body;

    if (!Array.isArray(multiplePayments) || multiplePayments.length === 0) {
      res.status(400).json({ message: "Invalid request payload" });
      return;
    }
    try {
      for (const payment of multiplePayments){
        const {
          employeeName,
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
        } = payment
        const employee = await Employees.findOne({employeeName:employeeName.toLowerCase()})

      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        const parsedPaymentOut = Number(payment_Out);
        
    // Find the payment object corresponding to the provided month

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
          date:date?date:new Date().toISOString().split("T")[0],
          curr_Rate,
          curr_Amount,
          cash_Out:0,
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

        employee.employeePayments.push(payment)
        await employee.save()
      }
      res.status(200).json({ message: `Salaries done for ${multiplePayments.length} Employees!` })

      }
    } catch (error) {
      
    }
      
      
    }
  } catch (error) {
    res.status(500).json({ message: error.message })

  }

}


//adding salary to an employee
const addPaymentReturn = async (req, res) => {

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
        cash_Out,
        payment_Out_Curr,
        slip_Pic,
        date,
        curr_Rate,
        curr_Amount,
      } = req.body
      const employee = await Employees.findById(employeeId)

      if (!employee) {
        res.status(404).json({ message: "Employee not found" })
      }
      if (employee) {
        const parsedCashOut = Number(cash_Out);
        
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
          cash_Out:parsedCashOut,
          payment_Out_Curr,
          slip_Pic,
          date:date?date:new Date().toISOString().split("T")[0],
          curr_Rate,
          curr_Amount,
          payment_Out:0,
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
          cashInHandUpdate.$inc.cash = parsedCashOut;
          cashInHandUpdate.$inc.total_Cash = parsedCashOut;

        } else {
          cashInHandUpdate.$inc.bank_Cash = parsedCashOut;
          cashInHandUpdate.$inc.total_Cash = parsedCashOut;

        }
        await CashInHand.updateOne({}, cashInHandUpdate);

        employee.employeePayments.push(payment)
      
        await employee.save()
        res.status(200).json({ message: `Salary amount: ${cash_Out} returned Successfully from ${employee.employeeName}!` })
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
        // Find the payment object corresponding to the provided mont
         let paymentFind=employee.employeePayments.find(p=>p._id.toString()===paymentId.toString())
         if (!paymentFind) {
          res.status(404).json({ message: "Payment to delete not found" })
        }
         if(paymentFind){
         
          employee.employeePayments =employee.employeePayments.filter(p=>p._id.toString() !==paymentId.toString())
          await employee.save()
         
         const newRecycle=new RecycleBin({
           name:employee.employeeName,
           type:"Employee Payment",
           category:paymentFind.category,
           payment_Via:paymentFind.payment_Via,
           payment_Type:paymentFind.payment_Type,
           slip_No:paymentFind.slip_No,
           payment_Out:paymentFind.payment_Out,
           cash_Out:paymentFind.cash_Out,
           payment_In_Curr:paymentFind.payment_Out_Curr,
           slip_Pic:paymentFind.slip_Pic,
           date:paymentFind.date,
           curr_Rate:paymentFind.curr_Rate,
           curr_Amount:paymentFind.curr_Amount,
           invoice:paymentFind.invoice
 
         })
         await newRecycle.save()

         res.status(200).json({ message: `Payment deleted Successfully !` })
         
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
        cash_Out,
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
      
       
         
         let paymentToUpdate=employee.employeePayments.find(p=>p._id.toString()===paymentId.toString())
         if (!paymentToUpdate) {
          res.status(404).json({ message: "Payment to update not found" })
        }
         if(paymentToUpdate){
          let uploadImage;
          if (slip_Pic) {
              uploadImage = await cloudinary.uploader.upload(slip_Pic, {
                  upload_preset: 'rozgar'
              });
          }
        
          const newPaymenOut=Number(payment_Out)
          const newCashOut=Number(cash_Out)
          const newCurrRate=Number(curr_Rate)

          paymentToUpdate.category = category
          paymentToUpdate.payment_Via = payment_Via
          paymentToUpdate.payment_Type = payment_Type
          paymentToUpdate.slip_No = slip_No
          paymentToUpdate.payment_Out = newPaymenOut
          paymentToUpdate.cash_Out = newCashOut
          paymentToUpdate.payment_Out_Curr = payment_Out_Curr
          paymentToUpdate.slip_Pic = uploadImage?.slip_Pic || ""
          paymentToUpdate.details = details
          paymentToUpdate.date = date
          paymentToUpdate.curr_Rate = newCurrRate
          paymentToUpdate.curr_Amount =newPaymenOut>0?newPaymenOut:newCashOut/newCurrRate
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

        const formatCurrentTime = () => {
          const now = new Date();
          let hours = now.getHours();
          const minutes = now.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          const minutesStr = minutes < 10 ? '0' + minutes : minutes;
          return `${hours}:${minutesStr} ${ampm}`;
        };
        const vacation = {
        dateFrom,
        dateTo,
        days,
        timeOut:formatCurrentTime(),
        date:date?date:new Date().toISOString().split("T")[0],
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

//adding vacation for an employee
const addVacationFinish = async (req, res) => {
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

        const formatCurrentTime = () => {
          const now = new Date();
          let hours = now.getHours();
          const minutes = now.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          const minutesStr = minutes < 10 ? '0' + minutes : minutes;
          return `${hours}:${minutesStr} ${ampm}`;
        };
        const vacation = {
        dateFrom,
        dateTo,
        days,
        timeIn:formatCurrentTime(),
        date:date?date:new Date().toISOString().split("T")[0],
        invoice: nextInvoiceNumber,
        }

        employee.vacation.push(vacation)
        await employee.save()
        res.status(200).json({ message: `Vacation completed Successfully to ${employee.employeeName} for ${days} days!` })
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


module.exports = {addEmployee,delEmployee,updateEmployee,getEmployees,addNewSalaryMonth,deleteSalaryMonth,updateSalaryMonth,addSalary,addMultipleSalaries,delSalary,updateSalary,addPaymentReturn,addVacation,addVacationFinish,delVacation,updateVacation };
