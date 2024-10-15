import Storage from "./Storage";
class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();

    document.getElementById("limit").value = this._calorieLimit;
  }
  //Public methods/ API
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._render();
    this._displayNewMeal(meal);
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._render();
    this._displayNewWorkout(workout);
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeWorkout(id);
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  //Private methods
  _displayCaloriesTotal() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }
  _displayCaloriesLimit() {
    const totalCaloriesLimitEl = document.getElementById("calories-limit");
    totalCaloriesLimitEl.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const consumedCaloriesEl = document.getElementById("calories-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    consumedCaloriesEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const burnedCaloriesEl = document.getElementById("calories-burned");
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    burnedCaloriesEl.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const remainingCaloriesEl = document.getElementById("calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    const progressEl = document.getElementById("calorie-progress");
    remainingCaloriesEl.innerHTML = remaining;

    if (remaining <= 0) {
      remainingCaloriesEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      remainingCaloriesEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
    } else {
      remainingCaloriesEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      remainingCaloriesEl.parentElement.parentElement.classList.add("bg-light");
      progressEl.classList.remove("bg-danger");
      progressEl.classList.add("bg-success");
    }
  }

  _displayCaloriesProgress() {
    const progressEl = document.getElementById("calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    progressEl.style.width = `${percentage}%`;
  }

  _displayNewMeal(meal) {
    const mealItemsEl = document.getElementById("meal-items");
    const itemEl = document.createElement("div");
    itemEl.classList.add("card", "my-2");
    itemEl.setAttribute("data-id", meal.id);
    itemEl.innerHTML = `          
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                      class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                      ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              `;
    mealItemsEl.appendChild(itemEl);
  }

  _displayNewWorkout(workout) {
    const workoutItemsEl = document.getElementById("workout-items");
    const itemEl = document.createElement("div");
    itemEl.classList.add("card", "my-2");
    itemEl.setAttribute("data-id", workout.id);
    itemEl.innerHTML = `
                <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${workout.name}</h4>
                    <div
                      class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                      ${workout.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              `;
    workoutItemsEl.appendChild(itemEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

export default CalorieTracker;