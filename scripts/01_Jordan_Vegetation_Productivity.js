/**
 * ==============================================================================
 * Module 1: Vegetation Productivity Trajectory (SDG 15.3.1 Sub-indicator)
 * Author: Dr. Haifa AL Mohammad
 * Description: This standalone script isolates the vegetation productivity 
 *              dynamics across Jordan (2018-2025) to identify areas of 
 *              ecological improvement, stability, or degradation.
 * ==============================================================================
 */

// 1. Define ROI
var jordan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(ee.Filter.eq('country_na', 'Jordan'));
Map.centerObject(jordan, 7);

// 2. Timeframe & Image Collection filtering
var bands = ['B4', 'B8', 'QA60'];
var maskClouds = function(image) {
  var qa = image.select('QA60');
  var mask = qa.bitwiseAnd(1<<10).eq(0).and(qa.bitwiseAnd(1<<11).eq(0));
  return image.updateMask(mask).divide(10000);
};

var s2_18 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterBounds(jordan)
              .filterDate('2018-01-01', '2018-12-31').filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
              .select(bands).map(maskClouds).median().clip(jordan);

var s2_25 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterBounds(jordan)
              .filterDate('2025-01-01', '2025-12-31').filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
              .select(bands).map(maskClouds).median().clip(jordan);

// 3. Productivity Calculation (NDVI Trajectory)
var ndvi_18 = s2_18.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndvi_25 = s2_25.normalizedDifference(['B8', 'B4']).rename('NDVI');
var prodChange = ndvi_25.subtract(ndvi_18);

// 4. Classification & Visualization
var prodStatus = ee.Image(0).where(prodChange.lt(-0.05), 1).where(prodChange.gte(-0.05).and(prodChange.lte(0.05)), 2).where(prodChange.gt(0.05), 3).clip(jordan);
var vis = {min: 1, max: 3, palette: ['#d7191c', '#ffffbf', '#1a9641']};
Map.addLayer(prodStatus, vis, 'Vegetation Productivity (2018-2025)');

// 5. Dedicated Legend
var legend = ui.Panel({style: {position: 'bottom-right', padding: '10px'}});
legend.add(ui.Label('Vegetation Productivity', {fontWeight: 'bold'}));
var addRow = function(color, name) {
  return ui.Panel({
    widgets: [ui.Label({style: {backgroundColor: color, padding: '8px', margin: '0 4px'}}), ui.Label(name)],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};
legend.add(addRow('#d7191c', 'Decreased (تراجع)'));
legend.add(addRow('#ffffbf', 'Stable (مستقر)'));
legend.add(addRow('#1a9641', 'Increased (زيادة)'));
Map.add(legend);
