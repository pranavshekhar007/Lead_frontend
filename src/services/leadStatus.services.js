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

/* CREATE LEAD STATUS */
export const createLeadStatusServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "lead-status/create",
      formData
    );
    return response;
  } catch (error) {
    console.error("Error creating lead status:", error);
    throw error;
  }
};

/* LIST LEAD STATUS */
export const getLeadStatusListServ = async (payload) => {
  try {
    const response = await axios.post(BASE_URL + "lead-status/list", payload);
    return response;
  } catch (error) {
    console.error("Error fetching lead status list:", error);
    throw error;
  }
};

/* UPDATE LEAD STATUS */
export const updateLeadStatusServ = async (id, formData) => {
  try {
    const response = await axios.put(
      BASE_URL + "lead-status/update/" + id,
      formData
    );
    return response;
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

/* DELETE LEAD STATUS (SOFT DELETE) */
export const deleteLeadStatusServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "lead-status/delete/" + id);
    return response;
  } catch (error) {
    console.error("Error deleting lead status:", error);
    throw error;
  }
};
