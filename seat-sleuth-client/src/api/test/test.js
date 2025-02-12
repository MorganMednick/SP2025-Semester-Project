fetch("https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=cmtAt6aY2NgARV2FksRnE42AY2Hy3mmA")
.then(res => console.info(res))
.catch(err => console.error(err));