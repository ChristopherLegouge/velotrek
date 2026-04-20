import { parseGpx, generateGpx } from '@/lib/mapbox/gpx'

const SAMPLE_GPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  <trk><trkseg>
    <trkpt lat="48.8534" lon="2.3488"><ele>35</ele></trkpt>
    <trkpt lat="47.9029" lon="1.9087"><ele>100</ele></trkpt>
  </trkseg></trk>
</gpx>`

describe('GPX utilities', () => {
  it('parseGpx extracts coordinates from GPX string', () => {
    const coords = parseGpx(SAMPLE_GPX)
    expect(coords).toHaveLength(2)
    expect(coords[0]).toEqual([2.3488, 48.8534])
    expect(coords[1]).toEqual([1.9087, 47.9029])
  })

  it('generateGpx creates valid GPX from coordinates', () => {
    const gpx = generateGpx([[2.3488, 48.8534], [1.9087, 47.9029]], 'Test Route')
    expect(gpx).toContain('<gpx')
    expect(gpx).toContain('lat="48.8534"')
    expect(gpx).toContain('lon="2.3488"')
    expect(gpx).toContain('Test Route')
  })

  it('parseGpx returns empty array for invalid GPX', () => {
    expect(parseGpx('not xml')).toEqual([])
  })
})
