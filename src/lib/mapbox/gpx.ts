export function parseGpx(gpxString: string): [number, number][] {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(gpxString, 'application/xml')
    if (doc.querySelector('parsererror')) return []

    const points = Array.from(doc.querySelectorAll('trkpt, rtept, wpt'))
    return points.map(pt => [
      parseFloat(pt.getAttribute('lon') ?? '0'),
      parseFloat(pt.getAttribute('lat') ?? '0'),
    ] as [number, number]).filter(([lng, lat]) => !isNaN(lng) && !isNaN(lat))
  } catch {
    return []
  }
}

export function generateGpx(
  coordinates: [number, number][],
  name: string,
): string {
  const points = coordinates
    .map(([lng, lat]) => `    <trkpt lat="${lat}" lon="${lng}"></trkpt>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="VeloTrek"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata><name>${name}</name></metadata>
  <trk>
    <name>${name}</name>
    <trkseg>
${points}
    </trkseg>
  </trk>
</gpx>`
}
