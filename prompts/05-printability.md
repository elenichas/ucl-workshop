# 05 · Profiles and printability → `stage-04-printability`

## The request

```text
Step 4 of PLAN.md. Printers and materials as editable profiles in
config/printers.ts and config/materials.ts — typical values for: desktop
plastic, large-format plastic, clay paste, resin; PLA, PETG, stoneware,
porcelain, resin, each with colours. Then printability rules in
checks/printability.ts: each rule small, returning pass/warn/fail and one
sentence with numbers. Tests: the default vase passes in PLA; a 2 mm wall
fails in clay; clay is stricter about overhangs; a tall vase on a tiny
foot is unstable; every printer only lists materials that exist.
```

## Notes

- All 6 tests passed first time — because the algorithm already measured what the rules need (`maxOverhangDeg`, `minWall`, `maxDiameter`). **Good outputs from step 2 made step 4 easy.**
- The values are *typical*, not from the real lab. Each file opens with a comment saying so, and that the technician knows better.
- Clay shrinkage (~12–14 %) was added as an estimate, because "my vase came out of the kiln smaller" is a classic surprise.
