const Geocodio = require('geocodio')
const fs = require('fs')


const geo = new Geocodio({
  api_key: '5bff56f256f19f612a9958561216691a9a955f7'
})


class Polygon
{

  constructor(boundaryNodes)
  {
    this.xBoundaries = []
    this.yBoundaries = []
    this.addressesCoords = []

    // Point-in-Polygon algorithm needs an array of
    // X's and Y's nodes coords as arguments. Set them here
    boundaryNodes.forEach(b => {
      this.xBoundaries.push(b[0])
      this.yBoundaries.push(b[1])
    })
  }


  /*
   * Converts physical addresses to coordinates
   * by using the geocod API.
   *
   * @paramm {array} addresses - Array of physical addresses
   */

  fetchCoordsFromAPI(addresses)
  {
    const self = this

    return new Promise((resolve, reject) => {
      geo.post('geocode', addresses, function(err, res) {
        if (err)
        {
          reject(false)
        }

        // Grab latitude and longitude of each address
        res.results.forEach(r => {
          const {lat, lng} = (r.response.results[0].location)
          self.addressesCoords.push( [lat, lng] )
        })

        resolve(true)
      })
    })
  }


  /*
   * Checks if an address (its coordibate at this point)
   * is inside the boundary.
   *
   * @param {array} coords - array of addresses coordinate arrays
   *   ie, [ [2.222, 1.111] ]
   */

  checkAddresses(coords)
  {
    try
    {
      this.addressesCoords.forEach( (address, i) => {
        const bool = this.isPointInPolygon(address[0], address[1], this.xBoundaries, this.yBoundaries)
        const flag = bool ? '' : 'NOT'
        //console.log(`${addresses[i]}\n|__ is ${flag} in boundary.\n`)
      })
      // function ran successfully with no errors.
      return true
    }
    catch(e)
    {
      return false
    }


  }


  /*
   * Point in Polygon algorithm.
   * @param {float} x - Address' x coordinate
   * @param {float} y - Address' y coordinatw
   * @param {array} polyXs - array of polygon's nodes X values
   * @param {array} polyYs - array of polygon's nodes Y values
   */

  isPointInPolygon(x, y, polyXs, polyYs)
  {

    // cc = cornersCount
    var cc = boundaryNodes.length - 1

    var isOdd = false

    for (let i = 0; i < cc; i++)
    {
      if (
      (polyYs[i] < y && polyYs[cc] >= y || polyYs[cc] < y && polyYs[i] >= y) &&
      (polyXs[i] <= x || polyXs[cc] <= x))
      {
        if (polyXs[i] + (y - polyYs[i]) / (polyYs[cc] - polyYs[i]) * (polyXs[cc] - polyXs[i]) < x)
        {
          isOdd =! isOdd;
        }
      }
      cc = i;
    }

    return isOdd
  }

}


try
{
  var file_contents = fs.readFileSync(`${__dirname}/../input.test.txt`, 'utf-8')

}
catch (e)
{
  throw `Could not open file because:\n--> ${e}`
}


// Get input data from file
var file_lines = file_contents.split("\n")

// Convert data tuples to js lists
var boundaryNodes = "[" + file_lines.shift()
  .replace(/\(/g, '[')
  .replace(/\)/g, ']') + "]";


boundaryNodes = JSON.parse(boundaryNodes)

// Remaining lines are addresses
const addresses = file_lines.filter(e => e)

var polygon =  new Polygon(boundaryNodes)

var fetchedCoordinates

describe('Fetch coords from API', function() {

  beforeEach(function(done) {
    coordinates = polygon.fetchCoordsFromAPI(addresses)
    .then(function(r) {
      fetchedCoordinates = r
      done()
    })
    .catch(function() {
      return false
    })
  })

  it('Should return true or false', function() {
    expect(fetchedCoordinates).toEqual(true)
  })
})


describe('Check if addresses are in boundary', function() {
  it('Should return true or false for each address', function() {
    expect(polygon.checkAddresses(polygon.addressesCoords)).toEqual(true)
  })
})