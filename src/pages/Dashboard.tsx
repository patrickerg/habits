import React, { useState, useEffect, ChangeEvent } from "react";
import { nanoid } from "nanoid";

type Habit = {
  id: string;
  name: string;
  type: "good" | "bad";
};

function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const storedHabits = localStorage.getItem("habits");
    return storedHabits ? JSON.parse(storedHabits) : [];
  });
  const [newHabit, setNewHabit] = useState("");
  const [habitType, setHabitType] = useState<"good" | "bad">("good");
  const [goalAmount, setGoalAmount] = useState(() => {
    const val = localStorage.getItem("goalAmount");
    return val ? Number(val) : 0;
  });
  const [goalName, setGoalName] = useState("");
  const [goalValue, setGoalValue] = useState<number | null>(() => {
    const val = localStorage.getItem("goalValue");
    return val ? Number(val) : null;
  });
  const [goalInput, setGoalInput] = useState("");
  const [goalTargetInput, setGoalTargetInput] = useState("");

  // Load once
  useEffect(() => {
    const stored = {
      habits: localStorage.getItem("habits"),
      amount: localStorage.getItem("goalAmount"),
      name: localStorage.getItem("goalName"),
      value: localStorage.getItem("goalValue"),
    };

    if (stored.habits) setHabits(JSON.parse(stored.habits));
    if (stored.amount) setGoalAmount(Number(stored.amount));
    if (stored.name) setGoalName(stored.name);
    if (stored.value) setGoalValue(Number(stored.value));
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("goalAmount", goalAmount.toString());
    localStorage.setItem("goalName", goalName);
    if (goalValue !== null) {
      localStorage.setItem("goalValue", goalValue.toString());
    } else {
      localStorage.removeItem("goalValue");
    }
  }, [habits, goalAmount, goalName, goalValue]);

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: nanoid(),
      name: newHabit,
      type: habitType,
    };
    setHabits((prev) => [...prev, habit]);
    setNewHabit("");
  };

  const deleteHabit = (id: string) =>
    setHabits((prev) => prev.filter((h) => h.id !== id));

  const handleHabitClick = (habit: Habit) =>
    setGoalAmount((prev) => prev + (habit.type === "good" ? 10 : -20));

  const handleSetGoal = () => {
    if (!goalInput.trim() || isNaN(Number(goalTargetInput))) return;
    setGoalName(goalInput);
    setGoalValue(Number(goalTargetInput));
    setGoalInput("");
    setGoalTargetInput("");
  };

  const removeGoal = () => {
    setGoalName("");
    setGoalValue(null);
    setGoalAmount(0);
    localStorage.removeItem("goalName");
    localStorage.removeItem("goalValue");
    localStorage.removeItem("goalAmount");
  };

  const progress =
    goalValue && goalValue > 0
      ? Math.min((goalAmount / goalValue) * 100, 100)
      : 0;

  return (
    <div className="dashboard_wrapper">
      <div className="goal_container">
        {goalName && goalValue !== null ? (
          <>
            <h1>
              {goalName}
              <button className="remove_goal" onClick={removeGoal}>
                ✖️
              </button>
            </h1>
            <h2>
              raised: {goalAmount}/{goalValue} $
            </h2>
            <div className="progress_bar_wrapper">
              <div className="progress_bar" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <div className="set_goal_form">
            <input
              type="text"
              placeholder="Enter your goal name"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />
            <input
              type="number"
              placeholder="Enter goal value"
              value={goalTargetInput}
              onChange={(e) => setGoalTargetInput(e.target.value)}
            />
            <button onClick={handleSetGoal}>Set Goal</button>
          </div>
        )}
      </div>

      <div className="dashboard_content">
        <div className="good_habits">
          <h3>Good habits +10$</h3>
          <div className="habits">
            {habits
              .filter((h) => h.type === "good")
              .map((habit) => (
                <div
                  key={habit.id}
                  className="good_habit"
                  onClick={() => handleHabitClick(habit)}
                >
                  <span>{habit.name}</span>
                  <button
                    className="delete_button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHabit(habit.id);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="bad_habits">
          <h3>Bad habits -20$</h3>
          <div className="habits">
            {habits
              .filter((h) => h.type === "bad")
              .map((habit) => (
                <div
                  key={habit.id}
                  className="bad_habit"
                  onClick={() => handleHabitClick(habit)}
                >
                  <span>{habit.name}</span>
                  <button
                    className="delete_button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHabit(habit.id);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="input_section">
        <input
          type="text"
          placeholder="Add new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <select
          value={habitType}
          onChange={(e) => setHabitType(e.target.value as "good" | "bad")}
        >
          <option value="good">Good Habit</option>
          <option value="bad">Bad Habit</option>
        </select>
        <button className="add_button" onClick={addHabit}>
          Add
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
