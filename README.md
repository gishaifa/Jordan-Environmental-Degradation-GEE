#  Jordan Environmental & Land Degradation Assessment Platform (GEE)

An automated cloud-computing framework built on **Google Earth Engine (GEE)** to analyze, monitor, and assess national-level environmental indicators and land degradation trajectories across **Jordan (2018–2025)**.

---

## 🎯 Key Environmental & Degradation Indicators Covered
* **🌱 Soil Organic Carbon (SOC) Dynamics**: Arid-soil calibrated indexing for monitoring soil organic carbon proxy changes.
* **🌿 Vegetation Productivity Trajectory**: Multi-temporal anomaly detection (NDVI/SAVI) to map vegetation dynamics under climatic pressures.
* **🗺️ Land Cover & Surface Dynamics (LULC)**: High-resolution satellite monitoring (Sentinel-2) for tracking agricultural expansion vs. degraded lands.
* **🌍 Integrated Land Degradation Neutrality (LDN)**: Synthesized national spatial mapping for SDG Indicator 15.3.1.

---

## 💻 Repository Structure & Modular Scripts

All algorithms are fully implemented using JavaScript API for GEE and optimized for fast cloud execution across the Kingdom's geographic boundary:

| Script File | Focused Environmental Indicator | Primary Inputs |
| :--- | :--- | :--- |
| **`01_Jordan_Vegetation_Productivity.js`** | Vegetation Dynamics & Trend Analysis | Sentinel-2 NDVI Time-series |
| **`02_Jordan_SOC_Dynamics_Proxy.js`** | Soil Organic Carbon & Brightness Dynamics | Sentinel-2 Red/NIR/SWIR & BSI |
| **`03_Jordan_LULC_Environmental_Proxy.js`**| Land Cover Classification & Soil Bareness | Multispectral Machine Spectral Thresholds |
| **`04_Jordan_Integrated_Land_Degradation_Map.js`**| Comprehensive National Degradation Map | Combined SDG 15.3.1 Sub-indicators |

---

## 👤 Developed By
**Dr. Haifa AL Mohammad**  
*Senior Geospatial Analysis & GeoAI Specialist*
