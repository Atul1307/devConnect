# List of APIs

## AuthRouter

- POST/Login
- POST/Signup
- POST/Logout

## profileRouter

- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password

## User router

- GET/user/connections
- GET/user/requests
- GET/user/feed - Homepage/Dashboard

## ConnectionRequestRouter

- POST/request/send/interested/:id
- POST/request/send/ignored/:id
- POST/request/review/accepted/:requestId
- POST/request/review/rejected/:requestId

Status: ignore, interested, accepted, rejected
