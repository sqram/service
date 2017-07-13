### Environment
- Arch Linux x86_64
- Node 8.1.3
- NPM 4.6.1

### Dependencies
Node 8.x and NPM 4.x are needed to run the program.  
It will likely work with Node 7.x as well.

##### Installing the Node packages needed
Inside `service` dir, run `npm i`.  
It will install the Geocodio and Jasmine packages.

#### Running the script
from the `service` directory, run `node index.js input.txt`
### Technical Decisions
The main decision was deciding which service to use
to convert a geo coordinate into an address.
My main choices were between Google Maps API and
[Geocod](https://geocod.io/) . I chose geocod as it was
very straight forward and simple to get an API key and start.

### Running automated tests
I created some unit tests for the Polygon class' main
methods - `fetchCoordsFromAPI` and `checkAddresses`.
I used Jasmine [Jasmine](https://jasmine.github.io/) as it is one of the most used and trusted test framework in the Node community.  

__To run the unit tests:__
from the `service` directory, run `jasmine spec/Polygon.spec.js`
To make the test fail, add some bogus address (ie, 09999) to `input.test.js`
_please note_: A lot bogus addresses like "hello world" or "bruce" will still work as the API will return a coordinate - even though it's not an address, it will find establishments or businesses that best matches the name - causing the tests not to fail.

### Challenges
Biggest challenge in this task was using Jasmine in a proper and clean way.
My original code was not in OO, but to make it easier for jasmine (copying and pasting the Polygon class in the test file, with minimal changes), I rewrote it in an OO paradigm.

 