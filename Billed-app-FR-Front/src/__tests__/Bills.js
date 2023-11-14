/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"
import mockStore from "../__mocks__/store"


import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const windowIcon = await waitFor(() => screen.getByTestId('icon-window'))
      //  = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains("active-icon")).toBe(true)

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      console.log("dates Test",datesSorted);
      expect(dates).toEqual(datesSorted)
    })
    // rajouter describe click eyes icon
    test("When i click on eyes the modal should open", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      const store = null
      const billPage = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })


      const handleClickIconEye = jest.fn(Bills.handleClickIconEye);
      const eyes = screen.getAllByTestId('icon-eye')[0]

      $.fn.modal = jest.fn() // modal mock
      // eyes.forEach(icon=>{
      //   icon.addEventListener('click', handleClickIconEye)
        
      // })
      eyes.addEventListener('click', handleClickIconEye)

      fireEvent.click(eyes)
      // userEvent.click(eyes)
      
      expect(handleClickIconEye).toHaveBeenCalled()

      expect($.fn.modal).toHaveBeenCalled()
      // const modale = document.querySelector(".modal-dialog")
      // expect(modale).toBeTruthy()
      
    })
  })

  // clic bouton - page newBill
  // test icone oeil

  // récupérer les données getBills
  // erreur 500 -> erreur API
  // erreur 404 -> données n'existent pas
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
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

        window.onNavigate(ROUTES_PATH.Bills)
        const consoleErrorSpy = jest.spyOn(console,"error")
        await new Promise(process.nextTick);
        expect(consoleErrorSpy).toBeCalledWith(new Error("Erreur 500"))
        //const message = await screen.getByText(/Erreur 500/)
        //expect(message).toBeTruthy()
    })
  })

  // erreur 404
  // erreur 200  -> OK


})
