/**
 * ==============================================================================
 * Project: Jordan Environmental & Land Degradation Platform
 * Indicator: Land Use & Land Cover (LULC) Environmental Proxy (2025)
 * Developer: Dr. Haifa AL Mohammad
 * Platform: Google Earth Engine (JavaScript API)
 * Description: High-resolution national LULC proxy mapping using Sentinel-2 
 *              spectral indices for baseline degradation assessment.
 * ==============================================================================
 */

// 1. Define ROI (Jordan Boundary)
var jordan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
               .filter(ee.Filter.eq('country_na', 'Jordan'));

Map.centerObject(jordan, 7);

// 2. Sentinel-2 Composite (2025)
var maskClouds = function(img) {
  var qa = img.select('QA60');
  var mask = qa.bitwiseAnd(1<<10).eq(0).and(qa.bitwiseAnd(1<<11).eq(0));
  return img.updateMask(mask).divide(10000);
};

var s2_2025 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(jordan)
                  .filterDate('2025-01-01', '2025-12-31')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .select(['B2', 'B4', 'B8', 'B11', 'QA60'])
                  .map(maskClouds).median().clip(jordan);

// 3. Spectral Indices Calculation
var ndvi = s2_2025.normalizedDifference(['B8', 'B4']).rename('NDVI');
var bsi = s2_2025.expression(
  '((RED + SWIR) - (NIR + BLUE)) / ((RED + SWIR) + (NIR + BLUE))', {
    'RED': s2_2025.select('B4'),
    'SWIR': s2_2025.select('B11'),
    'NIR': s2_2025.select('B8'),
    'BLUE': s2_2025.select('B2')
}).rename('BSI');

// 4. Threshold-based LULC Classification
var lulc = ee.Image(0)
  .where(ndvi.gt(0.35), 1) // Vegetated / Agricultural Lands
  .where(ndvi.lte(0.35).and(bsi.gt(0.1)), 2) // Bare / Degraded Soil
  .where(ndvi.lte(0.15).and(bsi.lte(0.1)), 3) // Built-up / Urban / Other
  .clip(jordan);

var vis = {min: 1, max: 3, palette: ['#2ca02c', '#d62728', '#7f7f7f']};
Map.addLayer(lulc, vis, 'LULC Environmental Proxy (2025)');

// 5. Dedicated LULC Legend
var legend = ui.Panel({style: {position: 'bottom-right', padding: '10px'}});
legend.add(ui.Label('LULC Proxy Classes (2025)', {fontWeight: 'bold', fontSize: '13px'}));

var addRow = function(color, name) {
  return ui.Panel({
    widgets: [
      ui.Label({style: {backgroundColor: color, padding: '7px', margin: '0 4px'}}),
      ui.Label(name, {style: {fontSize: '11px'}})
    ],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(addRow('#2ca02c', 'Agricultural / Vegetated Land'));
legend.add(addRow('#d62728', 'Bare / Degraded Soil'));
legend.add(addRow('#7f7f7f', 'Urban / Built-up / Water'));

Map.add(legend);
