import axios from "axios";

// ALL REQUESTS TO BE MADE BY ROLE MANAGER

import { Event ,addEventResponse , UsersResponse} from "../dtos/event.dto";
import { addSponsordto ,SponsorsResponse } from "../dtos/sponsor.dto";
import { QueryResponse } from "../dtos/query.dto";
import { mailResponse } from "../dtos/mail.dto";

/**
 * Adds a new event by sending event data to the server.
 *
 * @param eventData - The event details to be added.
 * @returns The server's response containing information about the added event.
 *
 * @throws {Error} If the request fails or the server returns an error.
 */
export async function addEvent(eventData: Event): Promise<addEventResponse> {
    try{
        const url= `${process.env.SERVER_URL}/events`;
        const response=await axios.post(url, eventData);
        return response.data;
    }
    catch (error: any) {
    console.error("Error adding event:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add event");
    }
}

/**
 * Adds a new sponsor by sending sponsor data to the server.
 *
 * @param sponsor - The sponsor information to be added.
 * @returns The server response containing details about the added sponsor.
 *
 * @throws {Error} If the sponsor could not be added or the server returns an error.
 */
export async function addSponsor(sponsor: addSponsordto): Promise<SponsorsResponse> {
    try{
        const url= `${process.env.SERVER_URL}/sponsors`;
        const response=await axios.post(url, sponsor);
        return response.data;
    }
    catch (error: any) {
    console.error("Error adding sponsor:", error?.response?.data || error.message || error);
    throw new Error(error?.response?.data?.message || "Failed to add sponsor");
    }
}

/**
 * Retrieves user-related data for a specific event by category and name.
 *
 * @param eventCategory - The category of the event.
 * @param eventName - The name of the event.
 * @returns The user data associated with the specified event.
 *
 * @throws {Error} If {@link eventCategory} or {@link eventName} is missing, or if the server request fails.
 */
export async function getDataOfEvent(eventCategory:string , eventName:string): Promise<UsersResponse> {
    if (!eventCategory || !eventName) {
        throw new Error("Event category and name are required");
    }
    try {
        const url = `${process.env.SERVER_URL}/admin/event/${eventCategory}/${eventName}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching event data:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch event data");
    }
}

/**
 * Retrieves query data from the server for manager users.
 *
 * @returns The server response containing query data.
 *
 * @throws {Error} If the request fails or the server returns an error.
 */
export async function getQuery() : Promise<QueryResponse> {
    try {
        const url = `${process.env.SERVER_URL}/admin/query`;
        const response = await axios.get(url);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching queries:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to fetch queries");
    }
}

/**
 * Sends a category-specific email related to an event with the provided content and details.
 *
 * @param eventName - The name of the event.
 * @param eventCategory - The category of the event.
 * @param heading - The heading to be used in the email.
 * @param buttontext - The text to display on the email's button.
 * @param buttonlink - The URL to link from the email's button.
 * @param subject - The subject line of the email.
 * @param thankyou - The thank you message to include in the email.
 * @param detail - Additional details to include in the email body.
 * @returns The server's response after sending the email.
 *
 * @throws {Error} If either {@link eventCategory} or {@link eventName} is missing, or if the server fails to send the email.
 */
export async function mailCategory(eventName:string , eventCategory:string,heading:string,buttontext:string,buttonlink:string,subject:string,thankyou:string,detail:string): Promise<mailResponse> {
    if (!eventCategory || !eventName) {
        throw new Error("Event category and name are required");
    }
    try {
        const url = `${process.env.SERVER_URL}/admin/mail/category`;
        const data = {
            eventName,
            eventCategory,
            heading,
            buttontext,
            buttonlink,
            subject,
            thankyou,
            detail
        };
        const response = await axios.post(url, data);
        return response.data;
    } catch (error: any) {
        console.error("Error sending mail:", error?.response?.data || error.message || error);
        throw new Error(error?.response?.data?.message || "Failed to send mail");
    }
}
