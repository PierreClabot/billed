/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { Bill } from "../../../Billed-app-FR-Back/models"



describe("Given I am connected as an employee and I create a new bill", () => {
  describe("When I create a new bill",()=>{

    test("Then bill icon in vertical layout should be highlighted", async () => {

      const iconeNewBill =  screen.getByTestId('icon-mail')
      expect(iconeNewBill.classList.contains("active-icon")).toBe(true)

    })
  })

  describe("When I do not fill fields and I click on newBill button", () => {
    test("Then It should renders newBill page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const inputExpenseType = screen.getByTestId("expense-type");
      expect(inputExpenseType.value).toBe("");

      const inputExpenseName = screen.getByTestId("expense-name");
      expect(inputExpenseName.value).toBe("");

      const inputDate = screen.getByTestId("datepicker");
      expect(inputDate.value).toBe("");

      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount.value).toBe("");

      const inputVat = screen.getByTestId("vat");
      expect(inputVat.value).toBe("");

      const inputPct = screen.getByTestId("pcd"); 
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


  describe("When I do fill fields in incorrect format and I click on newBill button", () => {
    test("Then It should renders newBill page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: "pasunedate" } });
      expect(inputDate.value).toBe("pasunedate");

      const inputAmount = screen.getByTestId("amount"); // Montant
      fireEvent.change(inputAmount, { target: { value: "pasunnombre" } });
      expect(inputAmount.value).toBe("pasunnombre");

      const inputVat = screen.getByTestId("vat"); // TVA
      fireEvent.change(inputVat, { target: { value: "pasunnombre" } });
      expect(inputVat.value).toBe("pasunnombre");

      const inputPct = screen.getByTestId("pcd"); // %
      fireEvent.change(inputPct, { target: { value: "pasunnombre" } });
      expect(inputPct.value).toBe("pasunnombre");

      const inputFile = screen.getByTestId("file"); // %
      fireEvent.change(inputFile, { target: { value: "pasbonformat" } });
      expect(inputFile.value).toBe("pasbonformat");

      const form = screen.getByTestId("form-new-bill"); // Supprimer l'event par defaut du bouton
      const handleSubmit = jest.fn((e) => e.preventDefault());
      form.addEventListener("submit",handleSubmit)
      fireEvent.submit(form)
      // Ajouter message d'erreur s'il n'existe pas
      expect(screen.getByTestId("form-new-bill")).toBeTruthy(); // ????
    })
  })

  describe("When I do fill fields in correct format and I click on newBill button", () => {
    test("Then I should be saved new bill", () => {
      document.body.innerHTML = LoginUI();
      const inputData = {
        expenseType : "expenseType",
        expenseName : "expenseName",
        date : "DD/MM/YYYY",
        amount : "348",
        vat : "70",
        pct : "20",
        file : ".png",
      };

      const inputExpenseType = screen.getByTestId("expense-type");
      fireEvent.change(inputExpenseType, { target: { value: inputData.expenseType } });
      expect(inputExpenseType.value).toBe("");

      const inputExpenseName = screen.getByTestId("expense-name");
      fireEvent.change(inputExpenseName, { target: { value: inputData.expenseName } });
      expect(inputExpenseName.value).toBe("");

      const inputDate = screen.getByTestId("datepicker");
      fireEvent.change(inputDate, { target: { value: inputData.date } });
      expect(inputDate.value).toBe("");

      const inputAmount = screen.getByTestId("amount"); // Montant
      fireEvent.change(inputAmount, { target: { value: inputData.amount } });
      expect(inputAmount.value).toBe("pasunnombre");

      const inputVat = screen.getByTestId("vat"); // TVA
      fireEvent.change(inputVat, { target: { value: inputData.vat } });
      expect(inputVat.value).toBe("pasunnombre");

      const inputPct = screen.getByTestId("pcd"); // %
      fireEvent.change(inputPct, { target: { value: inputData.pct } });
      expect(inputPct.value).toBe("pasunnombre");

      const inputFile = screen.getByTestId("file"); // %
      fireEvent.change(inputFile, { target: { value: inputDate.file } });
      expect(inputFile.value).toBe("pasbonformat");

      const form = screen.getByTestId("form-new-bill");

      // *****************************************************************************************************
      describe("Respons server",()=>{
        test("No problem, err200",()=>{
          const bills = new Bill()
          const mock = jest.fn();
          bills.create = mock;
          mock.mockReturnValue("err200") // A REVOIR
        })
      })
      // localStorage should be populated with form data
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => null),
          setItem: jest.fn(() => null),
        },
        writable: true,
      });

      // we have to mock navigation to test it
      window.onNavigate(ROUTES_PATH.Dashboard)

      let PREVIOUS_LOCATION = "";


      const handleSubmit = jest.fn(login.handleSubmitEmployee);
      login.login = jest.fn().mockResolvedValue({});
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({
          type: "Employee",
          email: inputData.email,
          password: inputData.password,
          status: "connected",
        })
      );
    });

    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });
  });
  
})
