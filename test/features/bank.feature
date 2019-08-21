Feature: Bank

  As a bank service user
  I need to be able to add my bank details
  In order to do my Business

  Background: Bank service is up
    Given service is active

  Scenario: I get a 200 response
    When user sends a valid POST request
    Then the user gets a 200 status response
    