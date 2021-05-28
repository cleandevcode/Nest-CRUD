## API Documentation
​
##### POST /api/clients (authentication required)
* Register client
* Params
```
{
  "generalInfo": {
    "firstName": "string"
    "middleName": "string"
    "lastName": "string"
    "gender": "string"
    "birthday": "string"
    "addressLine1": "string"
    "addressLine2": "string" (optional)
    "postalCode": "string"
    "city": "string"
    "province": "string"
    "phoneNumber": "string"
    "mobileNumber": "string"
    "email": "string"
  },
  "medicalInfo": {
    "provincialHealthCareIdCode": "string"
    "height": "number" (optional)
    "weight": "number" (optional)
    "conditions": "string"
    "possibleContraindications": "string" (optional)             
  },
  "primaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string" (optional) need to check if default value [null]
   },
  "secondaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string"
  }
}
```
* Returns client object
```
{
  "id": "string"
  "generalInfo": {
    "firstName": "string"
    "middleName": "string"
    "lastName": "string"
    "gender": "string"
    "birthday": "string"
    "addressLine1": "string"
    "addressLine2": "string" (optional)
    "postalCode": "string"
    "city": "string"
    "province": "string"
    "phoneNumber": "string"
    "mobileNumber": "string"
    "email": "string"
  },
  "medicalInfo": {
    "provincialHealthCareIdCode": "string"
    "height": "number" (optional)
    "weight": "number" (optional)
    "conditions": "string"
    "possibleContraindications": "string" (optional)             
  },
  "primaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string" (optional) need to check if default value [null]
   },
  "secondaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string"
  }
}
```
​
##### GET /api/clients (authentication required)
* Get all clients
* Params
```
  skip: "number" skip entries 
  take: "number" take amount 
  keyword: "string" (searching)
```
* Returns client object array and count
```
{
  "clients": [
    {
      "id": "string"
      "generalInfo": {
        "firstName": "string"
        "middleName": "string"
        "lastName": "string"
        "gender": "string"
        "birthday": "string"
        "addressLine1": "string"
        "addressLine2": "string" (optional)
        "postalCode": "string"
        "city": "string"
        "province": "string"
        "phoneNumber": "string"
        "mobileNumber": "string"
        "email": "string"
      },
      "medicalInfo": {
        "provincialHealthCareIdCode": "string"
        "height": "number" (optional)
        "weight": "number" (optional)
        "conditions": "string"
        "possibleContraindications": "string" (optional)             
      },
      "primaryInsuranceInfo": {
        "carrierId": "string"
        "groupNumber": "string"
        "clientId": "string"
        "patientCode": "string"
        "cardholderIdentity": "string"
        "relationship": "string" (optional) need to check if default value [null]
       },
      "secondaryInsuranceInfo": {
        "carrierId": "string"
        "groupNumber": "string"
        "clientId": "string"
        "patientCode": "string"
        "cardholderIdentity": "string"
        "relationship": "string"
      }
    }
  ],
  "count": "number" (it should be total count of clients)
}
```
​
##### PUT /api/client/{id} (authentication required)
* Update client
* Params
```
{
  "generalInfo": {
    "firstName": "string"
    "middleName": "string"
    "lastName": "string"
    "gender": "string"
    "birthday": "string"
    "addressLine1": "string"
    "addressLine2": "string" (optional)
    "postalCode": "string"
    "city": "string"
    "province": "string"
    "phoneNumber": "string"
    "mobileNumber": "string"
    "email": "string"
  },
  "medicalInfo": {
    "provincialHealthCareIdCode": "string"
    "height": "number" (optional)
    "weight": "number" (optional)
    "conditions": "string"
    "possibleContraindications": "string" (optional)             
  },
  "primaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string" (optional) need to check if default value [null]
   },
  "secondaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string"
  }
}
```
* Returns client object
```
{
  "id": "string"
  "generalInfo": {
    "firstName": "string"
    "middleName": "string"
    "lastName": "string"
    "gender": "string"
    "birthday": "string"
    "addressLine1": "string"
    "addressLine2": "string" (optional)
    "postalCode": "string"
    "city": "string"
    "province": "string"
    "phoneNumber": "string"
    "mobileNumber": "string"
    "email": "string"
  },
  "medicalInfo": {
    "provincialHealthCareIdCode": "string"
    "height": "number" (optional)
    "weight": "number" (optional)
    "conditions": "string"
    "possibleContraindications": "string" (optional)             
  },
  "primaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string" (optional) need to check if default value [null]
   },
  "secondaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string"
  }
}
```
​
##### GET /api/client/{id} (authentication required)
* Get client by id
* Returns client object
```
{
  "id": "string"
  "generalInfo": {
    "firstName": "string"
    "middleName": "string"
    "lastName": "string"
    "gender": "string"
    "birthday": "string"
    "addressLine1": "string"
    "addressLine2": "string" (optional)
    "postalCode": "string"
    "city": "string"
    "province": "string"
    "phoneNumber": "string"
    "mobileNumber": "string"
    "email": "string"
  },
  "medicalInfo": {
    "provincialHealthCareIdCode": "string"
    "height": "number" (optional)
    "weight": "number" (optional)
    "conditions": "string"
    "possibleContraindications": "string" (optional)             
  },
  "primaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string" (optional) need to check if default value [null]
   },
  "secondaryInsuranceInfo": {
    "carrierId": "string"
    "groupNumber": "string"
    "clientId": "string"
    "patientCode": "string"
    "cardholderIdentity": "string"
    "relationship": "string"
  }
}
```
