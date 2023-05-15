import { store, vmConfig } from "../util/store";
import { Url } from "../util/urlUtil";
import { AbortHandler } from "./abortController";

const requestHeaders = {
  Authorization: `Bearer ${process.env.APP_API_TOKEN}`,
};

// GET Device list
export async function getDevices() {
  try {
    const config = await vmConfig.await();

    const REQUEST_TIMEOUT = config.abortControllerTimeout;
    const controller = new AbortHandler();
    const timeoutId = setTimeout(() => AbortHandler.cancelRequest(store.devices, controller), REQUEST_TIMEOUT);

    const response = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.device),
      headers: config.api.mock ? {} : requestHeaders,
      signal: controller.signal,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      AbortHandler.clearCancelledRequest(store.devices);
      clearTimeout(timeoutId);
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

// GET DEVICE by ID
export async function getDeviceById(deviceId) {
  try {
    const config = await vmConfig.await();

    if (config.api.mock) {
      const mockDevices = await axios({
        method: "GET",
        url: Url.absolute(config.api.GET.device),
        headers: config.api.mock ? {} : requestHeaders,
      });

      const mockDevice = mockDevices.device.find((device) => device.id === deviceId);
      return mockDevice.data;
    }

    const response = await axios({
      method: "GET",
      url: `${config.api.GET.device}/${deviceId}`,
      headers: config.api.mock ? {} : requestHeaders,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

// GET device categories list
export async function getDeviceCategories() {
  try {
    const config = await vmConfig.await();
    const REQUEST_TIMEOUT = config.abortControllerTimeout;
    const controller = new AbortHandler();
    const timeoutId = setTimeout(() => AbortHandler.cancelRequest(store.categories, controller), REQUEST_TIMEOUT);

    const response = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.deviceCategory),
      headers: config.api.mock ? {} : requestHeaders,
      signal: controller.signal,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      AbortHandler.clearCancelledRequest(store.categories);
      clearTimeout(timeoutId);
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

// GET profiles list with avatars
export async function getProfiles() {
  try {
    const config = await vmConfig.await();
    const REQUEST_TIMEOUT = config.abortControllerTimeout;
    const controller = new AbortHandler();
    const timeoutId = setTimeout(() => AbortHandler.cancelRequest(store.profiles, controller), REQUEST_TIMEOUT);

    const presets = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.profile),
      headers: config.api.mock ? {} : requestHeaders,
      signal: controller.signal,
    });

    const profiles = presets.data.filter((profile) => profile["profile-type"] !== "system");

    const sizeX = 120;
    const sizeY = 120;

    if (config.api.mock) {
      profiles.forEach((profile) => {
        profile.avatarLocation = Url.absolute(profile.avatarLocation);
      });

      AbortHandler.clearCancelledRequest(store.profiles);
      return Promise.resolve(profiles);
    }

    const avatars = await axios({
      method: "GET",
      url: `${config.api.GET.profileAvatar}?all=true&size-x=${sizeX}&size-y=${sizeY}`,
      headers: config.api.mock ? {} : requestHeaders,
    });

    if (!avatars.error) {
      profiles.forEach((profile) => {
        const avatarData = avatars.data.find((avatar) => avatar["avatar-id"] === profile["avatar-id"]);

        if (avatarData) {
          profile.avatarLocation = Url.absolute(config.api.GET.avatar) + avatarData.location;
        }
      });

      AbortHandler.clearCancelledRequest(store.profiles);
      clearTimeout(timeoutId);
      return Promise.resolve(profiles);
    } else {
      console.error(avatars.error);
    }
  } catch (e) {
    console.error(e);
  }
}

// GET location list
export async function getLocations() {
  try {
    const config = await vmConfig.await();
    const REQUEST_TIMEOUT = config.abortControllerTimeout;
    const controller = new AbortHandler();
    const timeoutId = setTimeout(() => AbortHandler.cancelRequest(store.locations, controller), REQUEST_TIMEOUT);

    const presets = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.deviceLocation),
      headers: config.api.mock ? {} : requestHeaders,
      signal: controller.signal,
    });

    if (presets.error) {
      console.error(presets.error);
    } else {
      let locations = [];

      if (config.api.mock) {
        locations = presets.data;
      } else {
        for (let i = 0; i < presets.data.length; i++) {
          const list = await axios({
            method: "GET",
            url: `${config.api.GET.deviceLocation}/${presets.data[i]}`,
            headers: config.api.mock ? {} : requestHeaders,
          });
          locations.push(...list.data);
        }
      }

      clearTimeout(timeoutId);
      return Promise.resolve(locations);
    }
  } catch (e) {
    console.error(e);
  }
}

// GET CPE list
export async function getCPE() {
  try {
    const config = await vmConfig.await();
    const REQUEST_TIMEOUT = config.abortControllerTimeout;
    const controller = new AbortHandler();
    const timeoutId = setTimeout(() => AbortHandler.cancelRequest(store.cpe, controller), REQUEST_TIMEOUT);

    const response = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.cpe),
      headers: config.api.mock ? {} : requestHeaders,
      signal: controller.signal,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      AbortHandler.clearCancelledRequest(store.cpe);
      clearTimeout(timeoutId);
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

// GET CPE by ID
export async function getCPEById(cpeId) {
  try {
    const config = await vmConfig.await();

    if (config.api.mock) {
      const mockDevices = await axios({
        method: "GET",
        url: Url.absolute(config.api.GET.cpe),
        headers: config.api.mock ? {} : requestHeaders,
      });

      const mockCpe = mockDevices.data.cpe.find((cpe) => cpe.id === cpeId);
      return mockCpe;
    }

    const response = await axios({
      method: "GET",
      url: `${config.api.GET.cpe}/${cpeId}`,
      headers: config.api.mock ? {} : requestHeaders,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * PATCH CPE
 *
 * @param {string} cpeId - id of the CPE
 * @param {number} cpeDataVersion - latest known CPE data version to avoid race conditions
 * @param {Object} updateData - object with new CPE props
 * @return {{version: number}}} - object with new version of CPE data
 */
export async function updateCPE(cpeId, cpeDataVersion, updateData) {
  // not currently used
  try {
    const config = await vmConfig.await();

    const response = await axios({
      method: "PATCH",
      url: `${config.api.PATCH.cpe}/${cpeId}`,
      headers: config.api.mock ? {} : requestHeaders,
      data: {
        version: cpeDataVersion,
        ...updateData,
      },
    });

    if (response.error) {
      console.error(response.error);
    } else {
      store.cpe.update();
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * PATCH device
 *
 * @param {string} deviceId - id of the device
 * @param {number} deviceDataVersion - latest known devices' data version to avoid race conditions
 * @param {Object} updateData - object with new device props
 * @return {{version: number}}} - object with new version of device data
 */
export async function updateDevice(deviceId, deviceDataVersion, updateData) {
  const config = await vmConfig.await();

  if (config.api.mock) {
    const mockResponse = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.device),
      headers: config.api.mock ? {} : requestHeaders,
    });
    mockResponse.status = 202;
    return mockResponse.data;
  }

  const response = await axios({
    method: "PATCH",
    url: `${config.api.PATCH.device}/${deviceId}`,
    headers: config.api.mock ? {} : requestHeaders,
    data: {
      version: deviceDataVersion,
      ...updateData,
    },
  });

  if (response.error) {
    console.error(response.error);
  } else {
    return response;
  }

}

/**
 * PATCH multiple devices
 *
 * @param {Object} updateData - object with new devices props
 * @return {{version: number}}} - object with new version of device data
 */
export async function updateMultipleDevices(updateData) {
  const config = await vmConfig.await();

  if (config.api.mock) {
    const mockResponse = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.device),
      headers: config.api.mock ? {} : requestHeaders,
    });
    mockResponse.status = 204;
    return mockResponse.data;
  }

  const response = await axios({
    method: "PATCH",
    url: config.api.PATCH.device,
    headers: config.api.mock ? {} : requestHeaders,
    data: {
      device: updateData,
    },
  });

  if (response.error) {
    console.error(response.error);
  } else {
    return response;
  }
}

/**
 * DELETE device
 *
 * @param {string} deviceId - id of the device
 */
export async function deleteDevice(deviceId) {
  try {
    const config = await vmConfig.await();

    if (config.api.mock) return;

    const response = await axios({
      method: "DELETE",
      url: `${config.api.DELETE.device}/${deviceId}`,
      headers: config.api.mock ? {} : requestHeaders,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      store.devices.update();
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * POST reboot CPE
 *
 * @param {string} cpeId - id of the CPE
 */
export async function rebootCpe(cpeId) {
  const config = await vmConfig.await();

  if (config.api.mock) {
    const mockCpe = await axios({
      method: "GET",
      url: Url.absolute(config.api.GET.cpe),
      headers: config.api.mock ? {} : requestHeaders,
    });

    store.devices.update();
    mockCpe.status = 202;
    return mockCpe.data;
  }

  const response = await axios({
    method: "POST",
    url: `${config.api.POST.cpe}/${cpeId}/action/reboot`,
    headers: config.api.mock ? {} : requestHeaders,
  });

  if (response.error) {
    console.error(response.error);
  } else {
    store.devices.update();
    return response;
  }
}

// GET list of Wi-Fi networks.
export async function getWifiNetworks() {
  try {
    const config = await vmConfig.await();
    const REQUEST_TIMEOUT = config.abortControllerTimeout;
    const controller = new AbortHandler();
    const timeoutId = setTimeout(() => AbortHandler.cancelRequest(store.wifiNetworks, controller), REQUEST_TIMEOUT);
    if (config.api.mock) {
      const mockResponse = await axios({
        method: "GET",
        url: Url.absolute(config.api.GET.wifi),
        headers: config.api.mock ? {} : requestHeaders,
      });

      AbortHandler.clearCancelledRequest(store.wifiNetworks);
      return mockResponse.data;
    }

    const response = await axios({
      method: "GET",
      url: config.api.GET.wifi,
      headers: config.api.mock ? {} : requestHeaders,
      signal: controller.signal,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      AbortHandler.clearCancelledRequest(store.wifiNetworks);
      clearTimeout(timeoutId);
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}

// GET Wi-Fi network by id.
export async function getWifiNetworkById(id) {
  try {
    const config = await vmConfig.await();

    if (config.api.mock) {
      switch (id) {
      case "2271":
        return { passphrase: "H5saRd6Ytra" };
      default:
        return { passphrase: "asf6sAysf3" };
      }
    }

    const response = await axios({
      method: "GET",
      url: `${config.api.GET.wifi}/${id}?with-passphrase=true`,
      headers: config.api.mock ? {} : requestHeaders,
    });

    if (response.error) {
      console.error(response.error);
    } else {
      return response.data;
    }
  } catch (e) {
    console.error(e);
  }
}