import Bacon from 'baconjs'

// TODO!!!
function connect(getdataF) {
  const rawStream = new Bacon.Bus()

  if (!navigator.geolocation || !navigator.geolocation.watchPosition) {
    throw 'Missing geolocation API'
  }
  const success = event => {
    const position = {
      path: 'navigation.position',
      latitude: event.lat,
      longitude: event.lon
    }
    const sog = {
      path: 'navigation.speedOverGround',
      value: event.speed
    }
    const heading = {
      path: 'navigation.headingTrue',
      value: event.heading
    }
    const vesselData = {
      'navigation.position': position,
      'navigation.speedOverGround': sog,
      'navigation.headingTrue': heading
    }
    rawStream.push(vesselData)
      console.log("GPS päivitetty");
  }
  const error = err => {
    console.log('Geolocation error', err)
  }

  const options = {
    enableHighAccuracy: true,
    maximumAge: 5000
  }

  window.setInterval(() => {
    let data = getdataF();
    success(data);
  },5000);

  navigator.geolocation.watchPosition(success, error, options)

  return {
    connectionState: Bacon.constant('connected'),
    selfData: rawStream,
    aisData: Bacon.constant({})
  }
}

export default connect;
