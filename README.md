## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node v12+ and npm

## Running project

### Start server

Install the dependencies

```
npm run start:dev
```

and start the server

```
npm run start
```

or with hot reload

```
npm run start:dev
```

### Running the tests

Run the following command to run all tests (unit and integration tests)

```
npm run test
```

## Technical decisions

I chose to work with Nodejs & Typescript because of the ease I have with these technologies.
I'm using a framework called Nestjs, where there are many good things to stand out, and here are some of them:
Modules, Dependency Injection, Pipes, Exception Filters, and a lot of other things that really help in development.

### Code structure and architecture

The project was created based on the concepts of Clean Architecture, where we have the following layers:

### Domain Layer
In this layer, we define business rules related to entities with a specific problem, in this case, risk calculation for insurance lines.
This is the most important and isolated layer that we should have in our project, regardless of details of implementations or communications
with low-level layers (like an infrastructure layer, for example)

### Usecases
This layer has a great relationship with the domain layer, so much so that in some clean architecture implementations,
the use cases are within the domain itself.

Use cases represent the current behavior of our application, which means, communicating with entities in the domain layer
and orchestrate according to the need for business. Like the domain layer, this layer should not depend on the implementations
of low-level layers. For example, if we need to save user data in a database, there must be an abstraction
for this database (repositories) to be called here, and this implementation, in fact, must be in the infrastructure layer.

### Presentation
This layer holds all the entry points of our application, such as HTTP Server, the CLI, websockets, graphic user interfaces (in case of desktop applications), and so on.
It should not have any knowledge about business rules, use cases, persistence technologies, and not even about other kinds of logic! It should only receive user input (like URL parameters), pass it on to the use case and finally return a response to the user.

There are many other details about Clean Architecture, but these are the main points to highlight for the purpose of this
project.

### How to implement a new insurance line

Based on the decisions I mentioned above, every business rule is focused on the domain
application and these rules are extensible.
To create a new insurance line, just implement an abstract class and add
in the case of use this new class to be processed.


## Tests

### Unit Tests

For unit tests, I focused more on domain entities and use cases, as they are the most important part of the application.

### Integration Tests

I wrote integration tests focused on the rules that determine the risk score for each insurance line.

![test-suite](https://i.imgur.com/R8yE0tO.png)

## Comments
I really enjoyed taking this test. The challenge is pretty cool that reflects several problems that we solved day by day.
I hope you like and any feedback will be welcome.

# Origin Backend Take-Home Assignment
Origin offers its users an insurance package personalized to their specific needs without requiring the user to understand anything about insurance. This allows Origin to act as their *de facto* insurance advisor.

Origin determines the user’s insurance needs by asking personal & risk-related questions and gathering information about the user’s vehicle and house. Using this data, Origin determines their risk profile for **each** line of insurance and then suggests an insurance plan (`"economic"`, `"regular"`, `"responsible"`) corresponding to her risk profile.

For this assignment, you will create a simple version of that application by coding a simple API endpoint that receives a JSON payload with the user information and returns her risk profile (JSON again) – you don’t have to worry about the frontend of the application.

## The input
First, the would-be frontend of this application asks the user for her **personal information**. Then, it lets her add her **house** and **vehicle**. Finally, it asks her to answer 3 binary **risk questions**. The result produces a JSON payload, posted to the application’s API endpoint, like this example:

```JSON
{
  "age": 35,
  "dependents": 2,
  "house": {"ownership_status": "owned"},
  "income": 0,
  "marital_status": "married",
  "risk_questions": [0, 1, 0],
  "vehicle": {"year": 2018}
}
```

### User attributes
All user attributes are required:

- Age (an integer equal or greater than 0).
- The number of dependents (an integer equal or greater than 0).
- Income (an integer equal or greater than 0).
- Marital status (`"single"` or `"married"`).
- Risk answers (an array with 3 booleans).

### House
Users can have 0 or 1 house. When they do, it has just one attribute: `ownership_status`, which can be `"owned"` or `"mortgaged"`.

### Vehicle
Users can have 0 or 1 vehicle. When they do, it has just one attribute: a positive integer corresponding to the `year` it was manufactured.

## The risk algorithm
The application receives the JSON payload through the API endpoint and transforms it into a *risk profile* by calculating a *risk score* for each line of insurance (life, disability, home & auto) based on the information provided by the user.

First, it calculates the *base score* by summing the answers from the risk questions, resulting in a number ranging from 0 to 3. Then, it applies the following rules to determine a *risk score* for each line of insurance.

1. If the user doesn’t have income, vehicles or houses, she is ineligible for disability, auto, and home insurance, respectively.
2. If the user is over 60 years old, she is ineligible for disability and life insurance.
3. If the user is under 30 years old, deduct 2 risk points from all lines of insurance. If she is between 30 and 40 years old, deduct 1.
4. If her income is above $200k, deduct 1 risk point from all lines of insurance.
5. If the user's house is mortgaged, add 1 risk point to her home score and add 1 risk point to her disability score.
6. If the user has dependents, add 1 risk point to both the disability and life scores.
7. If the user is married, add 1 risk point to the life score and remove 1 risk point from disability.
8. If the user's vehicle was produced in the last 5 years, add 1 risk point to that vehicle’s score.

This algorithm results in a final score for each line of insurance, which should be processed using the following ranges:

- **0 and below** maps to **“economic”**.
- **1 and 2** maps to **“regular”**.
- **3 and above** maps to **“responsible”**.


## The output
Considering the data provided above, the application should return the following JSON payload:

```JSON
{
    "auto": "regular",
    "disability": "ineligible",
    "home": "economic",
    "life": "regular"
}
```

## Criteria
You may use any language and framework provided that you build a solid system with an emphasis on code quality, simplicity, readability, maintainability, and reliability, particularly regarding architecture and testing. We'd prefer it if you used Python, but it's just that – a preference.

Be aware that Origin will mainly take into consideration the following evaluation criteria:
* How clean and organized your code is;
* If you implemented the business rules correctly;
* How good your automated tests are (qualitative over quantitative).

Other important notes:
* Develop a extensible recommendation engine
* Add to the README file: (1) instructions to run the code; (2) what were the main technical decisions you made; (3) relevant comments about your project
* You must use English in your code and also in your docs

This assignment should be doable in less than one day. We expect you to learn fast, **communicate with us**, and make decisions regarding its implementation & scope to achieve the expected results on time.

It is not necessary to build the screens a user would interact with, however, as the API is intended to power a user-facing application, we expect the implementation to be as close as possible to what would be necessary in real-life. Consider another developer would get your project/repository to evolve and implement new features from exactly where you stopped.
