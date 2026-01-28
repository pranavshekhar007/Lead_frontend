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

export const reorderLeadsServ = async (updates) => {
  try {
    const response = await axios.put(
      BASE_URL + "lead/reorder",
      { updates }
    );
    return response;
  } catch (error) {
    console.error("Error reordering leads:", error);
    throw error;
  }
};

/* SCRAPE LEAD */
export const scrapeLeadServ = async (formData) => {
  try {
    const response = await axios.post(
      BASE_URL + "lead/scrape",
      formData,
      // If format is csv or json-file, we expect a blob response
      formData.format && formData.format !== 'json'
        ? { responseType: 'blob' }
        : {}
    );
    return response;
  } catch (error) {
    console.error("Error scraping lead:", error);
    throw error;
  }
};

const _parse_leads = (raw_leads) => {
  const leads = Array.isArray(raw_leads) ? raw_leads : raw_leads?.data || raw_leads?.leads || [];

  const get = (obj, keys) => {
    for (const key of keys) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
        return obj[key];
      }
    }
    return undefined;
  };

  const parseNum = (val) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const cleaned = val.replace(/[^0-9.]/g, "");
      return isNaN(Number(cleaned)) ? 0 : Number(cleaned);
    }
    return 0;
  };

  return leads.map((item) => ({
    leadName: String(get(item, ["leadName", "lead_name", "company", "company_name", "name", "title"]) || "").trim(),
    email: get(item, ["email", "e_mail", "mail_address"]) ? String(get(item, ["email", "e_mail", "mail_address"])).trim() : undefined,
    phone: get(item, ["phone", "phone_number", "mobile", "contact", "tel"]) ? String(get(item, ["phone", "phone_number", "mobile", "contact", "tel"])).trim() : "N/A",
    company: get(item, ["company", "company_name", "business_name", "lead_name"]) ? String(get(item, ["company", "company_name", "business_name", "lead_name"])).trim() : undefined,
    accountName: get(item, ["accountName", "account_name"]) ? String(get(item, ["accountName", "account_name"])).trim() : undefined,
    accountIndustry: get(item, ["accountIndustry", "account_industry", "industry", "category"]) ? String(get(item, ["accountIndustry", "account_industry", "industry", "category"])).trim() : undefined,
    website: get(item, ["website", "url", "link", "web_address"]) ? String(get(item, ["website", "url", "link", "web_address"])).trim() : undefined,
    position: get(item, ["position", "job_title", "designation"]) ? String(get(item, ["position", "job_title", "designation"])).trim() : undefined,
    leadValue: parseNum(get(item, ["leadValue", "lead_value", "value", "price", "price_for_two"])),
    leadStatus: get(item, ["leadStatus", "lead_status", "status_id"]),
    // leadSource: get(item, ["leadSource", "lead_source", "source", "source_id"]),
    address: get(item, ["address", "location", "venue", "city"]) ? String(get(item, ["address", "location", "venue", "city"])).trim() : undefined,
    notes: get(item, ["notes", "description", "details", "amenities"]) ? String(get(item, ["notes", "description", "details", "amenities"])).trim() : undefined,
    status: item.status !== null && item.status !== undefined ? Boolean(item.status) : true,
    order: parseNum(get(item, ["order", "sequence", "rank"])),
  }));
};

/* TRANSFER SCRAPE DATA TO LEADS */
export const transferScrapeDataToLeadsServ = async (raw_leads) => {
  try {
    const parsed_leads = _parse_leads(raw_leads)
    const response = await axios.post(
      BASE_URL + "lead/batch-create",
      parsed_leads,
    );
    return response;
  } catch (error) {
    console.error("Error batch creating lead:", error);
    throw error;
  }
};

