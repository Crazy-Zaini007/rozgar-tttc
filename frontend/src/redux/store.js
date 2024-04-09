import { configureStore } from '@reduxjs/toolkit'
import settingReducer from './reducers/settingSlice'
import entryReducer from './reducers/entrySlice'
import supplierReducer from './reducers/supplierSlice'
import agentReducer from './reducers/agentSlice'
import candidateReducer from './reducers/candidateSlice'
import azadVisaReducer from './reducers/azadVisaSlice'
import ticketReducer from './reducers/ticketSlice'
import visitReducer from './reducers/visitSlice'
import expenseReducer from './reducers/expenseSlice'
import creditsDebitsWCReducer from './reducers/creditsDebitsWCSlice'
import creditsDebitsWOCReducer from './reducers/creditsDebitsWOCSlice'
import cashInHand from './reducers/cashInHandSlice'
import protectors from './reducers/protectorSlice'
import employees from './reducers/employeeSlice'
import assetsPayments from './reducers/assetsSlice'

export const store = configureStore({
  reducer: {
    setting: settingReducer,
    enteries: entryReducer,
    suppliers: supplierReducer,
    agents: agentReducer,
    candidates: candidateReducer,
    azadVisa: azadVisaReducer,
    tickets: ticketReducer,
    visits: visitReducer,
    expenses: expenseReducer,
    creditsDebitsWC: creditsDebitsWCReducer,
    creditsDebitsWOC: creditsDebitsWOCReducer,
    cashInHand:cashInHand,
    protectors:protectors,
    employees:employees,
    assetsPayments:assetsPayments
  }
})