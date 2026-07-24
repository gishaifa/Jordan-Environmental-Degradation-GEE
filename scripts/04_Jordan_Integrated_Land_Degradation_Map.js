/**
 * ==============================================================================
 * Project: Integrated Land Degradation Neutrality (LDN) Assessment - Jordan
 * Sub-Indicators: LULC Dynamics, SOC Mapping Proxy, & Vegetation Productivity
 * Time Period: 2018 - 2025
 * Author: Dr. Haifa AL Mohammad
 * Platform: Google Earth Engine (JavaScript API)
 * ==============================================================================
 */

// ==============================================================================
// 1. REGION OF INTEREST & TIME FRAME
// ==============================================================================
var jordan = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017')
               .filter(ee.Filter.eq('country_na', 'Jordan'));

Map.centerObject(jordan, 7);
Map.addLayer(jordan, {color: 'black'}, 'Jordan Boundary', false);

var startYear = 2018;
var endYear = 2025;

var startDatePast = ee.Date.fromYMD(startYear, 1, 1);
var endDatePast   = ee.Date.fromYMD(startYear, 12, 31);

var startDatePres = ee.Date.fromYMD(endYear, 1, 1);
var endDatePres   = ee.Date.fromYMD(endYear, 12, 31);

// Select core multi-spectral bands
var bandsToKeep = ['B2', 'B3', 'B4', 'B8', 'B11', 'QA60'];

function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}

// Composite Generation
var s2_2018 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(jordan)
                  .filterDate(startDatePast, endDatePast)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .select(bandsToKeep)
                  .map(maskS2clouds)
                  .median()
                  .clip(jordan);

var s2_2025 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
                  .filterBounds(jordan)
                  .filterDate(startDatePres, endDatePres)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .select(bandsToKeep)
                  .map(maskS2clouds)
                  .median()
                  .clip(jordan);

// ==============================================================================
// 2. SPECTRAL INDICES CALCULATION
// ==============================================================================
function addIndices(img) {
  var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
  
  var bsi = img.expression(
    '((RED + SWIR) - (NIR + BLUE)) / ((RED + SWIR) + (NIR + BLUE))', {
      'RED': img.select('B4'),
      'SWIR': img.select('B11'),
      'NIR': img.select('B8'),
      'BLUE': img.select('B2')
  }).rename('BSI');
  
  var socProxy = ndvi.subtract(bsi).divide(ndvi.add(bsi)).rename('SOC_Proxy');
  
  return img.addBands([ndvi, bsi, socProxy]);
}

var s2_2018_ind = addIndices(s2_2018);
var s2_2025_ind = addIndices(s2_2025);

// ==============================================================================
// 3. SUB-INDICATORS & STANDALONE MAP
// ==============================================================================
// LULC Proxy
var lulc2025 = ee.Image(0)
  .where(s2_2025_ind.select('NDVI').gt(0.35), 1)
  .where(s2_2025_ind.select('NDVI').lte(0.35).and(s2_2025_ind.select('BSI').gt(0.1)), 2)
  .where(s2_2025_ind.select('NDVI').lte(0.15).and(s2_2025_ind.select('BSI').lte(0.1)), 3)
  .clip(jordan);

var lulcVis = {min: 1, max: 3, palette: ['#2ca02c', '#d62728', '#7f7f7f']};

// SOC Dynamics Proxy
var socChange = s2_2025_ind.select('SOC_Proxy').subtract(s2_2018_ind.select('SOC_Proxy')).rename('SOC_Change');
var socVis = {min: -0.2, max: 0.2, palette: ['#8c510a', '#f5f5f5', '#01665e']};

// Vegetation Productivity Trajectory (NDVI Change)
var ndviDiff = s2_2025_ind.select('NDVI').subtract(s2_2018_ind.select('NDVI')).rename('NDVI_Change');
var ndviVis = {min: -0.2, max: 0.2, palette: ['#red', '#ffffff', '#green']};

// Standalone Land Degradation Map
var landDegradationMap = ee.Image(0)
  .where(ndviDiff.lt(-0.05).or(socChange.lt(-0.1)), 1)
  .where(ndviDiff.gte(-0.05).and(ndviDiff.lte(0.05)), 2)
  .where(ndviDiff.gt(0.05).or(socChange.gt(0.1)), 3)
  .clip(jordan);

var ldnVis = {min: 1, max: 3, palette: ['#d7191c', '#ffffbf', '#2b83ba']};

// ==============================================================================
// 4. DISPLAY MAP LAYERS (FIXED VISUALIZATIONS)
// ==============================================================================
Map.addLayer(s2_2025, {bands: ['B8', 'B4', 'B3'], min: 0, max: 0.3}, 'Sentinel-2 Composite (2025)', false);
Map.addLayer(lulc2025, lulcVis, '1. LULC Map (2025)', false);
Map.addLayer(socChange, socVis, '2. SOC Dynamics Proxy (2018-2025)', false);
Map.addLayer(ndviDiff, {min: -0.2, max: 0.2, palette: ['#d7191c', '#ffffff', '#1b7837']}, '3. Vegetation Productivity Change (2018-2025)', false);
Map.addLayer(landDegradationMap, ldnVis, '🌍 Standalone Land Degradation Map (2018-2025)', true);

// ==============================================================================
// 5. ALL-INDICATORS COMPREHENSIVE LEGEND PANEL
// ==============================================================================
var mainLegend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 12px',
    maxHeight: '350px',
    width: '230px'
  }
});

var legendTitle = ui.Label({
  value: 'LDN Indicators Legend',
  style: {fontWeight: 'bold', fontSize: '14px', margin: '0 0 6px 0'}
});
mainLegend.add(legendTitle);

// Helper function to create section header
var addSectionHeader = function(title) {
  var header = ui.Label({
    value: title,
    style: {fontWeight: 'bold', fontSize: '11px', margin: '6px 0 2px 0', color: '#333'}
  });
  mainLegend.add(header);
};

// Helper function to create legend row
var addRow = function(color, name) {
  var colorBox = ui.Label({
    style: {backgroundColor: color, padding: '6px', margin: '0 0 2px 0'}
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 2px 5px', fontSize: '11px'}
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

// --- SECTION 1: STANDALONE LDN MAP ---
addSectionHeader('🌍 Land Degradation Status');
mainLegend.add(addRow('#d7191c', 'Degraded (تدهور)'));
mainLegend.add(addRow('#ffffbf', 'Stable (مستقر)'));
mainLegend.add(addRow('#2b83ba', 'Improved (تحسن)'));

// --- SECTION 2: LULC CLASSES ---
addSectionHeader('🌱 LULC Proxy (2025)');
mainLegend.add(addRow('#2ca02c', 'Vegetation / Agriculture'));
mainLegend.add(addRow('#d62728', 'Bare / Degraded Soil'));
mainLegend.add(addRow('#7f7f7f', 'Urban / Built-up'));

// --- SECTION 3: SOC & PRODUCTIVITY DYNAMICS ---
addSectionHeader('📉 SOC & Vegetation Change');
mainLegend.add(addRow('#8c510a', 'Loss / Reduction'));
mainLegend.add(addRow('#f5f5f5', 'No Change / Neutral'));
mainLegend.add(addRow('#01665e', 'Gain / Improvement'));

Map.add(mainLegend);

// ==============================================================================
// 6. EXPORT
// ==============================================================================
Export.image.toDrive({
  image: landDegradationMap,
  description: 'Jordan_Standalone_Land_Degradation_Map_2018_2025',
  scale: 30,
  region: jordan,
  maxPixels: 1e13
});
