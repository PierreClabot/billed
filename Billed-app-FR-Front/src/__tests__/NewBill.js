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


describe("Given I am connected as an employee", () => {
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
      
      const iconeNewBill = await screen.getByTestId('icon-mail')
      expect(iconeNewBill.classList.contains("active-icon")).toBeTruthy();

    })

    test("page title should be 'Envoyez une note de frais'", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const title = document.querySelector(".content-title").textContent.trim()
      expect(title).toBe("Envoyer une note de frais");

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
    // extension image
    // new File
    test("Extension image",()=>{
      
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

      const file = new File([""], "upload.jpg");
      const arrExtension = ["png","jpg","jpeg"]
    
      const fileName = file.name.split(".");
      const fileExtension = fileName[1];
      expect(arrExtension).toContain(fileExtension)
      // ajouter l'input et l'event appeler handleChangeFile

      //const inputUpload = screen.getByTestId("file")
      // inputUpload.addEventListener("change",()=>{
      //   var extension = inputUpload.value;
      //   expect(arrExtension).toContain(extension)
      // })     


      // const formNewBill = screen.getByTestId("form-new-bill");
      // const handleSubmit = jest.fn(newBillPage.handleSubmit);
      // newBillPage.updateBill = jest.fn();
			// formNewBill.addEventListener("submit", handleSubmit);
			// fireEvent.submit(formNewBill);

      // expect(handleSubmit).toHaveBeenCalled();
      // expect(newBillPage.updateBill).toHaveBeenCalled();
    })
    test("Then i change file",()=>{
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

      const file = new File([""], "upload.jpg",{type:"image/jpeg"});

      // const formNewBill = screen.getByTestId("form-new-bill");
      const inputFile = screen.getByTestId("file");
      // inputFile.value = file

      const handleChangeFile = jest.fn(newBillPage.handleChangeFile);
      
			inputFile.addEventListener("change", handleChangeFile);
			fireEvent.change(inputFile,{target:{files:[file]} });

      // expect(handleSubmit).toHaveBeenCalled();
      // expect(newBillPage.updateBill).toHaveBeenCalled();

    })
    // Ajouter un test concernant la vérification du fichier image expect handleChangeFile
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
        expenseType : "Voyage",
        expenseName : "Vol France",
        date : "03/10/2022",
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

describe("Given I am a user connected as Employee", () => {
  
  // forEach
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
          update : () => Promise.reject(new Error('Erreur 500')),
          list : () =>  { 
            return Promise.reject(new Error("Erreur 500"))
          }
        }})



        const newBillPage = new NewBill({
          document, onNavigate, store:mockStore, localStorage: window.localStorage
        })
        const consoleErrorSpy = jest.spyOn(console,"error")
        const formNewBill = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e)=>newBillPage.handleSubmit(e));
        formNewBill.addEventListener("submit",handleSubmit)
        fireEvent.submit(formNewBill)

      await new Promise(process.nextTick);
      expect(consoleErrorSpy).toBeCalledWith(new Error("Erreur 500"))

    })
  })



})
