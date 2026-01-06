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

/* CREATE LEAD SOURCE */
export const createLeadSourceServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "lead-source/create",
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error creating lead source:", error);
    throw error;
  }
};

/* LIST LEAD SOURCES */
export const getLeadSourceListServ = async (payload) => {
  try {
    const response = await axios.post(
      BASE_URL + "lead-source/list",
      payload,
    );
    return response;
  } catch (error) {
    console.error("Error fetching lead source list:", error);
    throw error;
  }
};

/* UPDATE LEAD SOURCE */
export const updateLeadSourceServ = async (id, formData) => {
  try {
    const response = await axios.put(
      BASE_URL + "lead-source/update/" + id,
      formData,
    );
    return response;
  } catch (error) {
    console.error("Error updating lead source:", error);
    throw error;
  }
};

/* TOGGLE LEAD SOURCE STATUS */
export const toggleLeadSourceServ = async (id) => {
  try {
    const response = await axios.patch(
      BASE_URL + "lead-source/toggle/" + id,
      {},
    );
    return response;
  } catch (error) {
    console.error("Error toggling lead source:", error);
    throw error;
  }
};

/* DELETE LEAD SOURCE */
export const deleteLeadSourceServ = async (id) => {
  try {
    const response = await axios.delete(
      BASE_URL + "lead-source/delete/" + id,
    );
    return response;
  } catch (error) {
    console.error("Error deleting lead source:", error);
    throw error;
  }
};
