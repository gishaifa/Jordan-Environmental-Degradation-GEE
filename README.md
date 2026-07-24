#  Jordan Environmental & Land Degradation Assessment Platform (GEE)

An automated cloud-computing framework built on **Google Earth Engine (GEE)** to analyze, monitor, and assess national-level environmental indicators and land degradation trajectories across **Jordan (2018–2025)**.
## 📌 Overview
This repository contains a high-resolution, satellite-based monitoring framework for assessing **Land Use & Land Cover (LULC)**, vegetation health, soil organic carbon (SOC) dynamics, and overall environmental degradation across **Jordan**. 

Powered by **Google Earth Engine (GEE)** and **Sentinel-2 MSI imagery (2025)**, this platform provides actionable spatial proxies for baseline degradation assessment and environmental decision-making.
---
## 🛠️ Key Spectral Indices Included

| Index | Name | Primary Application |
| :--- | :--- | :--- |
| **NDVI** | Normalized Difference Vegetation Index | Vegetation density & biomass health |
| **SAVI** | Soil-Adjusted Vegetation Index | Minimizing soil background effects in arid zones |
| **NDWI** | Normalized Difference Water Index | Surface water monitoring & soil moisture proxies |
| **NBR** | Normalized Burn Ratio | Fire severity & land degradation impact |

---
## 🎯 Key Environmental & Degradation Indicators Covered
* **🌱 Soil Organic Carbon (SOC) Dynamics**: Arid-soil calibrated indexing for monitoring soil organic carbon proxy changes.
* **🌿 Vegetation Productivity Trajectory**: Multi-temporal anomaly detection (NDVI/SAVI) to map vegetation dynamics under climatic pressures.
* **🗺️ Land Cover & Surface Dynamics (LULC)**: High-resolution satellite monitoring (Sentinel-2) for tracking agricultural expansion vs. degraded lands.
* **🌍 Integrated Land Degradation Neutrality (LDN)**: Synthesized national spatial mapping for SDG Indicator 15.3.1.

## 🚀 How to Run
1. Open the **Google Earth Engine Code Editor**.
2. Copy the contents of the desired script from the `scripts/` directory (e.g., `03_Jordan_LULC_Environmental_Proxy.js`).
3. Paste into the GEE Code Editor and click **Run**.

---

## 💻 Repository Structure & Modular Scripts

All algorithms are fully implemented using the JavaScript API for GEE and optimized for fast cloud execution across the Kingdom's geographic boundary:

| Script File | Focused Environmental Indicator | Primary Inputs |
| :--- | :--- | :--- |
| **`01_Jordan_Vegetation_Productivity.js`** | Vegetation Dynamics & Trend Analysis | Sentinel-2 NDVI Time-series |
| **`02_Jordan_SOC_Dynamics_Proxy.js`** | Soil Organic Carbon & Brightness Dynamics | Sentinel-2 Red/NIR/SWIR & BSI |
| **`03_Jordan_LULC_Environmental_Proxy.js`**| Land Cover Classification & Soil Bareness | Multispectral Machine Spectral Thresholds |
| **`04_Jordan_Integrated_Land_Degradation_Map.js`**| Comprehensive National Degradation Map | Combined SDG 15.3.1 Sub-indicators |

---
[![Platform](https://img.shields.io/badge/Google%20Earth%20Engine-JavaScript-blue)](https://earthengine.google.com/)
[![Satellite](https://img.shields.io/badge/Data-Sentinel--2%20MSI-green)](https://sentinels.copernicus.eu/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 👤 Developed By
**Dr. Haifa AL Mohammad**  
*Senior Geospatial Analysis & GeoAI Specialist*

