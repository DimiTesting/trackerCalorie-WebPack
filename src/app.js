import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse} from "bootstrap"; 
import CalorieTracker from "./Tracker";
import {Meal, Workout} from "./Item";

import "./css/bootstrap.css"; 
import "./css/style.css"




class App{
    constructor() {
        this._tracker = new CalorieTracker()
        document.getElementById("meal-form").addEventListener("submit", this._newItem.bind(this, "meal"))
        document.getElementById("workout-form").addEventListener("submit", this._newItem.bind(this, "workout"))
        document.getElementById("meal-items").addEventListener("click", this._removeItem.bind(this, "meal"))
        document.getElementById("workout-items").addEventListener("click", this._removeItem.bind(this, "workout"))
        document.getElementById("filter-meals").addEventListener("keyup", this._filterItem.bind(this, "meal"))
        document.getElementById("filter-workouts").addEventListener("keyup", this._filterItem.bind(this, "workout"))
        document.getElementById("reset").addEventListener("click", this._reset.bind(this))
        document.getElementById("limit-form").addEventListener("submit", this._setLimit.bind(this))
        this._tracker.loadItems()
    }

    _newItem(type, e){
        e.preventDefault()
        const name = document.getElementById(`${type}-name`)
        const calories = document.getElementById(`${type}-calories`)

        if (name.value === "" || calories.value === "") {
            alert("Please fill the blank spaces")
            return
        }

        if (type==="meal") {
            const meal = new Meal(name.value, +calories.value)
            this._tracker.addMeal(meal)
        } else {
            const workout = new Workout(name.value, +calories.value)
            this._tracker.addWorkout(workout)
        }
        
        name.value = ""
        calories.value = ""

        const collapseItem = document.getElementById(`collapse-${type}`)
        const bsCollapse = new Collapse(collapseItem, {toogle:true})
    }

    _removeItem(type, e) {

        if (e.target.classList.contains("fa-xmark") || e.target.classList.contains("delete")) {
            if (confirm("Would you like to remove this item")) {
                const id = e.target.closest(".card").getAttribute("data-id")
                type === "meal" ? this._tracker.removeMeal(id): this._tracker.removeWorkout(id)
                e.target.closest(".card").remove()
            }
        }
    }

    _filterItem(type, e) {
        const text = e.target.value.toLowerCase()
        const allItems = document.querySelectorAll(`#${type}-items .card`)
        allItems.forEach((item)=> {
            const name = item.firstElementChild.firstElementChild.textContent
            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = "block"
            } else {
                item.style.display = "none"
            }
        })
    }

    _setLimit(e) {

        e.preventDefault()
        const limit = document.getElementById("limit")
        
        if (limit.value === "") {
            alert("Please set a limit")
            return
        } 

        this._tracker.setLimit(+limit.value)
        limit.value = ""

        const modalEl = document.getElementById("limit-modal")
        const modal = Modal.getInstance(modalEl)
        modal.hide()
    
    }

    _reset() {
        document.getElementById("meal-items").innerHTML = ""
        document.getElementById("workout-items").innerHTML = ""
        document.getElementById("filter-meals").value = ""
        document.getElementById("filter-workouts").value = ""
        this._tracker.reset()
    }
}

const app = new App()