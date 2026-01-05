import axios from "axios";
import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = () => ({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

/* CREATE LEAD */
export const createLeadServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "lead/create",
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error creating lead:", error);
    throw error;
  }
};

/* LIST LEADS */
export const getLeadListServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "lead/list",
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error fetching lead list:", error);
    throw error;
  }
};

export const getLeadDetailsServ = async (id, formData) => {
  try {
    const response = await axios.get(
      BASE_URL + "lead/details/" + id,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error fetching lead list:", error);
    throw error;
  }
};

/* UPDATE LEAD DETAILS */
export const updateLeadServ = async (id, formData) => {
  try {
    const response = await axios.put(
      BASE_URL + "lead/update/" + id,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

/* UPDATE LEAD STATUS */
export const updateLeadStatusServ = async (id, formData) => {
  try {
    const response = await axios.put(
      BASE_URL + "lead/update-status/" + id,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

/* DELETE LEAD */
export const deleteLeadServ = async (id) => {
  try {
    const response = await axios.delete(
      BASE_URL + "lead/delete/" + id,
    );
    return response;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};

export const getLeadDashboardDetailsServ = async () => {
  try {
    const response = await axios.get(
      BASE_URL + "lead/dashboard-details",
    );
    return response;
  } catch (error) {
    console.error("Error fetching lead dashboard details:", error);
    throw error;
  }
};