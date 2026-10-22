# Worksheet · map your vase configurator

Everyone builds a vase configurator; this is where you decide what *yours* offers. Draw this **before** you build, on paper or in a file. Then compare it with ours (the **How it works** button in the configurator, or slides 17–18 of the course deck; slide 20 is the exercise), and finally ask Claude to draw the map from your code.

## 1 · The columns

```
START FROM → CONTROLS IT EXPOSES → HOW THE FORM IS DESCRIBED → ITS OWN STEPS → SHARED PIPELINE → RESULTS
```

| Start from | Controls it exposes | How the form is described | Its own steps | What changes in the results |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

## 2 · The shared part

- **Shared inputs** (every start uses them):
- **Shared steps** (in order):
- **Outputs**:

## 3 · Questions to answer

1. Which control appears in **every** start? Which only in one?
2. Which start has a value that is **derived** rather than set? (Ours: the sphere's height.)
3. Which start can't be measured from its parameters and has to be measured from the mesh? Why?
4. Which printability rule depends on the start, and which don't care?
5. If you added a tenth start tomorrow, which files would change?

## 4 · Then ask Claude

```text
Read my code and draw the system map of my configurator as a table:
start → controls → representation → steps → shared pipeline → results.
Where does it differ from what I intended in PLAN.md?
```

The differences are the interesting part: either the code drifted from your intention, or your intention was vaguer than you thought.
