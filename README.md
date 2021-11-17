# Real-time Online Chess App 
## https://chess-app-neon.vercel.app
### Built with Next.Js, Firebase for Auth, TailwindCSS, Socket.IO
#### Hosted on Vercel, Socket.IO (Node.js) server hosted on Heroku
##### Websocket Server Repo https://github.com/aimanjaffer/chess-websocket-server
---
User Stories Covered:
1) A user should be able to challenge another player to a game by typing their username and pressing a send request button.
2) A user should see a notification if they recieve a challenge with the requester's name/username and option to accept or decline
3) User should be assigned either the white or black pieces randomly
4) Only the user with white pieces should be able to make the first move
5) On clicking a piece all valid squares that it can move to should be shown
6) A user should be able to make only valid chess moves and only when it is their turn to play
7) Once a valid move is made, they should not be able to make any move out of turn
8) A player should only be able to move a piece if it is theirs. They should not be able to move the opponent's piece
9) Once a move is made the new piece should replace the piece that was previously on that square. The piece that was previously on the square is captured/dead
10) Once a move is made the square that the piece was on originally should be cleared of the piece.
11) Once a move is made, check if the other player has at least one valid move. If not, then perform check for either a stalemate or checkmate
12) If a stalemate position is reached then the game state should be changed from ongoing to draw
13) If a checkmate position is reached then the game state is changed to complete and the last player to make a move is the winner.
14) A piece other than knight should not be able to jump over another piece
15) If the king is in check the only valid moves are those that move the king to safety or block the check with another piece
16) If a king is in double check or more then the king is forced to move
17) A piece that is blocking the king from an attacker cannot be moved
18) A piece cannot be moved to a square that is occupied by a piece of the same color
19) Added functionality to inform players if their challenge is rejected
---
Roadmap:
1) Improve the UI design
2) Functionality for castling, pawn promotion, en passant
3) Drag and drop pieces instead of clicking
