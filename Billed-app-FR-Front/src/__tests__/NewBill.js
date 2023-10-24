/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { Bill } from "../../../Billed-app-FR-Back/models"
import { localStorageMock } from "../__mocks__/localStorage.js"
import router from "../app/Router"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import mockStore from "../__mocks__/store"


describe("Given I am connected as an employee and I create a new bill", () => {
  describe("When I create a new bill",()=>{

    test("Then bill icon in vertical layout should be highlighted", async () => {


      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      
      // const html = NewBillUI()
      // document.body.innerHTML = html

      // await waitFor(()=>{
      //   screen.getByTestId('icon-mail')
      // }) 
      const iconeNewBill = await screen.getByTestId('icon-mail')
      expect(iconeNewBill.classList.contains("active-icon")).toBeTruthy();

    })
  })

  describe("When I do not fill fields and I click on newBill button", () => {
    test("Then It should renders newBill page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      // const inputExpenseType = screen.getByTestId("expense-type");
      // expect(inputExpenseType.value).toBe("");

      const inputExpenseName = screen.getByTestId("expense-name");
      expect(inputExpenseName.value).toBe("");

      const inputDate = screen.getByTestId("datepicker");
      expect(inputDate.value).toBe("");

      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount.value).toBe("");

      const inputVat = screen.getByTestId("vat");
      expect(inputVat.value).toBe("");

      const inputPct = screen.getByTestId("pct"); 
      expect(inputPct.value).toBe("");

      const inputFile = screen.getByTestId("file"); 
      expect(inputFile.value).toBe("");

      const form = screen.getByTestId("form-new-bill"); // Delete default event on form
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit",handleSubmit)
      fireEvent.submit(form)
      // Ajouter message d'erreur s'il n'existe pas
      expect(screen.getByTestId("form-new-bill")).toBeTruthy(); // ?
    })
  })

  describe("When I do fill fields and I click on newBill button", () => {
    test("Then I should be saved new bill", () => {
      document.body.innerHTML = NewBillUI();
      
      
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      const newBillPage = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })

      

      const inputData = {
        expenseType : "expenseType",
        expenseName : "expenseName",
        date : "DD/MM/YYYY",
        amount : "348",
        vat : "70",
        pct : "20",
        fileName : "facturefreemobile.jpg",
        fileUrl : "../assets/images/facturefreemobile.jpg"
      };

      screen.getByTestId("expense-type").value = inputData.expenseType
      screen.getByTestId("datepicker").value = inputData.date
      screen.getByTestId("expense-name").value = inputData.expenseName
      screen.getByTestId("amount").value = inputData.amount
      screen.getByTestId("vat").value = inputData.vat
      screen.getByTestId("pct").value = inputData.pct
      newBillPage.fileName = inputData.fileName
      newBillPage.fileUrl = inputData.fileUrl

      const formNewBill = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBillPage.handleSubmit);
      newBillPage.updateBill = jest.fn();
			formNewBill.addEventListener("submit", handleSubmit);
			fireEvent.submit(formNewBill);

      expect(handleSubmit).toHaveBeenCalled();
      expect(newBillPage.updateBill).toHaveBeenCalled();

    
    });

  });
  /********************************************************************************************************************* */
})

describe("Given I am a user connected as Admin", () => {
  
  describe("When an error occurs on API", () => {
    
  

    test("fetches bills from an API and fails with 500 message error", async () => {
      
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))
  
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
  
      router()
  
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      mockStore.bills = jest.fn().mockImplementation(() => {
        return {
          list : () =>  { // ?
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      // mockStore.bills = jest.fn().mockImplementation(() => {
      //   return Promise.reject(new Error("Erreur 500"))
      // })

        const newBillPage = new NewBill({
          document, onNavigate, store:mockStore, localStorage: window.localStorage
        })
        const consoleErrorSpy = jest.spyOn(console,"error")
        const formNewBill = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e)=>newBillPage.handleSubmit(e));
        formNewBill.addEventListener("submit",handleSubmit)
        fireEvent.submit(formNewBill)
      window.onNavigate(ROUTES_PATH.NewBill)
      await new Promise(process.nextTick);
      expect(consoleErrorSpy).toBeCalledWith(new Error("Erreur 500"))  
      //const message = await screen.getByText(/Erreur 500/)
      //expect(message).toBeTruthy()
    })

    // test("fetches messages from an API and fails with 500 message error", async () => {

    //   mockStore.bills.mockImplementationOnce(() => {
    //     return {
    //       list : () =>  {
    //         return Promise.reject(new Error("Erreur 500"))
    //       }
    //     }})

    //   window.onNavigate(ROUTES_PATH.Dashboard)
    //   await new Promise(process.nextTick);
    //   const message = await screen.getByText(/Erreur 500/)
    //   expect(message).toBeTruthy()
    // })
  })

})
