## API Documentation
​
##### POST /api/auth/login
* Login
* Params
```
{
  "firstName": "string",
  "lastName": "string",
  "email": "string"
}
```
* Returns an access token (expires in 3h)
```
{
  "accessToken": "string" (JWT Token)
}
```
​
##### GET /api/auth/profile (authentication required)
* Get the user profile
* Returns user object
```
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "enum: UserRoleType",
  "createdAt": Date,
  "updatedAt": Date
}
```
