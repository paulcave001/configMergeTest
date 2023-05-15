import {
  getCPE,
  getDeviceCategories,
  getDevices,
  getLocations,
  getProfiles,
  getWifiNetworks
} from "../api/apiService";
import { Observable } from "./observable";

export const originalVmConfig = new Observable();
export const vmConfig = new Observable();
export const appReadyState = new Observable();

export const store = {
  selectedUnpausedCards: [],
  tempLastConnectedDevices: [],
  alreadyShownDevicesOnTheDashboard: [],
  lastPausingOrUnpausingDevice: null,
  focusedCard: null,
  lastFocusedCard: null,
  lastActiveSection: 0,
  areDevicesFrozenFromPausing: false,
  vmConfig,
  cancelledRequests: [],
  appReadyState,
  cpe: new Observable(getCPE),
  devices: new Observable(getDevices),
  categories: new Observable(getDeviceCategories),
  locations: new Observable(getLocations),
  profiles: new Observable(getProfiles),
  wifiNetworks: new Observable(getWifiNetworks),
};

// Make store accessible from devtools in dev mode
if (process.env.NODE_ENV === "development") window.store = store;