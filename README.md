# Goal

Basic exercise tracker that saves workout info to localstorage on the phone.
workout categories are:

1.  push
2.  pull
3.  legs
4.  cardio

# Data

- saves:
  - the workout type (push, pull, legs)
  - date of workout
  - exercise data:
    - all-time quantity for specific exercise
    - weight
    - reps
    - distance (cardio)
    - pace (cardio)
- data can be exported

# UI

## Initial Page

- select exercise type:
  - push
  - pull
  - legs
  - cardio (optional- the main scope is for resistance training)

- displays next recommended workout type in rotation.

## Selected Workout Page

- vertical list of all exercises in current workout.
  - exercises ordered by all-time quantity ascending.
  - embeds video or gif for exercise form/technique
- displays input form for current exercise: weight and reps
  - exercise inputs are minimal, + & - signs for incrementing reps and weight
- history: displays reps and weight of last time exercise was done.
- Buttons: Skip & Done

## React Components

### Core

- WorkoutSelector (Initial Page)
- CurrentExercise (Active Workout)
- History & Settings
- Nav
- Exercise Library

### Granular

- ExerciseCard
  - Displays exercise name, target sets
- SetCard
  - Displays:
    - set number ("Set 1")
    - previous workout info for that set as a reference
    - weight and rep input fields
    - URL to exercise
- FUTURE/OPTIONAL: Rest timer
  - used for taking a break.
