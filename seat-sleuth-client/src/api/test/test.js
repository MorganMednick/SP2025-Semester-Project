fetch(`https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=${import.meta.env.VITE_TM_API_KEY}`)
.then(res => console.info(res))
.catch(err => console.error(err));