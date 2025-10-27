// NASA EONET API - Natural disaster data
export async function GET() {
  try {
    const response = await fetch(
      'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50',
      { 
        next: { revalidate: 300 }, // Cache for 5 minutes
        signal: AbortSignal.timeout(5000)
      }
    );

    if (!response.ok) {
      throw new Error(`EONET API failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data
    const disasters = data.events
      .filter(event => event.geometry && event.geometry.length > 0)
      .map(event => {
        const latestGeometry = event.geometry[event.geometry.length - 1];
        const coords = latestGeometry.coordinates;
        
        return {
          id: event.id,
          title: event.title,
          category: event.categories[0]?.title || 'Unknown',
          lat: coords[1],
          lon: coords[0],
          date: latestGeometry.date
        };
      })

      .slice(0, 15); // Limit to 15 most recent

    return Response.json({ 
      disasters,
      count: disasters.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('EONET API error:', error);
    
    // Fallback data
    return Response.json({ 
      disasters: getFallbackDisasters(),
      count: 10,
      fallback: true,
      timestamp: Date.now()
    });
  }
}

function getFallbackDisasters() {
  return [
    { id: '1', title: 'Wildfire - California', category: 'Wildfires', lat: 37.7749, lon: -122.4194 },
    { id: '2', title: 'Earthquake - Japan', category: 'Earthquakes', lat: 35.6762, lon: 139.6503 },
    { id: '3', title: 'Severe Storm - Florida', category: 'Severe Storms', lat: 27.9947, lon: -81.7603 },
    { id: '4', title: 'Flood - Bangladesh', category: 'Floods', lat: 23.685, lon: 90.3563 },
    { id: '5', title: 'Wildfire - Australia', category: 'Wildfires', lat: -33.8688, lon: 151.2093 },
    { id: '6', title: 'Volcano - Indonesia', category: 'Volcanoes', lat: -7.5417, lon: 110.7167 },
    { id: '7', title: 'Severe Storm - India', category: 'Severe Storms', lat: 19.076, lon: 72.8777 },
    { id: '8', title: 'Earthquake - Chile', category: 'Earthquakes', lat: -33.4489, lon: -70.6693 },
    { id: '9', title: 'Wildfire - Greece', category: 'Wildfires', lat: 37.9838, lon: 23.7275 },
    { id: '10', title: 'Flood - Pakistan', category: 'Floods', lat: 30.3753, lon: 69.3451 }
  ];
}

