import Bacon from 'baconjs'


function connect(getdataF) {
  const rawStream = new Bacon.Bus();
      const success = event => {
    const position = {
      path: 'navigation.position',
      latitude: event.lat,
      longitude: event.lon
    };
    const sog = {
      path: 'navigation.speedOverGround',
      value: event.speed
    };
    const heading = {
      path: 'navigation.headingTrue',
      value: event.heading
    };
    const vesselData = {
      'navigation.position': position,
      'navigation.speedOverGround': sog,
      'navigation.headingTrue': heading
    };
    rawStream.push(vesselData);
  };

  window.setInterval(() => {
    let data = getdataF();
    success(data);
  },5000);

  return {
    connectionState: Bacon.constant('connected'),
    selfData: rawStream,
    aisData: Bacon.constant({})
  }
}

export default connect;
