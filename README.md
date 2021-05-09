Repository for Ex Wanderlust, as conducted in WOP 2021.

Front-end is built in [React](https://reactjs.org) with [Redux](https://redux.js.org) as state management.

Back-end is built in [ExpressJS](https://expressjs.com).

Communication between Front-end and Back-end will take place using Socket.IO

Main flow of socket communication:
1. Establish connection with authentication
2. Client receive copy of game state from server.
3. Client, upon receiving action, pushes a payload to server which informs the server to update its game state.
4. Server will push the game state to all clients. Clients will only receive the necessary components.
5. Client will periodically resync with server.

There are two main types of clients:
1. Player client -- used by teams.
2. Mentor client -- used by mentors.

Sequence of events:
1. Player selects an action, which will be made known to the mentor.
2. Mentor has the authority to accept or reject this action.
3. If rejected, the server will return to its prior state.
4. If accepted, the server will update its state and update clients accordingly.
