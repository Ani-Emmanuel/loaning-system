**STEPS TO RUN THE PROJECT**

 - Clone the project to you system
 - Navigate into the project
 - run npm install or yarn install
 -  run npm start or yarn start
 - In the root directory create a file called **.env**
 
 
**ADD TO EVN FILE**

    {
	    PORT =  The port your program will run on
	    DBURL = Your database url link (MongoDB)
	    TESTDBURL = Your database test url link (MongoDB)
	    SECRET = Your secret
	    PAYSTACKSECRET = your paystack secret key (gotten from your paystack dashboard)
	    PAYSTACKPUBLIC = your paystack public key (gotten from your paystack dashboard)
	    RATE =  Rate you will charge per month
    }


**Request data**

     - Route
	    method: **POST**
	    to create an account
	    **(your host)/api/v1/register**
    
     - User Registration
        {
        "fullname": "your fullname",
        "email": "Your email address",
        "role": "Role either user or admin",
        "password": "your password"
        }

     - Route
	    method: **POST**
	    to loggin one loan
	    **(your host)/api/v1/login**
    	 
     - User Login
	    {
	    "email": "your account email",
	    "password": "Your account password"
	    }

     - Route
	    method: **POST**
	    to pay for loan
	    **(your host)/api/v1/payloan/(loanId)**
    	
     - Pay Loan
	    {
	      "amount": "Total amount you are owning"
	    }

     - Route
	    method: **POST**
	    to get request for loan
	    **(your host)/api/v1/requestloan**
    	 
     - Request Loan
	    {
	       "amount": "Number amount you want to borrow",
	       "duration": "Number, of months your pay back. eg 2 means two months"
	    }

     - Route
	    method: **PATCH**
	    to get one loan
	    **(your host)/api/v1/updateloan/(loanId)**
    	 
     - Update Loan
	    {
	      "status": "It can on be one of this:- 'PENDING',  'ACCEPTED',  'REVIEWING',  'REJECTED',  'DISBURSED'
	    }

    - Route
    	method: **GET**
    	to get one loan
    	 **(your host)/api/v1/oneloan/(loanId)** 

     - Route
    	 method: **GET**
    	to get all loans
    	 **(your host)/api/v1/allloan**

    - Route
    	method: **GET**
    	to get all disbursted Loans
    	 **(your host)/api/v1/disburstedloans**
    
    
    - Route
    	method: **GET**
    	to get all paid Loans
    	 **(your host)/api/v1/paidloans**
    
    - Route
    	method: **GET**
    	to verify payment
    	 **(your host)/api/v1/verifypayment/(loanId)**

**Note**

- Apart from Registration and Login every other requests needs you to use **Token** so you need to add the token as a bearer token. 
- Some Links can only be accessed by an admin
