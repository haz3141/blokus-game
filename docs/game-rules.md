# Cornerfall Rules Summary

Cornerfall is an original corner-placement polyomino strategy game for 2 or 4 players.

## Board Configurations

- 2-player duel: `14x14` board, start corners are northwest and southeast
- 4-player classic: `20x20` board, start corners are northwest, northeast, southeast, and southwest

## Piece Set

- each player has the same 21-piece set
- pieces include the single-square piece, domino, trominoes, tetrominoes, and pentominoes
- transforms are canonicalized so duplicate rotations and flips are removed in the rules engine

## Turn Rules

- players place exactly one piece on their turn
- the opening placement must cover the player’s assigned start corner
- later placements must touch the same player’s existing area at a corner
- later placements must not share an edge with the same player’s placed pieces
- pieces may touch opponents by edges or corners
- placements cannot overlap existing cells or extend outside the board
- a player may pass only when they have no legal placement remaining

## Endgame and Scoring

- the game ends when every player is unable to make another legal move
- score starts as the negative count of remaining unplayed squares
- a player who uses every piece gains a `+15` completion bonus
- a player who uses every piece and finishes with the single-square piece gains an extra `+5`
- the highest total score wins
